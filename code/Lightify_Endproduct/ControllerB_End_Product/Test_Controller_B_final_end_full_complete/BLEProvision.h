#ifndef BLE_PROVISION_H
#define BLE_PROVISION_H

#include <Arduino.h>

namespace BLEProvision {
  void begin(const char* name);
  void update();
  void sendChunk(const String& chunk);  // ➕ added for chunked sending
}

#endif // BLE_PROVISION_H
