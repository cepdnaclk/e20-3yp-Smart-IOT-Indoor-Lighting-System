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

// Global/static variables
// static std::queue<String> chunkQueue;
// static uint16_t currentChunkIndex = 0;
// static bool waitingForAck = false;
// static unsigned long lastSendTime = 0;
static const uint16_t MAX_RETRIES = 50;
// static uint16_t retryCount = 0;
// static uint32_t sendSeq = 0;




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
  // DynamicJsonDocument d(512);
  // if (deserializeJson(d, j)) return false;
  // JsonVariant p = d["payload"];
  // if (!p.is<JsonObject>()) return false;
  // JsonObject obj = p.as<JsonObject>();
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
  // if (!isProvisionJson(j)) return;

  // Serial.println("[Provision] Applying new config");
  // // Serial.printf("[Debug] raw JSON: %s\n", j.c_str());

  // ConfigManager::initFromJson(j);
  // ConfigManager::begin();
  // // Serial.println("[Debug] ConfigManager loaded from JSON");



  // Serial.println("[Provision] Reconnecting Wi-Fi…");
  // WiFiManager::begin();

  // // Serial.printf("[Debug] Connected to Wi-Fi, IP=%s\n", WiFiManager::getIP().c_str());
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
    // Serial.printf("[DBG]   JSON parse error: %s\n", err.c_str());
    return;
  }
  // Serial.println("[DBG]   JSON parsed OK");

  // 3) Pick payload vs root
  JsonObject obj;
  if (d.containsKey("payload") && d["payload"].is<JsonObject>()) {
    obj = d["payload"].as<JsonObject>();
    // Serial.println("[DBG]   Using d[\"payload\"] object");
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
    // Serial.println("[DBG]   Missing one of ssid/password/user/mac → return");
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
  // Serial.println("[DBG]   Marked provisioningInProgress & saved lastProvisionJson");

  // --- APPLY CONFIG ---
  Serial.println("[Provision] Applying new config");
  Serial.printf("[Debug] raw JSON: %s\n", j.c_str());

  ConfigManager::initFromJson(j);
  ConfigManager::begin();
  Serial.println("[Debug] ConfigManager loaded from JSON");

  // --- WIFI RECONNECT ---
  Serial.println("[Provision] Reconnecting Wi-Fi…");
  WiFiManager::begin();
  // Serial.println("[DBG]   Returned from WiFiManager::begin()");

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
  // {
  //   DynamicJsonDocument md(128);
  //   md["roomIP"] = WiFiManager::getIP().toString();
  //   String ipj; serializeJson(md, ipj);
  //   // Serial.printf("[Debug] Sending roomIP JSON: %s\n", ipj.c_str());
  //   SerialComm::sendJson(ipj);
  // }

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
//pradeeps function commented by chala boy
// static void onChunk(const String& envelope) {
//   // 1) Raw debug print
//   Serial.println(F("===== onChunk() envelope ====="));
//   Serial.println(envelope);
//   Serial.println(F("================================"));

//   // 2) Parse the envelope JSON
//   StaticJsonDocument<512> doc;
//   auto err = deserializeJson(doc, envelope);
//   if (err) {
//     Serial.print(F("[ERR] envelope JSON parse failed: "));
//     Serial.println(err.c_str());
//     return;
//   }

//   // 3) Inspect the "type" field safely
//   const char* t = doc["type"].as<const char*>();
//   if (t) {
//     if (strcmp(t, "data") == 0) {
//       // 3a) We've got a data chunk → send ACK right away
//       uint32_t seq = doc["seq"];
//       uint16_t idx = doc["chunkIndex"];
//       StaticJsonDocument<128> ackDoc;
//       ackDoc["type"]       = "ack";
//       ackDoc["seq"]        = seq;
//       ackDoc["chunkIndex"] = idx;
//       String ack;
//       serializeJson(ackDoc, ack);
//       Serial.printf("[ACK] Sending ack for seq=%u idx=%u\n", seq, idx);
//       SerialComm::sendJson(ack);
//       // fall through to reassembly…
//     }
//     else if (strcmp(t, "ack") == 0) {
//       // 3b) It's an ACK → we don't reassemble or re-ACK it
//       Serial.println(F("[ACK] Received, skipping reassembly"));
//       return;
//     }
//   }

//   // 4) If we reach here it really is one of your data‐chunk envelopes
//   uint32_t seq      = doc["seq"];
//   uint16_t idx0     = doc["chunkIndex"];   // zero-based index
//   uint16_t total    = doc["numChunks"];
//   const char* slice = doc["data"];
//   size_t sliceLen   = strlen(slice);

//   Serial.printf("[Chunk] seq=%u  chunk=%u/%u  len=%u\n",
//                 seq, idx0 + 1, total, (unsigned)sliceLen);

//   // 5) Reassembly
//   auto &buf = recvBuffers[seq];
//   if (buf.parts.empty()) {
//     buf.total    = total;
//     buf.received = 0;
//     buf.parts.resize(total);
//   }
//   if (idx0 < buf.total && buf.parts[idx0].isEmpty()) {
//     buf.parts[idx0] = slice;
//     buf.received++;
//   }

//   // 6) If we've now got all the pieces, stitch them back together
//   if (buf.received == buf.total) {
//     String full;
//     for (auto &p : buf.parts) full += p;
//     processFullJson(full);
//     recvBuffers.erase(seq);
//   }
// }



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
    // else if (strcmp(t, "ack") == 0) {
    //   // 3b) It's an ACK → we don't reassemble or re-ACK it
    //   Serial.println(F("[ACK] Received, skipping reassembly"));
    //   return;
    // }
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

   
 


// 7) ==== Reliable Re-chunking and Sending over BLE ====

const size_t MAX_SAFE_CHUNK = 100;  // safe size per BLE payload
uint32_t nowSeq = millis();         // unique sequence number
uint16_t numChunks = (full.length() + MAX_SAFE_CHUNK - 1) / MAX_SAFE_CHUNK;

// Reset chunk sending state
chunkQueue = std::queue<String>();
currentChunkIndex = 0;
retryCount = 0;
waitingForAck = false;
sendSeq = nowSeq;

for (uint16_t i = 0; i < numChunks; i++) {
  String part = full.substring(i * MAX_SAFE_CHUNK, (i + 1) * MAX_SAFE_CHUNK);

  StaticJsonDocument<512> chunkDoc;
  chunkDoc["type"] = "data";
  chunkDoc["seq"] = sendSeq;
  chunkDoc["chunkIndex"] = i;
  chunkDoc["numChunks"] = numChunks;
  chunkDoc["data"] = part;

  String payload;
  serializeJson(chunkDoc, payload);

  if (payload.length() <= 250) {
    chunkQueue.push(payload);
  } else {
    Serial.printf("[WARN] Chunk %u too large for BLE, skipped\n", i);
  }
}

Serial.printf("[BLE-Chunk] Enqueued %u chunks for BLE transfer (seq=%lu)\n", numChunks, nowSeq);
lastSendTime = millis();



}}
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
   //clearConfig();

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

    // ESPNowManager::onReceive([](const String& s){
    //   // parse the incoming ESP-NOW JSON
    //   StaticJsonDocument<1024> doc;
    //   DeserializationError err = deserializeJson(doc, s);
    //   if (err) {
    //     Serial.printf("[ESP-NOW] bad JSON, skipping: %s\n", err.c_str());
    //     return;
    //   }

    //   // check for automation_evaluated_set
    //   const char *cmd = doc["command"] | "";
    //   if (strcmp(cmd, "automation_evaluated_set") == 0) {
    //     // build the reduced JSON:
    //     // {"c":"a","p":{"m":[{"b":1,"l":74},…]}}
    //     StaticJsonDocument<512> out;
    //     out["c"] = "a";
    //     JsonObject p = out.createNestedObject("p");
    //     JsonArray m = p.createNestedArray("m");

    //     for (JsonObject bulb : doc["payload"]["message"].as<JsonArray>()) {
    //       JsonObject e = m.createNestedObject();
    //       e["b"] = bulb["bulb_id"].as<int>();
    //       e["l"] = bulb["brightness"].as<int>();
    //     }

    //     String reduced;
    //     serializeJson(out, reduced);
    //     // enqueue for serial‐UART immediately
    //     outQ.push({ nextOutSeq++, reduced });
    //     Serial.printf("[ESP-NOW] queued reduced JSON for serial: %s\n", reduced.c_str());
    //   }
    //   else {
    //     // everything else just goes to the websocket
    //     Serial.println(s);
    //     WebSocketManager::broadcast(s);
    //   }

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
  // } else {
  //   // everything else just goes to the websocket
  //    Serial.println("hi i send to ur sensor data to websocket");
  //   Serial.println(s);
  //   WebSocketManager::broadcast(s);
  // }
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

