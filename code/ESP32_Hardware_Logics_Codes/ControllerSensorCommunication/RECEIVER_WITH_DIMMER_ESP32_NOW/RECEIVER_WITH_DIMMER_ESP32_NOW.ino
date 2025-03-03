#include <Arduino.h>
#include <WiFi.h>
#include <esp_now.h>
#include <ArduinoJson.h>
#include <RBDdimmer.h>  // RobotDyn Dimmer Library

// Define Serial Communication
#define USE_SERIAL Serial

// Define Output Pins for the Dimmer Module
#define outputPin1  4   // GPIO4 - CH1
#define outputPin2  16  // GPIO16 - CH2
#define outputPin3  21  // GPIO21 - CH3
#define outputPin4  23  // GPIO23 - CH4

// Define Zero-Cross Detection Pin
#define zerocross 5  // GPIO5 - Zero-cross detection

// Create Dimmer Objects
dimmerLamp dimmer1(outputPin1, zerocross);
dimmerLamp dimmer2(outputPin2, zerocross);
dimmerLamp dimmer3(outputPin3, zerocross);
dimmerLamp dimmer4(outputPin4, zerocross);

// Structure for receiving JSON data
typedef struct {
    char jsonMessage[100]; // Buffer to store JSON data
} JsonData;

JsonData receivedData;

// Callback function when data is received
void onDataRecv(const uint8_t *mac_addr, const uint8_t *incomingData, int len) {
    memcpy(&receivedData, incomingData, sizeof(receivedData)); 

    Serial.print("Received JSON: ");
    Serial.println(receivedData.jsonMessage);

    // Parse JSON
    DynamicJsonDocument doc(200);  // Use DynamicJsonDocument instead of StaticJsonDocument
    DeserializationError error = deserializeJson(doc, receivedData.jsonMessage);
    
    if (error) {
        Serial.print("JSON Parse Error: ");
        Serial.println(error.c_str());
        return;
    }

    // Extract bulb_id and brightness
    int bulb_id = doc["bulb_id"];
    int brightness = doc["brightness"];

    Serial.print("Bulb ID: ");
    Serial.println(bulb_id);
    Serial.print("Brightness: ");
    Serial.println(brightness);

    // Ensure brightness is within range (0-100)
    brightness = constrain(brightness, 0, 100);

    // Control the correct dimmer channel
    switch (bulb_id) {
        case 1:
            dimmer1.setPower(brightness);
            break;
        case 2:
            dimmer2.setPower(brightness);
            break;
        case 3:
            dimmer3.setPower(brightness);
            break;
        case 4:
            dimmer4.setPower(brightness);
            break;
        default:
            Serial.println("Invalid Bulb ID!");
            return;
    }

    Serial.print("Updated Bulb ");
    Serial.print(bulb_id);
    Serial.print(" to ");
    Serial.print(brightness);
    Serial.println("% brightness.");
}

void setup() {
    USE_SERIAL.begin(115200);
    WiFi.mode(WIFI_STA);

    if (esp_now_init() != ESP_OK) {
        Serial.println("ESP-NOW Initialization Failed!");
        return;
    }
    
    // Register receive callback
    esp_now_register_recv_cb(onDataRecv);

    // Initialize dimmers in NORMAL_MODE and set them ON
    dimmer1.begin(NORMAL_MODE, ON);
    dimmer2.begin(NORMAL_MODE, ON);
    dimmer3.begin(NORMAL_MODE, ON);
    dimmer4.begin(NORMAL_MODE, ON);

    Serial.println("ESP32 Ready to Receive JSON Data!");
}

void loop() {
    // ESP32 waits for incoming JSON messages via ESP-NOW.
}