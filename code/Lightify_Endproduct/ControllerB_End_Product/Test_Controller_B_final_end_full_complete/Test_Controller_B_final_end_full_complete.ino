#include <Arduino.h>
#include <ArduinoJson.h>
#include <map>
#include <vector>
#include <Preferences.h>

//final updated controller B fixed websocket correctly
//final updated controller B fixed the issue of empty json from A

//chalas code respect him

#include "ring_buffer.h"
#include "frame_protocol.h"

#include "SerialComm.h"
#include "ConfigManager.h"
#include "BLEProvision.h"
#include "WiFiManager.h"
#include "ESPNowManager.h"
#include "WebSocketManager.h"


#include <queue>

static const uint16_t MAX_RETRIES = 50;




#include <queue>

// Global/static variables (define here)
std::queue<String> chunkQueue;
bool waitingForAck = false;
uint32_t sendSeq = 0;
uint16_t currentChunkIndex = 0;
uint16_t retryCount = 0;
unsigned long lastSendTime = 0;


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
  DynamicJsonDocument d(2048);
  if (deserializeJson(d, j)) return false;

  JsonObject obj;
  if (d.containsKey("payload") && d["payload"].is<JsonObject>()) {
    obj = d["payload"].as<JsonObject>();
  } else {
    obj = d.as<JsonObject>();
  }

  return obj.containsKey("ssid")
      && obj.containsKey("password")
      && obj.containsKey("user")
      && obj.containsKey("mac");
}

// at top of your .ino (or shared header)
static bool provisioningInProgress  = false;
static String lastProvisionJson     = "";



// apply provisioning JSON at any time
static void handleProvisioning(const String& j){
// --- ENTRY TRACE ---
  Serial.println("[DBG] ▶ handleProvisioning() called");

  // 1) Bail if we’re already running
  if (provisioningInProgress) {
    Serial.println("[DBG]   provisioningInProgress == true → early return");
    return;
  }
  Serial.println("[DBG]   Not busy, continuing");

  // 2) Parse JSON
  DynamicJsonDocument d(2048);
  DeserializationError err = deserializeJson(d, j);
  if (err) {
    return;
  }

  // 3) Pick payload vs root
  JsonObject obj;
  if (d.containsKey("payload") && d["payload"].is<JsonObject>()) {
    obj = d["payload"].as<JsonObject>();
  } else {
    obj = d.as<JsonObject>();
    Serial.println("[DBG]   Using root object");
  }

  // 4) Validate keys
  if (!( obj.containsKey("ssid")
      && obj.containsKey("password")
      && obj.containsKey("user")
      && obj.containsKey("mac") ))
  {
    return;
  }
  Serial.println("[DBG]   All required keys present");

  // 5) Skip duplicate JSON
  if (j == lastProvisionJson) {
    Serial.println("[DBG]   Duplicate payload, skipping");
    return;
  }

  // 6) Mark busy & remember this payload
  provisioningInProgress = true;
  lastProvisionJson     = j;

  // --- APPLY CONFIG ---
  Serial.println("[Provision] Applying new config");
  Serial.printf("[Debug] raw JSON: %s\n", j.c_str());

  ConfigManager::initFromJson(j);
  ConfigManager::begin();
  Serial.println("[Debug] ConfigManager loaded from JSON");

  // --- WIFI RECONNECT ---
  Serial.println("[Provision] Reconnecting Wi-Fi…");
  WiFiManager::begin();

  {
    uint8_t mac[6];
    ConfigManager::getSensorMacBytes(mac);
    ESPNowManager::setPeer(mac);
    ESPNowManager::begin();        // esp_wifi_set_channel(...)
  }
  Serial.println("[Debug] ESP-NOW peer set & initialized");

  BLEProvision::update();
  Serial.println("[Debug] BLEProvision updated with new creds");

  {
  DynamicJsonDocument doc(256);  // Create the main document

  doc["command"] = "websocket_ip";  // Add the command field

  // Create nested payload
  JsonObject payload = doc.createNestedObject("payload");
  payload["ipaddress"] = WiFiManager::getIP().toString();  // Get current IP

  // Serialize to string
  String jsonToSend;
  serializeJson(doc, jsonToSend);

  // Send JSON via your serial communication handler
  SerialComm::sendJson(jsonToSend);

  // Print the JSON to Serial Monitor for debugging
  Serial.println("[Debug] Sending JSON:");
  Serial.println(jsonToSend);

}

  WebSocketManager::begin(ConfigManager::getUserName());
  provisioningInProgress = false;
  
}

// once we’ve re-assembled a full JSON, call this
static void processFullJson(const String& json) {

  // **PRINT THE FULL JSON** immediately
  Serial.println(F("\n=== Full JSON received ==="));
  Serial.println(json);
  Serial.println(F("=========================="));

  // First-boot provisioning? && ConfigManager::getSSID().isEmpty()
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
//chala modify function get the chunks create the full json and again chunk into small peices to send via esp now
static void onChunk(const String& envelope) {

  Serial.println("Received chunk envelope:");
  Serial.println(envelope);
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
  Serial.println(F("[ACK] Received, skipping reassembly"));

  // Extract ACK info:
  uint32_t ackSeq = doc["seq"];
  uint16_t ackIdx = doc["chunkIndex"];

  // Only clear waitingForAck if ACK matches current sent chunk:
  if (waitingForAck && ackSeq == sendSeq && ackIdx == currentChunkIndex) {
    Serial.printf("[ACK] ACK matches current chunk seq=%u idx=%u\n", ackSeq, ackIdx);
    waitingForAck = false;
    retryCount = 0;
    currentChunkIndex++;
    if (!chunkQueue.empty()) {
      chunkQueue.pop();
    }
  } else {
    Serial.printf("[ACK] Received ACK for seq=%u idx=%u but not current chunk seq=%u idx=%u\n",
                  ackSeq, ackIdx, sendSeq, currentChunkIndex);
  }

  return; // no reassembly for ACKs
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

  Serial.println("[INFO] Full JSON received and processed. Restarting ESP32...");
  delay(100); // Short delay before restart for logging
  ESP.restart();  // Restart ESP32 instead of sending over BLE
}

}
void clearConfig() {
  Preferences pref;
  pref.begin("cfg", false);
  pref.clear();  // clears all keys in "cfg" namespace
  pref.end();
  Serial.println("[Config] Cleared stored Wi-Fi credentials");
}



