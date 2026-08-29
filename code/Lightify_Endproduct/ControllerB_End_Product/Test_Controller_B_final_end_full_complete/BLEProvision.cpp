// BLE GATT server. Four characteristics publish the board's identity and
// Wi-Fi settings to the phone; a fifth carries chunked data out, and the app
// writes an ACK back on the sixth so sendChunk() knows a chunk landed.
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <ArduinoJson.h>
#include "ConfigManager.h"
#include <WiFi.h>
#include <queue>

#define SERVICE_UUID       "12345678-1234-1234-1234-1234567890AB"
#define UUID_MAC_CHAR      "12345678-1234-1234-1234-1234567890AC"
#define UUID_SSID_CHAR     "12345678-1234-1234-1234-1234567890AD"
#define UUID_PASS_CHAR     "12345678-1234-1234-1234-1234567890AE"
#define UUID_CHANNEL_CHAR  "12345678-1234-1234-1234-1234567890AF"
#define UUID_DATA_CHAR     "12345678-1234-1234-1234-1234567890B0"
#define UUID_ACK_CHAR      "12345678-1234-1234-1234-1234567890B1"

extern std::queue<String> chunkQueue;
extern bool waitingForAck;
extern uint32_t sendSeq;
extern uint16_t currentChunkIndex;
extern uint16_t retryCount;
extern unsigned long lastSendTime;

static BLECharacteristic *macChar, *ssidChar, *passChar, *chanChar;
BLECharacteristic *dataChar = nullptr;
BLECharacteristic *ackChar = nullptr;
static BLEAdvertising *pAdv;

class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer*) override {}
  void onDisconnect(BLEServer*) override {
    pAdv->start();
  }
};

class AckCallback : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* characteristic) override {
    std::string value = characteristic->getValue();
    if (value.length() > 0) {
      StaticJsonDocument<128> doc;
      DeserializationError err = deserializeJson(doc, value);
      if (!err) {
  uint32_t ackSeq = doc["ack"];
  uint16_t ackIdx = doc["chunkIndex"];
  Serial.printf("[BLE ACK] 🔄 Received: seq=%lu, chunkIndex=%u\n", ackSeq, ackIdx);

  if (ackSeq == sendSeq && ackIdx == currentChunkIndex) {
    Serial.println("[BLE ACK] ✅ Valid ACK received!");
    waitingForAck = false;  // ACK received — ready for next chunk
  } else {
    Serial.printf("[BLE ACK] ❌ Mismatched ACK: Expected seq=%lu, chunkIndex=%u\n", sendSeq, currentChunkIndex);
  }
} else {
  Serial.printf("[BLE ACK] ❌ Failed to parse ACK: %s\n", err.c_str());
}

    }
  }
};

namespace BLEProvision {

  void begin(const char* name) {
    BLEDevice::init(name);
    BLEDevice::setMTU(247);

    auto srv = BLEDevice::createServer();
    srv->setCallbacks(new ServerCB());

    auto svc = srv->createService(SERVICE_UUID);

    macChar  = svc->createCharacteristic(UUID_MAC_CHAR,
                BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    ssidChar = svc->createCharacteristic(UUID_SSID_CHAR,
                BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    passChar = svc->createCharacteristic(UUID_PASS_CHAR,
                BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
    chanChar = svc->createCharacteristic(UUID_CHANNEL_CHAR,
                BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

    dataChar = svc->createCharacteristic(UUID_DATA_CHAR,
                BLECharacteristic::PROPERTY_NOTIFY);
    dataChar->addDescriptor(new BLE2902());
    dataChar->setValue("");

    ackChar = svc->createCharacteristic(UUID_ACK_CHAR,
                BLECharacteristic::PROPERTY_WRITE);
    ackChar->setCallbacks(new AckCallback());
    ackChar->setValue("");

    macChar ->addDescriptor(new BLE2902());
    ssidChar->addDescriptor(new BLE2902());
    passChar->addDescriptor(new BLE2902());
    chanChar->addDescriptor(new BLE2902());

    macChar->setValue("");
    ssidChar->setValue("");
    passChar->setValue("");
    {
      uint8_t zero = 0;
      chanChar->setValue(&zero, 1);
    }

    svc->start();
    pAdv = srv->getAdvertising();
    pAdv->addServiceUUID(SERVICE_UUID);
    pAdv->start();
  }

  void update() {
    String m = WiFi.macAddress();
    auto s = ConfigManager::getSSID();
    auto p = ConfigManager::getPassword();
    uint8_t ch = WiFi.channel();

    macChar->setValue(m.c_str());
    macChar->notify();
    Serial.print("[BLEProvision] 🔧 Sending MAC: ");
    Serial.println(m);

    ssidChar->setValue(s.c_str());
    ssidChar->notify();
    Serial.print("[BLEProvision] 📶 Sending SSID: ");
    Serial.println(s);

    passChar->setValue(p.c_str());
    passChar->notify();
    Serial.print("[BLEProvision] 🔑 Sending Password: ");
    Serial.println(p);

    chanChar->setValue(&ch, 1);
    chanChar->notify();
    Serial.print("[BLEProvision] 📡 Sending Wi-Fi Channel: ");
    Serial.println(ch);
  }

  void sendChunk(const String& chunk) {
  if (chunk.length() == 0) {
    Serial.println("[BLEProvision] ❌ Empty chunk, not sending");
    return;
  }
  if (dataChar) {
    dataChar->setValue(chunk.c_str());
    dataChar->notify();
    Serial.printf("[BLEProvision] Sent chunk over BLE (%u bytes)\n", chunk.length());
  } else {
    Serial.println("[BLEProvision] ERROR: dataChar is null");
  }
}


}