// void loop(){
//   // —— 1) Drive SerialComm to catch any JSON ——  
//   SerialComm::loop();

//   // —— 2) Pacing: send one ESP-NOW msg every 2000 ms to Controller A ——  
//   // uint32_t now = millis();
//   // if (now - lastOutSend >= 2000 
//   //    && !outQ.empty() 
//   //    && comm.availableForWrite()>0) 
//   // {
//   //   auto *m = outQ.front();
//   //   String frame = String("{\"seq\":") + m->seq +
//   //                  ",\"payload\":" + m->json + "}";
//   //   // Serial.printf("[Debug] Framing to A: %s\n", frame.c_str());

//   //   uint8_t buf[300]; size_t len;
//   //   if (packFrame(frame, buf, len)) {
//   //     comm.write(buf, len);
//   //     // Serial.printf("[Debug] Sent to A seq=%u len=%u\n", m->seq, len);
//   //     outQ.pop();
//   //     lastOutSend = now;
//   //     // Serial.printf("[Debug] outQ pop; head=%u tail=%u\n",
//   //     //               outQ.getHead(), outQ.getTail());
//   //   } else {
//   //     Serial.println("[Error] ESP-NOW frame too big");
//   //   }
//   // }

//   // —— 2) Send any queued serial messages immediately ——  
//   while (!outQ.empty() && comm.availableForWrite() > 0) {
//     auto *m = outQ.front();
  