void setup(){
   
  Serial.begin(115200);
  while(!Serial) delay(10);

  // —— 1) Serial2 + framed-UART init ——  
  comm.begin(BAUD, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.printf("[Setup] Serial2 @ %u baud, RX=16, TX=17\n", BAUD);
  SerialComm::begin(BAUD);


  // —— 2) Load any saved config; if empty, we'll block for JSON ——  
  ConfigManager::begin();

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


  WiFiManager::begin();
 
 //websocketip sending by controller B to A
{
  DynamicJsonDocument doc(256);  // Create the main document

  doc["command"] = "websocket_ip";  // Add the command field

  // Create nested payload
  JsonObject payload = doc.createNestedObject("payload");
  payload["ipaddress"] = WiFiManager::getIP().toString();  // Get current IP

  // Serialize to string
  String jsonToSend;
  serializeJson(doc, jsonToSend);

  // Send JSON via your serial communication handler
  SerialComm::sendJson(jsonToSend);

  // Print the JSON to Serial Monitor for debugging
  Serial.println("[Debug] Sending JSON:");
  Serial.println(jsonToSend);
}



  // ESP-NOW peer + callback
  {
    uint8_t mac[6];
    ConfigManager::getSensorMacBytes(mac);
    ESPNowManager::setPeer(mac);

    ESPNowManager::onReceive([](const String& s) {
  // parse the incoming ESP-NOW JSON
  StaticJsonDocument<1024> doc;
  DeserializationError err = deserializeJson(doc, s);
  if (err) {
    Serial.printf("[ESP-NOW] bad JSON, skipping: %s\n", err.c_str());
    return;
  }

  // check for short command type "c":"a"
  const char *cmd = doc["c"] | "";
  if (strcmp(cmd, "a") == 0) {
    // Directly queue the original string without any changes
    outQ.push({ nextOutSeq++, s });
    Serial.printf("[ESP-NOW] queued raw JSON for serial: %s\n", s.c_str());
  
  } else {
  Serial.println("hi i send to ur sensor data to websocket");
  Serial.println(s);
  WebSocketManager::enqueueMessage(s);  // ✅ Queue instead of direct send
}

    });

    ESPNowManager::begin();
    

  }
  
  BLEProvision::begin("ControllerB");
  BLEProvision::update();
  Serial.println("[Debug] BLEProvision after ESPNowManager initialized");
  // WebSocket server
  WebSocketManager::begin(ConfigManager::getUserName());
  Serial.println("[Debug] WebSocketManager up and running");
}

void loop() {
  // —— 1) Drive SerialComm to catch any JSON ——
  SerialComm::loop();

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
    StaticJsonDocument<512> doc;
    auto err = deserializeJson(doc, *p);
    if (err) {
      Serial.print(F("[Error] invalid JSON on cmdQ: "));
      Serial.println(err.c_str());
    } else if (doc.containsKey("command")) {
      const char *cmd = doc["command"];
      if (serialDataShouldForwardViaESPNow(cmd)) {
        Serial.printf("[BLE] Forwarding command \"%s\"\n", cmd);
        BLEProvision::sendChunk(*p);  // ✅ Forward via BLE
      } else {
        Serial.printf("[Info] skipping command \"%s\"\n", cmd);
      }
    } else {
      Serial.println(F("[Warn] no \"command\" field, skipping"));
    }
  }
  cmdQ.pop();
}

// —— 4) Reliable Chunk Queue Retry Logic ——
unsigned long now = millis();

if (!chunkQueue.empty()) {
  if (waitingForAck) {
  if (now - lastSendTime > 1000) {  // 1 second retry interval
    if (retryCount >= MAX_RETRIES) {
      // Sensor has stopped answering. Drop the whole message rather than retry
      // forever - it cannot be reassembled without this chunk anyway.
      Serial.printf("[BLE][FAIL] Giving up on chunk %u (seq=%lu) after %u retries\n",
                    currentChunkIndex, sendSeq, retryCount);
      while (!chunkQueue.empty()) chunkQueue.pop();
      waitingForAck = false;
      retryCount = 0;
      currentChunkIndex = 0;
    } else {
      Serial.printf("[BLE][RETRY] Resending Chunk %u (seq=%lu), attempt #%u\n", currentChunkIndex, sendSeq, retryCount);
      BLEProvision::sendChunk(chunkQueue.front());
      lastSendTime = now;
      retryCount++;
    }
  }
} else {
  // ACK received — send next chunk
  String currentPayload = chunkQueue.front();
  Serial.printf("[BLE][SEND] Chunk %u attempt #%u\n", currentChunkIndex, retryCount);
  BLEProvision::sendChunk(currentPayload);
  lastSendTime = now;
  waitingForAck = true;
  retryCount++;
}

}

}


  