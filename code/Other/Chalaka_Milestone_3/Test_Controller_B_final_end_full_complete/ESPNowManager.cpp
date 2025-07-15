#include "ESPNowManager.h"
#include <esp_now.h>
#include <esp_wifi.h>
#include "WiFiManager.h"

static esp_now_peer_info_t peer;
static ESPNowManager::RecvCb userCb = nullptr;

static void onDataRecv(const uint8_t* mac, const uint8_t* data, int len) {
  String s;
  for (int i = 0; i < len; i++) s += (char)data[i];
  // Serial.println("⟵ ESP-NOW: " + s);
  if (userCb) userCb(s);
}

namespace ESPNowManager {

  void setPeer(const uint8_t mac_[6]) {
    memset(&peer, 0, sizeof(peer));
    memcpy(peer.peer_addr, mac_, 6);
    peer.channel = WiFiManager::getChannel();
    peer.encrypt = false;
  }

  void begin() {
    // grab the channel from WiFiManager
    uint8_t ch = WiFiManager::getChannel();

    // print it out
    Serial.printf("[ESPNowManager][Debug] Using channel %u for ESP-NOW\n", ch);
    esp_wifi_set_channel(WiFiManager::getChannel(), WIFI_SECOND_CHAN_NONE);
    if (esp_now_init() != ESP_OK) {
      Serial.println("❌ ESP-NOW init failed");
      return;
    }
    esp_now_register_recv_cb(onDataRecv);
    if (peer.peer_addr[0] != 0) {
      esp_now_add_peer(&peer);
      Serial.println("✅ ESP-NOW peer added");
    }
  }

  void onReceive(RecvCb cb) {
    userCb = cb;
  }

  bool send(const String& json) {
    if (peer.peer_addr[0] == 0) return false;
    esp_err_t res = esp_now_send(
      peer.peer_addr,
      (uint8_t*)json.c_str(),
      json.length()
    );
    return (res == ESP_OK);
  }
}
