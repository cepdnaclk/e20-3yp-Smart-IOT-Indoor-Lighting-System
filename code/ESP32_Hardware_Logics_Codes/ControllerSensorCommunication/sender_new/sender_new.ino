#include <Arduino.h>
#include <esp_now.h>
#include <WiFi.h>
#include <ArduinoJson.h>  // Include ArduinoJson library

#define RX_PIN 16
#define TX_PIN 17
#define BAUD_RATE 115200

// Replace with the **actual** receiver MAC address
uint8_t receiverMAC[] = {0x94, 0x54, 0xC5, 0xB1, 0x67, 0x68};

// Callback function for sending status
void onSent(const uint8_t *macAddr, esp_now_send_status_t status) {
    Serial.print("📡 Data send status: ");
    Serial.println(status == ESP_NOW_SEND_SUCCESS ? "✅ Success" : "❌ Failed");
}

void setup() {
    Serial.begin(115200);
    Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
    
    WiFi.mode(WIFI_STA);  // Required for ESP-NOW
    if (esp_now_init() != ESP_OK) {
        Serial.println("❌ ESP-NOW Initialization Failed!");
        return;
    }
    esp_now_register_send_cb(onSent);

    // Add peer device
    esp_now_peer_info_t peerInfo;
    memset(&peerInfo, 0, sizeof(peerInfo));
    memcpy(peerInfo.peer_addr, receiverMAC, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;

    if (esp_now_add_peer(&peerInfo) != ESP_OK) {
        Serial.println("❌ Failed to add peer. Check MAC address!");
        return;
    } else {
        Serial.println("✅ Peer added successfully.");
    }

    Serial.println("🚀 ESP32 JSON Sender Ready!");
}

void sendJSONData() {
    // Create JSON object
    StaticJsonDocument<128> jsonDoc;
    jsonDoc["bulb_id"] = 3;  // Example Bulb ID
    jsonDoc["brightness"] = random(5, 20);  // Random brightness value for testing

    // Serialize JSON into a string
    char jsonBuffer[128];
    size_t jsonSize = serializeJson(jsonDoc, jsonBuffer);

    Serial.print("📡 Sending JSON: ");
    Serial.println(jsonBuffer);

    // Send JSON message via ESP-NOW
    esp_err_t result = esp_now_send(receiverMAC, (uint8_t *)jsonBuffer, jsonSize);
    if (result != ESP_OK) {
        Serial.println("❌ ESP-NOW Send Failed!");
    }
}

void loop() {
    sendJSONData();
    delay(20000);  // Send data every 20 seconds
}
