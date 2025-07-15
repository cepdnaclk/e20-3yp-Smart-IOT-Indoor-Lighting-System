#include <Arduino.h>
#include <math.h>
#include <string.h>

#define RX_PIN 16
#define TX_PIN 17
#define BAUD_RATE 256000

// Variables
uint8_t RX_temp = 0;
uint8_t RX_BUF[64] = { 0 };
int RX_count = 0;

// Target 1 data
int16_t target1_x = 0;
int16_t target1_y = 0;
uint16_t target1_speed = 0;
uint16_t target1_distance_res = 0;
float target1_distance = 0.0f;
float target1_angle = 0.0f;

// Single-Target Detection Commands
uint8_t Single_Target_Detection_CMD[12] = { 0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x80, 0x00, 0x04, 0x03, 0x02, 0x01 };

void setup() {
  Serial.begin(115200);  // Debugging
  Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
  Serial1.setRxBufferSize(64);  // Set buffer size
  Serial.println("RD-03D Radar Module Initialized");

  // Send single-target detection command
  Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
  delay(200);
  Serial.println("Single-target detection mode activated.");

  RX_count = 0;
  Serial1.flush();
}

void processRadarData() {
  // Process data if at least 32 bytes have been received
  if (RX_count >= 32) {

    // ------------------------
    // 1) TARGET 1 X COORDINATE
    // ------------------------
    // Combine the two bytes as a signed 16-bit integer.
    // Then invert its sign so that positive becomes negative and negative becomes positive.
    uint16_t rawX = (RX_BUF[4] | (RX_BUF[5] << 8));
    if (rawX >= 32768) {
      rawX -= 32768;  // re-map 32768..65535 down to 0..32767
      // interpret that re-mapped range as negative:
      target1_x = -(int16_t)rawX;
    } else {
      // values under 32768 remain positive:
      target1_x = (int16_t)rawX;
    }



    // ------------------------
    // 2) TARGET 1 Y COORDINATE (unchanged)
    // ------------------------
    // The image shows raw = 34481 which is converted as: 34481 - 32768 = 1713.
    uint16_t rawY = (RX_BUF[6] | (RX_BUF[7] << 8));
    if (rawY >= 32768) {
      rawY -= 32768;
    }
    target1_y = (int16_t)rawY;

    // ------------------------
    // 3) TARGET 1 SPEED (unchanged)
    // ------------------------
    target1_speed = (RX_BUF[8] | (RX_BUF[9] << 8));

    // ------------------------
    // 4) TARGET 1 DISTANCE RESOLUTION (unchanged)
    // ------------------------
    target1_distance_res = (RX_BUF[10] | (RX_BUF[11] << 8));

    // ------------------------
    // Compute distance & angle
    // ------------------------
    target1_distance = sqrtf(powf((float)target1_x, 2) + powf((float)target1_y, 2));
    target1_angle = atan2f((float)target1_y, (float)target1_x) * (180.0f / M_PI);

    // ------------------------
    // Print out the results
    // ------------------------
    Serial.print("Target 1 - Distance: ");
    Serial.print(target1_distance / 10.0f);  // converting mm to cm if desired
    Serial.print(" cm, Angle: ");
    Serial.print(target1_angle);
    Serial.print(" deg, X: ");
    Serial.print(target1_x);
    Serial.print(" mm, Y: ");
    Serial.print(target1_y);
    Serial.print(" mm, Speed: ");
    Serial.print(target1_speed);
    Serial.print(" cm/s, Distance Resolution: ");
    Serial.print(target1_distance_res);
    Serial.println(" mm");

    // Reset buffer and counter for the next frame
    memset(RX_BUF, 0x00, sizeof(RX_BUF));
    RX_count = 0;
  }
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