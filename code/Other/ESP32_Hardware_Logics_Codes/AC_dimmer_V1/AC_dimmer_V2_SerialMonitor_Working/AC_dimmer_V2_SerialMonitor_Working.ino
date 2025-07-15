#include <RBDdimmer.h>

#define ZC_PIN 34  // Zero-Crossing pin
#define DIM_PIN 19  // PWM/Triac pin

// Initialize the dimmer
dimmerLamp dimmer(DIM_PIN, ZC_PIN);

// Variable to store brightness value
int brightness = 50;  // Start with 50% brightness (instead of 0)
int lastBrightness = 50;  // To track the last brightness value (initialized to a valid starting value)

void setup() {
    Serial.begin(115200);
    
    // Set dimmer mode
    dimmer.begin(NORMAL_MODE, ON);

    // Display startup message
    Serial.println("Dimmer Program is starting...");
    Serial.println("Enter a value between 0-100 to set brightness.");
    
    // Set initial brightness to 50% at startup
    dimmer.setPower(brightness);
}

void loop() {
    // Keep checking for serial input continuously
    checkSerialInput();  // Function to handle serial input and change brightness

    // Here you can add additional code that continuously runs without blocking
    // For now, we just keep the brightness constant until input is changed
}

// Function to check and update brightness based on serial input
void checkSerialInput() {
  if (Serial.available()) {
    // Read the entire line until newline character
    String inputStr = Serial.readStringUntil('\n');
    inputStr.trim();  // Remove any leading/trailing whitespace

    if (inputStr.length() > 0) {
      int inputVal = inputStr.toInt();  // Convert the string to an integer

      // Ensure input is within valid range (0 to 100)
      if (inputVal >= 0 && inputVal <= 100) {
        if (inputVal != lastBrightness) {
          brightness = inputVal;
          dimmer.setPower(brightness);
          Serial.print("Brightness set to: ");
          Serial.println(brightness);
          lastBrightness = brightness;
        }
      } else {
        Serial.println("Invalid input. Please enter a value between 0 and 100.");
      }
    }
  }
}

