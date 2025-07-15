// #include "WiFiManager.h"
// #include <WiFi.h>
// #include "ConfigManager.h"
// #include "SerialComm.h"

// namespace WiFiManager {

//   void begin() {
//     String ssid = ConfigManager::getSSID();
//     String pass = ConfigManager::getPassword();

//     Serial.printf("[WiFiManager] ssid='%s', pass='%s'\n", ssid.c_str(), pass.c_str());

//     if (ssid.isEmpty() || pass.isEmpty()) {
//       Serial.println("❌ Empty SSID or password. Aborting Wi-Fi connection.");
//       return;
//     }

//     WiFi.mode(WIFI_AP_STA);
//     WiFi.begin(ssid.c_str(), pass.c_str());

//     Serial.printf("[WiFiManager] Connecting to SSID: %s\n", ssid.c_str());

//     unsigned long start = millis();
//     while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
//       SerialComm::loop();  // BLE stays responsive
//       delay(500);
//       Serial.print('.');
//     }

//     if (WiFi.status() == WL_CONNECTED) {
//       Serial.println("\n✅ Wi-Fi connected!");
//       Serial.println(WiFi.localIP());
//     } else {
//       Serial.println("\n❌ Wi-Fi connection failed. Please retry.");
//     }
//   }

//   IPAddress getIP() {
//     return WiFi.localIP();
//   }

//   uint8_t getChannel() {
//     return WiFi.channel();
//   }
// }

#include "WiFiManager.h"
#include <WiFi.h>
#include "ConfigManager.h"
#include "SerialComm.h"

namespace WiFiManager {

  void begin() {
    String ssid = ConfigManager::getSSID();
    String pass = ConfigManager::getPassword();

    Serial.printf("[WiFiManager] ssid='%s', pass='%s'\n", ssid.c_str(), pass.c_str());

    if (ssid.isEmpty() || pass.isEmpty()) {
      Serial.println("❌ Empty SSID or password. Aborting Wi-Fi connection.");
      return;
    }

    WiFi.mode(WIFI_AP_STA);

    // Retry loop until connected
    while (WiFi.status() != WL_CONNECTED) {
      Serial.printf("[WiFiManager] Connecting to SSID: %s\n", ssid.c_str());
      WiFi.begin(ssid.c_str(), pass.c_str());

      unsigned long start = millis();
      // Wait up to 15 seconds to connect
      while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
        SerialComm::loop();  // BLE stays responsive
        delay(500);
        Serial.print('.');
      }

      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✅ Wi-Fi connected!");
        Serial.println(WiFi.localIP());
        break;  // exit retry loop on success
      } else {
        Serial.println("\n❌ Wi-Fi connection failed. Retrying...");
        // Optionally: add delay here to avoid rapid retry (e.g., delay(2000);)
      }
    }
  }

  IPAddress getIP() {
    return WiFi.localIP();
  }

  uint8_t getChannel() {
    return WiFi.channel();
  }
}




