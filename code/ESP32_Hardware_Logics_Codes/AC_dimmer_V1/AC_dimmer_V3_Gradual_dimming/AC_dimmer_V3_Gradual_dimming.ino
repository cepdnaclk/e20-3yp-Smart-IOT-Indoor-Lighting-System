#include <RBDdimmer.h>

#define ZC_PIN 34  // Zero-Crossing pin
#define DIM_PIN 19 // PWM/Triac pin

// Initialize the dimmer
dimmerLamp dimmer(DIM_PIN, ZC_PIN);

// Variable to store brightness value
int brightness = 50;     // Start with 50% brightness
int lastBrightness = 50; // Track the last brightness value

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
  checkSerialInput();  // Check for new serial input
}

// Function to check and update brightness based on serial input
void checkSerialInput() {
  if (Serial.available()) {
    // Read the entire line until newline character
    String inputStr = Serial.readStringUntil('\n');
    inputStr.trim();  // Remove any extra whitespace

    if (inputStr.length() > 0) {
      int inputVal = inputStr.toInt();  // Convert the string to an integer

      // Ensure input is within valid range (0 to 100)
      if (inputVal >= 0 && inputVal <= 100) {
        if (inputVal != lastBrightness) {
          transitionBrightness(inputVal); // Gradually change brightness
        }
      } else {
        Serial.println("Invalid input. Please enter a value between 0 and 100.");
      }
    }
  }
}

// Function to transition brightness gradually from current value to target value
void transitionBrightness(int target) {
  Serial.print("Transitioning from ");
  Serial.print(brightness);
  Serial.print(" to ");
  Serial.println(target);
  
  // Gradually increase or decrease the brightness
  while (brightness != target) {
    if (brightness < target) {
      brightness++;
    } else {
      brightness--;
    }
    dimmer.setPower(brightness);
    Serial.print("Brightness: ");
    Serial.println(brightness);
    delay(50);  // Wait 50ms between each step
  }
  lastBrightness = brightness;
}

