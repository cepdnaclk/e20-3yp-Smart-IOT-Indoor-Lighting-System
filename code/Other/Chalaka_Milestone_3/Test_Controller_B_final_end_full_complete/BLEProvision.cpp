#include "BLEProvision.h"
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLE2902.h>
#include <ArduinoJson.h>
#include "ConfigManager.h"
#include <WiFi.h>

#define SERVICE_UUID       "12345678-1234-1234-1234-1234567890AB"
#define UUID_MAC_CHAR      "12345678-1234-1234-1234-1234567890AC"
#define UUID_SSID_CHAR     "12345678-1234-1234-1234-1234567890AD"
#define UUID_PASS_CHAR     "12345678-1234-1234-1234-1234567890AE"
#define UUID_CHANNEL_CHAR  "12345678-1234-1234-1234-1234567890AF"

static BLECharacteristic *macChar, *ssidChar, *passChar, *chanChar;
static BLEAdvertising    *pAdv;

class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer*) override {
    // Serial.println("[BLEProvision][Debug] BLE client connected");
  }
  void onDisconnect(BLEServer*) override {
    // Serial.println("[BLEProvision][Debug] BLE client disconnected, restarting advertising");
    pAdv->start();
  }
};

namespace BLEProvision {
  void begin(const char* name) {
    // Serial.printf("[BLEProvision][Debug] Initializing BLE as \"%s\"\n", name);
    BLEDevice::init(name);

    auto srv = BLEDevice::createServer();
    srv->setCallbacks(new ServerCB());

    auto svc = srv->createService(SERVICE_UUID);
    macChar  = svc->createCharacteristic(UUID_MAC_CHAR,
                BLECharacteristic::PROPERTY_READ|BLECharacteristic::PROPERTY_NOTIFY);
    ssidChar = svc->createCharacteristic(UUID_SSID_CHAR,
                BLECharacteristic::PROPERTY_READ|BLECharacteristic::PROPERTY_NOTIFY);
    passChar = svc->createCharacteristic(UUID_PASS_CHAR,
                BLECharacteristic::PROPERTY_READ|BLECharacteristic::PROPERTY_NOTIFY);
    chanChar = svc->createCharacteristic(UUID_CHANNEL_CHAR,
                BLECharacteristic::PROPERTY_READ|BLECharacteristic::PROPERTY_NOTIFY);

    macChar ->addDescriptor(new BLE2902());
    ssidChar->addDescriptor(new BLE2902());
    passChar->addDescriptor(new BLE2902());
    chanChar->addDescriptor(new BLE2902());

    // initialize all to empty / zero
    macChar ->setValue("");
    ssidChar->setValue("");
    passChar->setValue("");
    {
      uint8_t zero = 0;
      chanChar->setValue(&zero, 1);
    }
    // Serial.println("[BLEProvision][Debug] Characteristics initialized to empty/0");

    svc->start();
    pAdv = srv->getAdvertising();
    pAdv->addServiceUUID(SERVICE_UUID);
    pAdv->start();
    // Serial.println("[BLEProvision][Debug] Advertising started");
  }

  void update() {
    // fetch up-to-date values
    // auto m = ConfigManager::getSensorMac();
    String m = WiFi.macAddress();
    auto s = ConfigManager::getSSID();
    auto p = ConfigManager::getPassword();
    uint8_t ch = WiFi.channel();

    Serial.printf("[BLEProvision][Debug] Updating Controller MAC to \"%s\"\n", m.c_str());
    macChar->setValue(m.c_str());
    macChar->notify();

    Serial.printf("[BLEProvision][Debug] Updating SSID to \"%s\"\n", s.c_str());
    ssidChar->setValue(s.c_str());
    ssidChar->notify();

    Serial.printf("[BLEProvision][Debug] Updating Password to \"%s\"\n", p.c_str());
    passChar->setValue(p.c_str());
    passChar->notify();

    Serial.printf("[BLEProvision][Debug] Updating Channel to %u\n", ch);
    chanChar->setValue(&ch, 1);
    chanChar->notify();

    // Serial.println("[BLEProvision][Debug] All characteristics notified");
  }
}
