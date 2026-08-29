#pragma once
#include <Arduino.h>
#include <functional>

using MqttCallback = std::function<void(const String& topic, const String& payload)>;

namespace MQTTHandler {
  void begin(const char* server, int port,
             const char* rootCA, const char* clientCRT, const char* clientKey,
             const char* clientId, const char* subscribeTopic);
  void onMessage(MqttCallback cb);
  void loop();
  bool publish(const char* topic, const char* msg);

  // Publishes Controller B's LAN IP so the phone app can find its WebSocket.
  void sendWebSocketIP(const char* topic,const String& ipAddress);


}
