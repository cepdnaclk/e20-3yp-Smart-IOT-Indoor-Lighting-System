#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <vector>

#include "ring_buffer.h"
#include "frame_protocol.h"

#include "SerialComm.h"
#include "ConfigManager.h"
#include "BLEProvision.h"
#include "WiFiManager.h"
#include "ESPNowManager.h"
#include "WebSocketManager.h"

// ——— for UART2 framing ———
HardwareSerial& comm = Serial2;
const uint32_t   BAUD = 115200;

// ——— queues for outbound ESP-NOW → A and inbound A → sensor ———
struct OutMsg { uint32_t seq; String json; };
static RingBuffer<OutMsg, 32> outQ;
static uint32_t nextOutSeq = 0;
static uint32_t lastOutSend = 0; // millis()

static RingBuffer<String, 32> cmdQ;

// ——— provisioning state ———
static bool   gotInitial = false;
static String initialJson;

// ——— Chunk-reassembly structures ———
struct ChunkBuffer {
  uint16_t total;
  uint16_t received;
  std::vector<String> parts;
};

static std::map<uint32_t,ChunkBuffer> recvBuffers;

static const char * serialForwardableCommandsToSensor[] = {
  "update_automation_mode",
  // add future commands here, e.g.:   // "reboot_sensor", // "set_sensor_params",
};

static bool serialDataShouldForwardViaESPNow(const char *cmd) {
  for (auto c : serialForwardableCommandsToSensor) {
    if (strcmp(c, cmd) == 0) return true;
  }
  return false;
}

// returns true if this JSON has the provisioning shape
static bool isProvisionJson(const String& j){
  DynamicJsonDocument d(512);
  if (deserializeJson(d, j)) return false;
  JsonVariant p = d["payload"];
  if (!p.is<JsonObject>()) return false;
  JsonObject obj = p.as<JsonObject>();
  return obj.containsKey("ssid")
      && obj.containsKey("password")
      && obj.containsKey("user")
      && obj.containsKey("mac");
}

// apply provisioning JSON at any time
static void handleProvisioning(const String& j){
  if (!isProvisionJson(j)) return;

  Serial.println("[Provision] Applying new config");
  // Serial.printf("[Debug] raw JSON: %s\n", j.c_str());

  ConfigManager::initFromJson(j);
  ConfigManager::begin();
  // Serial.println("[Debug] ConfigManager loaded from JSON");



  Serial.println("[Provision] Reconnecting Wi-Fi…");
  WiFiManager::begin();
  // Serial.printf("[Debug] Connected to Wi-Fi, IP=%s\n", WiFiManager::getIP().c_str());

  {
    uint8_t mac[6];
    ConfigManager::getSensorMacBytes(mac);
    ESPNowManager::setPeer(mac);
    ESPNowManager::begin();        // esp_wifi_set_channel(...)
  }
  Serial.println("[Debug] ESP-NOW peer set & initialized");

  BLEProvision::update();
  Serial.println("[Debug] BLEProvision updated with new creds");

  // send new IP back to Controller A
  {
    DynamicJsonDocument md(128);
    md["roomIP"] = WiFiManager::getIP().toString();
    String ipj; serializeJson(md, ipj);
    // Serial.printf("[Debug] Sending roomIP JSON: %s\n", ipj.c_str());
    SerialComm::sendJson(ipj);
  }

  // update WS credential
  WebSocketManager::begin(ConfigManager::getUserName());
  // Serial.printf("[Debug] WebSocketManager started with user=%s\n", ConfigManager::getUserName().c_str());
}

// once we’ve re-assembled a full JSON, call this
static void processFullJson(const String& json) {

  // **PRINT THE FULL JSON** immediately
  Serial.println(F("\n=== Full JSON received ==="));
  Serial.println(json);
  Serial.println(F("=========================="));

  // First-boot provisioning?
  if (!gotInitial && ConfigManager::getSSID().isEmpty()) {
    initialJson = json;
    gotInitial  = true;
    return;
  }

  // Runtime provisioning & queue for ESP-NOW
  handleProvisioning(json);
  cmdQ.push(json);
}

