#include <WiFi.h>
#include <esp_now.h>

// Function to add a peer if it doesn't exist
void addPeerIfNeeded(const uint8_t *peerAddr) {
  if (!esp_now_is_peer_exist(peerAddr)) {
    esp_now_peer_info_t peerInfo = {};
    memcpy(peerInfo.peer_addr, peerAddr, 6);
    peerInfo.channel = 0;    // Use current channel
    peerInfo.encrypt = false;
    if (esp_now_add_peer(&peerInfo) != ESP_OK) {
      Serial.println("Failed to add peer");
    } else {
      Serial.println("Peer added successfully");
    }
  }
}

void OnDataRecv(const uint8_t *mac_addr, const uint8_t *incomingData, int len) {
  // Convert sender MAC to string for debugging
  char macStr[18];
  snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X",
           mac_addr[0], mac_addr[1], mac_addr[2],
           mac_addr[3], mac_addr[4], mac_addr[5]);
  Serial.print("Received from: ");
  Serial.println(macStr);

  // Convert incoming data into a String (JSON message)
  String jsonMessage = "";
  for (int i = 0; i < len; i++) {
    jsonMessage += (char)incomingData[i];
  }
  Serial.print("Message: ");
  Serial.println(jsonMessage);

  // Dynamically add sender as peer if not already added
  addPeerIfNeeded(mac_addr);

  // Prepare the ACK message
  String ackMsg = "ACK";
  // Send ACK back to the sender using its MAC address
  esp_err_t result = esp_now_send(mac_addr, (uint8_t *)ackMsg.c_str(), ackMsg.length());
  if (result == ESP_OK) {
    Serial.println("ACK sent successfully");
  } else {
    Serial.println("Error sending ACK");
  }
}

void setup() {
  Serial.begin(115200);
  // Set device as a WiFi Station
  WiFi.mode(WIFI_STA);
  
  // Initialize ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  
  // Register the receive callback
  esp_now_register_recv_cb(OnDataRecv);
}

void loop() {
  // The receiver only needs to wait for incoming data; no code needed here.
}
