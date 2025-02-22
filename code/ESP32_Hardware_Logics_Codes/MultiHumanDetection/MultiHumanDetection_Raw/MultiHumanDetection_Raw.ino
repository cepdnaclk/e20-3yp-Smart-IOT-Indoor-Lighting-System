#include <Arduino.h>

#define RX_PIN 16
#define TX_PIN 17
#define BAUD_RATE 256000

// Variables
uint8_t RX_BUF[64] = {0};
uint8_t RX_count = 0;
uint8_t RX_temp = 0;


// Single-Target Detection Commands
uint8_t Single_Target_Detection_CMD[12] = {0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x80, 0x00, 0x04, 0x03, 0x02, 0x01};
// Multi-Target Detection Command
uint8_t Multi_Target_Detection_CMD[12] = {0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x90, 0x00, 0x04, 0x03, 0x02, 0x01};

void setup() {
    Serial.begin(115200);                  // Debugging
    Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
    Serial1.setRxBufferSize(64);           // Set buffer size
    Serial.println("RD-03D Radar Module Initialized");

    // Send single-target detection command
    // Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
    
    // Send single-target detection command
    Serial1.write(Multi_Target_Detection_CMD, sizeof(Multi_Target_Detection_CMD));
    
    delay(200);
    Serial.println("Single-target detection mode activated.");
    //Serial.println("Multi-target detection mode activated.");
    
    RX_count = 0;
    Serial1.flush();
}

void processRadarData() {

         // output data
         printBuffer();


        // Reset buffer and counter
        memset(RX_BUF, 0x00, sizeof(RX_BUF));
        RX_count = 0;
    }


void loop() {
    // Read data from Serial1
    while (Serial1.available()) {
        RX_temp = Serial1.read();
        RX_BUF[RX_count++] = RX_temp;

        // Prevent buffer overflow
        if (RX_count >= sizeof(RX_BUF)) {
            RX_count = sizeof(RX_BUF) - 1;
        }

        // Check for end of frame (0xCC, 0x55)
        if ((RX_count > 1) && (RX_BUF[RX_count - 1] == 0xCC) && (RX_BUF[RX_count - 2] == 0x55)) {
            processRadarData();
        }
    }
}


// Function to print buffer contents
void printBuffer() {
    Serial.print("RX_BUF: ");
    for (int i = 0; i < RX_count; i++) {
        Serial.print("0x");
        if (RX_BUF[i] < 0x10) Serial.print("0");  // Add leading zero for single-digit hex values
        Serial.print(RX_BUF[i], HEX);
        Serial.print(" ");
    }
    Serial.println();
}