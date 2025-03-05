#include <WiFi.h>
#include <esp_wifi.h>
#include <esp_now.h>

// Replace with the receiver's MAC address
uint8_t receiverMAC[] = {0x94, 0x54, 0xC5, 0xB1, 0x67, 0x68};

bool ackReceived = false;

// Callback function executed when data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("Send Status: ");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Success" : "Fail");
}

// Callback function executed when data is received (for ACK)
void OnDataRecv(const uint8_t *mac_addr, const uint8_t *incomingData, int len) {
  // Convert incoming data to String
  String receivedMsg = "";
  for (int i = 0; i < len; i++) {
    receivedMsg += (char)incomingData[i];
  }
  Serial.print("Received ACK: ");
  Serial.println(receivedMsg);
  
  // If ACK is received, update the flag
  if (receivedMsg.indexOf("ACK") >= 0) {
    ackReceived = true;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_wifi_set_channel(11, WIFI_SECOND_CHAN_NONE);

  
  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  // Register callbacks
  esp_now_register_send_cb(OnDataSent);
  esp_now_register_recv_cb(OnDataRecv);
  
  // Add the receiver as a peer
  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, receiverMAC, 6);
  peerInfo.channel = 0;    // Use current channel
  peerInfo.encrypt = false;
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }
  
  Serial.println("Sender setup complete");
}

void loop() {
  if (!ackReceived) {
    // Create a JSON message (example: sensor data)
    String jsonMessage = "{\"temperature\":25,\"humidity\":60}";
    Serial.print("Sending: ");
    Serial.println(jsonMessage);
    
    // Send the JSON message to the receiver
    esp_err_t result = esp_now_send(receiverMAC, (uint8_t *)jsonMessage.c_str(), jsonMessage.length());
    if (result == ESP_OK) {
      Serial.println("Message sent successfully");
    } else {
      Serial.println("Error sending the message");
    }
    
    // Wait 2 seconds before resending
    delay(2000);
  } else {
    Serial.println("ACK received. Stopping transmission.");
    // Once ACK is received, you can add other logic or simply halt further sending.
    delay(5000);
  }
}
