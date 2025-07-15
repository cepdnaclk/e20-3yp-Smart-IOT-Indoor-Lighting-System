#include "MQTTHandler.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// ——— Internal objects ———
static WiFiClientSecure  secureClient;
static PubSubClient      mqttClient(secureClient);
static MqttCallback      userCb      = nullptr;
static const char*       subTopic    = nullptr;

namespace MQTTHandler {

  // Called by PubSubClient on each incoming message
  static void internalCb(char* topic, byte* payload, unsigned int len) {
    // Serial.printf("[MQTT][Debug] Message arrived on topic %s, len=%u\n", topic, len);
    if (!userCb) return;
    String s;
    for (unsigned i = 0; i < len; i++) {
      s += (char)payload[i];
    }
    // Serial.printf("[MQTT][Debug] Payload: %s\n", s.c_str());
    userCb(String(topic), s);
  }

  void begin(const char* server, int port,
             const char* rootCA, const char* clientCRT, const char* clientKey,
             const char* clientId, const char* subscribeTopic) {
    Serial.println("[MQTT][Debug] Initializing TLS credentials");
    secureClient.setCACert(rootCA);
    secureClient.setCertificate(clientCRT);
    secureClient.setPrivateKey(clientKey);

    Serial.printf("[MQTT][Debug] Setting server %s:%d\n", server, port);
    mqttClient.setServer(server, port);
    mqttClient.setCallback(internalCb);

    subTopic = subscribeTopic;

    // Only do the blocking connect if we're already on Wi-Fi:
    if (WiFi.status() == WL_CONNECTED) {
      unsigned long start = millis();
      const unsigned long timeout = 10UL * 100; // e.g. 1s
      Serial.println("[MQTT][Debug] Attempting initial connection to broker...");
      while (!mqttClient.connected() && millis() - start < timeout) {
        if (mqttClient.connect(clientId)) {
          Serial.println("[MQTT][Debug] Connected to broker, subscribing...");
          mqttClient.subscribe(subTopic);
          Serial.printf("[MQTT][Debug] Subscribed to %s\n", subTopic);
        } else {
          delay(2000);
        }
        Serial.printf("[MQTT][Debug] while loop");
      }
      if (!mqttClient.connected()) {
        Serial.println("⚠️ MQTT connect timed out");
      }
    } else {
      Serial.println("⚠️ Wi-Fi not up, skipping MQTT connect");
    }
  }

  void onMessage(MqttCallback cb) {
    userCb = cb;
    // Serial.println("[MQTT][Debug] User callback registered");
  }

  void loop() {
    if (!mqttClient.connected()) {
      Serial.println("[MQTT][Debug] Lost connection, reconnecting...");
      while (!mqttClient.connected()) {
        if (mqttClient.connect("ESP32_Client")) {
          Serial.println("[MQTT][Debug] Reconnected, re-subscribing...");
          mqttClient.subscribe(subTopic);
          Serial.printf("[MQTT][Debug] Re-subscribed to %s\n", subTopic);
        } else {
          Serial.printf("[MQTT][Debug] Reconnect failed, state=%d. Retrying in 1s\n", mqttClient.state());
          delay(1000);
        }
      }
    }
    mqttClient.loop();
  }

  bool publish(const char* topic, const char* msg) {
    Serial.printf("[MQTT][Debug] Publishing to %s: %s\n", topic, msg);
    bool ok = mqttClient.publish(topic, msg);
    Serial.printf("[MQTT][Debug] Publish %s\n", ok ? "succeeded" : "failed");
    return ok;
  }
//chalas function to send ip as a json to iot core
  void sendWebSocketIP(const char* topic,const String& ipAddress) {
  String json = "{";
  json += "\"command\": \"websocket_ip\",";
  json += "\"payload\": {";
  json += "\"ipaddress\": \"" + ipAddress + "\"";
  json += "}";
  json += "}";

  // MQTTHandler::publish(topic, json.c_str());
   publish(topic, json.c_str()); // Call internal publish
}


} // namespace MQTTHandler