// Called for each 256 B chunk envelope
// Called for each incoming framed payload
static void onChunk(const String& envelope) {
  // 1) Raw debug print
  Serial.println(F("===== onChunk() envelope ====="));
  Serial.println(envelope);
  Serial.println(F("================================"));

  // 2) Parse the envelope JSON
  StaticJsonDocument<512> doc;
  auto err = deserializeJson(doc, envelope);
  if (err) {
    Serial.print(F("[ERR] envelope JSON parse failed: "));
    Serial.println(err.c_str());
    return;
  }

  // 3) Inspect the "type" field safely
  const char* t = doc["type"].as<const char*>();
  if (t) {
    if (strcmp(t, "data") == 0) {
      // 3a) We've got a data chunk → send ACK right away
      uint32_t seq = doc["seq"];
      uint16_t idx = doc["chunkIndex"];
      StaticJsonDocument<128> ackDoc;
      ackDoc["type"]       = "ack";
      ackDoc["seq"]        = seq;
      ackDoc["chunkIndex"] = idx;
      String ack;
      serializeJson(ackDoc, ack);
      Serial.printf("[ACK] Sending ack for seq=%u idx=%u\n", seq, idx);
      SerialComm::sendJson(ack);
      // fall through to reassembly…
    }
    else if (strcmp(t, "ack") == 0) {
      // 3b) It's an ACK → we don't reassemble or re-ACK it
      Serial.println(F("[ACK] Received, skipping reassembly"));
      return;
    }
  }

  // 4) If we reach here it really is one of your data‐chunk envelopes
  uint32_t seq      = doc["seq"];
  uint16_t idx0     = doc["chunkIndex"];   // zero-based index
  uint16_t total    = doc["numChunks"];
  const char* slice = doc["data"];
  size_t sliceLen   = strlen(slice);

  Serial.printf("[Chunk] seq=%u  chunk=%u/%u  len=%u\n",
                seq, idx0 + 1, total, (unsigned)sliceLen);

  // 5) Reassembly
  auto &buf = recvBuffers[seq];
  if (buf.parts.empty()) {
    buf.total    = total;
    buf.received = 0;
    buf.parts.resize(total);
  }
  if (idx0 < buf.total && buf.parts[idx0].isEmpty()) {
    buf.parts[idx0] = slice;
    buf.received++;
  }

  // 6) If we've now got all the pieces, stitch them back together
  if (buf.received == buf.total) {
    String full;
    for (auto &p : buf.parts) full += p;
    processFullJson(full);
    recvBuffers.erase(seq);
  }
}


void setup(){
  Serial.begin(115200);
  while(!Serial) delay(10);

  // —— 1) Serial2 + framed-UART init ——  
  comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.printf("[Setup] Serial2 @ %u baud, RX=16, TX=17\n", BAUD);
  SerialComm::begin(BAUD);
  // Serial.println("[Debug] SerialComm initialized");

  // —— 2) Load any saved config; if empty, we'll block for JSON ——  
  ConfigManager::begin();
  // Serial.println("[Debug] ConfigManager loaded from NVM");

  // —— 3) Catch all *chunk* envelopes from A ——  
  SerialComm::onJsonReceived(onChunk);

    // —— 4) If no saved creds, wait right now ——  
  if (ConfigManager::getSSID().isEmpty()){
    Serial.println("[Setup] Waiting for provisioning JSON…");
    while(!gotInitial){
      SerialComm::loop();
    }
    handleProvisioning(initialJson);
  }

  // —— 5) Full startup now that config is in RAM ——  
  Serial.printf(
    "[Startup] SSID=%s  USER=%s  SENSOR_MAC=%s\n",
    ConfigManager::getSSID().c_str(),
    ConfigManager::getUserName().c_str(),
    ConfigManager::getSensorMac().c_str()
  );

  // // BLE GATT provisioning
  // BLEProvision::begin("ControllerB");
  // BLEProvision::update();
  // Serial.println("[Debug] BLEProvision server running");

  // Wi-Fi
  WiFiManager::begin();
  // Serial.println("[Debug] Wi-FiManager connected");

  // send our IP back to A once more
  {
    DynamicJsonDocument md(128);
    md["roomIP"] = WiFiManager::getIP().toString();
    String ipj; serializeJson(md, ipj);
    // Serial.printf("[Debug] Sending second roomIP JSON: %s\n", ipj.c_str());
    SerialComm::sendJson(ipj);
  }

  // ESP-NOW peer + callback
  {
    uint8_t mac[6];
    ConfigManager::getSensorMacBytes(mac);
    ESPNowManager::setPeer(mac);

    ESPNowManager::onReceive([](const String& s){
      // parse the incoming ESP-NOW JSON
      StaticJsonDocument<1024> doc;
      DeserializationError err = deserializeJson(doc, s);
      if (err) {
        Serial.printf("[ESP-NOW] bad JSON, skipping: %s\n", err.c_str());
        return;
      }

      // check for automation_evaluated_set
      const char *cmd = doc["command"] | "";
      if (strcmp(cmd, "automation_evaluated_set") == 0) {
        // build the reduced JSON:
        // {"c":"a","p":{"m":[{"b":1,"l":74},…]}}
        StaticJsonDocument<512> out;
        out["c"] = "a";
        JsonObject p = out.createNestedObject("p");
        JsonArray m = p.createNestedArray("m");

        for (JsonObject bulb : doc["payload"]["message"].as<JsonArray>()) {
          JsonObject e = m.createNestedObject();
          e["b"] = bulb["bulb_id"].as<int>();
          e["l"] = bulb["brightness"].as<int>();
        }

        String reduced;
        serializeJson(out, reduced);
        // enqueue for serial‐UART immediately
        outQ.push({ nextOutSeq++, reduced });
        Serial.printf("[ESP-NOW] queued reduced JSON for serial: %s\n", reduced.c_str());
      }
      else {
        // everything else just goes to the websocket
        WebSocketManager::broadcast(s);
      }
    });

    ESPNowManager::begin();
    // Serial.println("[Debug] ESPNowManager initialized");
    // BLE GATT provisioning
    //   BLEProvision::begin("ControllerB");
    // BLEProvision::update();
    // Serial.println("[Debug] BLEProvision after ESPNowManager initialized");

  }
  
  BLEProvision::begin("ControllerB");
  BLEProvision::update();
  Serial.println("[Debug] BLEProvision after ESPNowManager initialized");
  // WebSocket server
  WebSocketManager::begin(ConfigManager::getUserName());
  Serial.println("[Debug] WebSocketManager up and running");
}

