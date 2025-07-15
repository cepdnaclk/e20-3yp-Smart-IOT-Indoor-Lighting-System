#pragma once

namespace BLEProvision {
  // start BLE GATT provisioning server
  void begin(const char* deviceName);
  // update characteristics (SSID, PASS, USER, MAC, CHANNEL)
  void update();
}
