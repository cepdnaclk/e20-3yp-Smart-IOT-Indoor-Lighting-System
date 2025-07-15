#pragma once
#include <IPAddress.h>

namespace WiFiManager {
  // blocks until connected
  void begin();
  IPAddress getIP();
  uint8_t   getChannel();
}
