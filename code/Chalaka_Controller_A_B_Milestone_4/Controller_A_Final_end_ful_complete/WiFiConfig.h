#pragma once
#include <Arduino.h>

namespace WiFiConfig {
  // load at boot (or portal if missing)
  void begin();

  // getters
  String getSSID();
  String getPassword();
  String getUserName();
  String getSensorMac();

  // Persist helpers
  void saveCredentials(const String& ssid, const String& pass);
  void loadCredentials();
  void saveSensorMac(const String& mac);
  void loadSensorMac();
  void saveUserName(const String& name);
  void loadUserName();

  // Clears ALL stored prefs (wifi & config)
  void reset();
}
