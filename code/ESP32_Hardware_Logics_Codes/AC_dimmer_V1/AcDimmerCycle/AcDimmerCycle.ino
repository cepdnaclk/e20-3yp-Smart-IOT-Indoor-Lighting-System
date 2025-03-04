#include <RBDdimmer.h>

#define ZC_PIN 34  // Zero-Crossing pin
#define DIM_PIN 19  // PWM/Triac pin

// Initialize the dimmer
dimmerLamp dimmer(DIM_PIN, ZC_PIN);

void setup() {
    Serial.begin(115200);
    
    // Set dimmer mode
    dimmer.begin(NORMAL_MODE, ON);
}

void loop() {
    for (int brightness = 0; brightness <= 100; brightness += 10) {
        dimmer.setPower(brightness);
        Serial.print("Brightness: ");
        Serial.println(brightness);
        delay(1000);
    }

    for (int brightness = 100; brightness >= 0; brightness -= 10) {
        dimmer.setPower(brightness);
        Serial.print("Brightness: ");
        Serial.println(brightness);
        delay(1000);
    }
}
