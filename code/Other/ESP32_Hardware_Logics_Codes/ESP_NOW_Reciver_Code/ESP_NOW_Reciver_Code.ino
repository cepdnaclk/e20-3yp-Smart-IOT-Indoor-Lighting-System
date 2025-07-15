#include <Arduino.h>
#include <esp_now.h>
#include <WiFi.h>

// Structure to receive data
typedef struct {
    float distance;
    float angle;
} RadarData;

RadarData radarData;

// Updated callback function with the correct signature
void onDataRecv(const esp_now_recv_info_t *recv_info, const uint8_t *incomingData, int len) {
    // (Optional) Retrieve the sender's MAC address from recv_info->src_addr if needed
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X",
             recv_info->src_addr[0], recv_info->src_addr[1], recv_info->src_addr[2],
             recv_info->src_addr[3], recv_info->src_addr[4], recv_info->src_addr[5]);
    Serial.print("Received data from: ");
    Serial.println(macStr);

    // Copy the received data into our RadarData structure
    memcpy(&radarData, incomingData, sizeof(radarData));
    
    Serial.print("📡 Received: Distance ");
    Serial.print(radarData.distance);
    Serial.print(" cm, Angle ");
    Serial.println(radarData.angle);
}

void setup() {
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);  // Required for ESP-NOW
    
    if (esp_now_init() != ESP_OK) {
        Serial.println("ESP-NOW Initialization Failed!");
        return;
    }
    
    // Register the updated receive callback
    esp_now_register_recv_cb(onDataRecv);
    
    Serial.println("ESP32 Receiver Ready!");
}

void loop() {
    // The receiver loop does nothing; it waits for incoming ESP-NOW data.
}
