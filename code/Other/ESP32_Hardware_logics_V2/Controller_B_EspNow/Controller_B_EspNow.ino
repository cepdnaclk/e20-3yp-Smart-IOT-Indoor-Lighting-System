#include <Arduino.h>
#include <ArduinoJson.h>

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

  // —— 3) Catch all JSON from A ——  
  SerialComm::onJsonReceived([](const String& j){
    // Serial.printf("[Debug] Received framed JSON from A: %s\n", j.c_str());

    // first-boot provisioning?
    if (!gotInitial && ConfigManager::getSSID().isEmpty()){
      initialJson = j;
      gotInitial  = true;
      // Serial.println("[Debug] Captured initial provisioning JSON");
      return;
    }
    // runtime provisioning?
    handleProvisioning(j);
    // also buffer it for print/forward:
    cmdQ.push(j);
    // Serial.printf("[Debug] Pushed runtime JSON to cmdQ; head=%u tail=%u\n",
    //               cmdQ.getHead(), cmdQ.getTail());
  });

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
      // Serial.printf("[Debug] onReceive ESP-NOW JSON: %s\n", s.c_str());
      Serial.println("⟵ ESP-NOW: " + s);

      // optional JSON field parsing
      DynamicJsonDocument doc(1024);
      if (!deserializeJson(doc, s)) {
        int seq  = doc["seq"];
        int16_t x = doc["x"];
        int16_t y = doc["y"];
        Serial.printf("    seq=%d  x=%d  y=%d\n", seq, x, y);
      }

      // buffer for paced send to A
      // Serial.printf("[Debug] Queuing ESP-NOW msg to outQ seq=%u\n", nextOutSeq);
      outQ.push({ nextOutSeq++, s });

      // normal WS broadcast
      WebSocketManager::broadcast(s);
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
  uint32_t now = millis();
  if (now - lastOutSend >= 2000 
     && !outQ.empty() 
     && comm.availableForWrite()>0) 
  {
    auto *m = outQ.front();
    String frame = String("{\"seq\":") + m->seq +
                   ",\"payload\":" + m->json + "}";
    Serial.printf("[Debug] Framing to A: %s\n", frame.c_str());

    uint8_t buf[300]; size_t len;
    if (packFrame(frame, buf, len)) {
      comm.write(buf, len);
      Serial.printf("[Debug] Sent to A seq=%u len=%u\n", m->seq, len);
      outQ.pop();
      lastOutSend = now;
      // Serial.printf("[Debug] outQ pop; head=%u tail=%u\n",
      //               outQ.getHead(), outQ.getTail());
    } else {
      Serial.println("[Error] ESP-NOW frame too big");
    }
  }

  // —— 3) Process any Serial JSON cmds: print & forward to sensor ——  
  while (!cmdQ.empty()) {
    String* p = cmdQ.front();
    if (p) {
      Serial.println("[Recv JSON] " + *p);
      Serial.println("[Process Cmd] " + *p);
      // Serial.printf("[Debug] Sending to sensor via ESP-NOW: %s\n", p->c_str());
      if (!ESPNowManager::send(*p)) {
        Serial.println("[Error] ESP-NOW send failed");
      }
    }
    cmdQ.pop();
    // Serial.printf("[Debug] cmdQ pop; head=%u tail=%u\n",
    //               cmdQ.getHead(), cmdQ.getTail());
  }

  // — nothing else in loop — callbacks/RTOS handle rest —
}
