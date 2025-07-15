#pragma once
#include <Arduino.h>
#include <functional>

namespace ESPNowManager {
  // callback type for incoming JSON payloads
  using RecvCb = std::function<void(const String& json)>;

  // Initialize ESP-NOW, must call after Wi-Fi is up
  void begin();
  // Set the peer MAC address (6 bytes)
  void setPeer(const uint8_t mac[6]);
  // Register your handler for received JSON strings
  void onReceive(RecvCb cb);
  // Send a raw JSON string to the peer (no framing)
  bool send(const String& json);
}
