#include "WebSocketManager.h"
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

static WebSocketsServer ws(81);
static String validUser;
static int    wsClient = -1;
static bool   authOK[8] = {};

static void onEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t len) {
  switch (type) {
    case WStype_CONNECTED:
      wsClient = num;
      authOK[num] = false;
      Serial.printf("🌐 WS client %u connected\n", num);
      break;
    case WStype_DISCONNECTED:
      Serial.printf("🌐 WS client %u disconnected\n", num);
      authOK[num] = false;
      if (wsClient == num) wsClient = -1;
      break;
    case WStype_TEXT: {
      StaticJsonDocument<200> d;
      deserializeJson(d, payload, len);
      const char* u = d["username"];
      if (u && validUser == String(u)) {
        authOK[num] = true;
        ws.sendTXT(num, "{\"status\":\"ok\"}");
        Serial.printf("✅ WS client %u authenticated\n", num);
      } else {
        ws.sendTXT(num, "{\"error\":\"bad user\"}");
      }
      break;
    }
    default: break;
  }
}

static void wsTask(void*) {
  for (;;) {
    ws.loop();
    vTaskDelay(pdMS_TO_TICKS(10));
  }
}

namespace WebSocketManager {
  void begin(const String& user) {
    validUser = user;
    ws.begin();
    ws.onEvent(onEvent);
    xTaskCreatePinnedToCore(
      wsTask, "ws", 4096, nullptr, 1, nullptr, 0
    );
    Serial.println("🚀 WebSocket server started on port 81");
  }

  void broadcast(const String& msg) {
    if (wsClient >= 0 && authOK[wsClient]) {
      // must pass a mutable String
      String copy = msg;
      ws.sendTXT(wsClient, copy);
    }
  }
}
