// #pragma once

// namespace BLEProvision {
//   // start BLE GATT provisioning server
//   void begin(const char* deviceName);
//   // update characteristics (SSID, PASS, USER, MAC, CHANNEL)
//   void update();
// }

//appoach 2
// #ifndef BLE_PROVISION_H
// #define BLE_PROVISION_H

// #include <Arduino.h>

// namespace BLEProvision {
//   void begin(const char* name);
//   void update();

//   // ✅ Sends a single BLE data chunk using the custom characteristic
//   void sendChunk(const String& chunk);
// }

// #endif // BLE_PROVISION_H


#ifndef BLE_PROVISION_H
#define BLE_PROVISION_H

#include <Arduino.h>

namespace BLEProvision {
  void begin(const char* name);
  void update();
  void sendChunk(const String& chunk);  // ➕ added for chunked sending
}

#endif // BLE_PROVISION_H
