#include "WiFiManager.h"
#include <WiFi.h>
#include "ConfigManager.h"
#include "SerialComm.h"

namespace WiFiManager {
  void begin() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ConfigManager::getSSID().c_str(),
               ConfigManager::getPassword().c_str());
    Serial.print("🔌 Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
      SerialComm::loop();
      delay(100);
      Serial.print('.');
    }
    Serial.println("\n✅ Wi-Fi up: " + WiFi.localIP().toString());
  }

  IPAddress getIP()      { return WiFi.localIP(); }
  uint8_t   getChannel() { return WiFi.channel(); }
}