void loop(){
  // —— 1) Drive SerialComm to catch any JSON ——  
  SerialComm::loop();

  // —— 2) Pacing: send one ESP-NOW msg every 2000 ms to Controller A ——  
  // uint32_t now = millis();
  // if (now - lastOutSend >= 2000 
  //    && !outQ.empty() 
  //    && comm.availableForWrite()>0) 
  // {
  //   auto *m = outQ.front();
  //   String frame = String("{\"seq\":") + m->seq +
  //                  ",\"payload\":" + m->json + "}";
  //   // Serial.printf("[Debug] Framing to A: %s\n", frame.c_str());

  //   uint8_t buf[300]; size_t len;
  //   if (packFrame(frame, buf, len)) {
  //     comm.write(buf, len);
  //     // Serial.printf("[Debug] Sent to A seq=%u len=%u\n", m->seq, len);
  //     outQ.pop();
  //     lastOutSend = now;
  //     // Serial.printf("[Debug] outQ pop; head=%u tail=%u\n",
  //     //               outQ.getHead(), outQ.getTail());
  //   } else {
  //     Serial.println("[Error] ESP-NOW frame too big");
  //   }
  // }

  // —— 2) Send any queued serial messages immediately ——  
  while (!outQ.empty() && comm.availableForWrite() > 0) {
    auto *m = outQ.front();
  
    // build the framed JSON
    String frame = String("{\"seq\":") + m->seq +
                   ",\"payload\":" + m->json + "}";
    size_t len;
    uint8_t buf[300];
    if (packFrame(frame, buf, len)) {
      comm.write(buf, len);
      Serial.printf("[SerialComm] Sent urgent frame seq=%u len=%u\n", m->seq, len);
    } else {
      Serial.println("[SerialComm] ERROR: frame too big!");
    }
  
    outQ.pop();
  }


  // —— 3) Process any Serial JSON cmds: forward selected ones to sensor ——  
  while (!cmdQ.empty()) {
    String* p = cmdQ.front();
    if (p) {
      // parse the JSON once
      StaticJsonDocument<512> doc;
      auto err = deserializeJson(doc, *p);
      if (err) {
        Serial.print(F("[Error] invalid JSON on cmdQ: "));
        Serial.println(err.c_str());
      } else if (doc.containsKey("command")) {
        const char *cmd = doc["command"];
        if (serialDataShouldForwardViaESPNow(cmd)) {
          Serial.printf("[ESP-NOW] Forwarding command \"%s\"\n", cmd);
          if (!ESPNowManager::send(*p)) {
            Serial.println(F("[Error] ESP-NOW send failed"));
          }
        } else {
          Serial.printf("[Info] skipping command \"%s\"\n", cmd);
        }
      } else {
        Serial.println(F("[Warn] no \"command\" field, skipping"));
      }
    }
    cmdQ.pop();
  }

  // — nothing else in loop — callbacks/RTOS handle rest —
}
