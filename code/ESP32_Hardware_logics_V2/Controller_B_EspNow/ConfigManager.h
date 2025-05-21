#pragma once
#include <Arduino.h>

namespace ConfigManager {
  // Parse the initial JSON from Controller A and save to NVM
  void initFromJson(const String& json);

  // Load from NVM into RAM
  void begin();

  // Accessors
  String getSSID();
  String getPassword();
  String getUserName();
  String getSensorMac();
  void   getSensorMacBytes(uint8_t out[6]);
}