//     // build the framed JSON
//     String frame = String("{\"seq\":") + m->seq +
//                    ",\"payload\":" + m->json + "}";
//     size_t len;
//     uint8_t buf[300];
//     if (packFrame(frame, buf, len)) {
//       comm.write(buf, len);
//       Serial.printf("[SerialComm] Sent urgent frame seq=%u len=%u\n", m->seq, len);
//     } else {
//       Serial.println("[SerialComm] ERROR: frame too big!");
//     }
  
//     outQ.pop();
//   }


//   // —— 3) Process any Serial JSON cmds: forward selected ones to sensor ——  
//   while (!cmdQ.empty()) {
//     String* p = cmdQ.front();
//     if (p) {
//       // parse the JSON once
//       StaticJsonDocument<512> doc;
//       auto err = deserializeJson(doc, *p);
//       if (err) {
//         Serial.print(F("[Error] invalid JSON on cmdQ: "));
//         Serial.println(err.c_str());
//       } else if (doc.containsKey("command")) {
//         const char *cmd = doc["command"];
//         if (serialDataShouldForwardViaESPNow(cmd)) {
//           Serial.printf("[ESP-NOW] Forwarding command \"%s\"\n", cmd);
//           if (!ESPNowManager::send(*p)) {
//             Serial.println(F("[Error] ESP-NOW send failed"));
//           }
//         } else {
//           Serial.printf("[Info] skipping command \"%s\"\n", cmd);
//         }
//       } else {
//         Serial.println(F("[Warn] no \"command\" field, skipping"));
//       }
//     }
//     cmdQ.pop();
//   }

//   // — nothing else in loop — callbacks/RTOS handle rest —
// }



// void loop() {
//   // —— 1) Drive SerialComm to catch any JSON ——  
//   SerialComm::loop();

//   // —— 2) Send any queued serial messages immediately ——  
//   while (!outQ.empty() && comm.availableForWrite() > 0) {
//     auto *m = outQ.front();
  
//     // build the framed JSON
//     String frame = String("{\"seq\":") + m->seq +
//                    ",\"payload\":" + m->json + "}";
//     size_t len;
//     uint8_t buf[300];
//     if (packFrame(frame, buf, len)) {
//       comm.write(buf, len);
//       Serial.printf("[SerialComm] Sent urgent frame seq=%u len=%u\n", m->seq, len);
//     } else {
//       Serial.println("[SerialComm] ERROR: frame too big!");
//     }
  
//     outQ.pop();
//   }

//   // —— 3) Process any Serial JSON cmds: forward selected ones to sensor ——  
//   while (!cmdQ.empty()) {
//     String* p = cmdQ.front();
//     if (p) {
//       // parse the JSON once
//       StaticJsonDocument<512> doc;
//       auto err = deserializeJson(doc, *p);
//       if (err) {
//         Serial.print(F("[Error] invalid JSON on cmdQ: "));
//         Serial.println(err.c_str());
//       } else if (doc.containsKey("command")) {
//         const char *cmd = doc["command"];
//         if (serialDataShouldForwardViaESPNow(cmd)) {
//           Serial.printf("[ESP-NOW] Forwarding command \"%s\"\n", cmd);
//           if (!ESPNowManager::send(*p)) {
//             Serial.println(F("[Error] ESP-NOW send failed"));
//           }
//         } else {
//           Serial.printf("[Info] skipping command \"%s\"\n", cmd);
//         }
//       } else {
//         Serial.println(F("[Warn] no \"command\" field, skipping"));
//       }
//     }
//     cmdQ.pop();
//   }

//   // —— 4) Reliable Chunk Queue Retry Logic ——  
//   if (!chunkQueue.empty()) {
//     if (!waitingForAck || (millis() - lastSendTime > 200)) {
//       if (retryCount > MAX_RETRIES) {
//         Serial.printf("[FAIL] Chunk %u dropped after %u retries\n", currentChunkIndex, MAX_RETRIES);
//         chunkQueue.pop();
//         currentChunkIndex++;
//         retryCount = -0;
//         waitingForAck = false;
//       } else {
//         String currentPayload = chunkQueue.front();
//         Serial.printf("[SEND] Chunk %u retry #%u\n", currentChunkIndex, retryCount);
//         ESPNowManager::send(currentPayload);
//         lastSendTime = millis();
//         waitingForAck = true;
//         retryCount++;
//       }
//     }
//   }
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
if (!chunkQueue.empty()) {
  // If we are waiting for an ACK, don’t resend yet
  if (!waitingForAck) {
    String currentPayload = chunkQueue.front();
    Serial.printf("[BLE][SEND] Chunk %u attempt #%u\n", currentChunkIndex, retryCount);
    BLEProvision::sendChunk(currentPayload);
    lastSendTime = millis();
    waitingForAck = true;
    retryCount++;
  }
}

// After ACK is received, move to next chunk
if (!waitingForAck && !chunkQueue.empty()) {
  chunkQueue.pop();
  currentChunkIndex++;
  retryCount = 0;
}

}


  