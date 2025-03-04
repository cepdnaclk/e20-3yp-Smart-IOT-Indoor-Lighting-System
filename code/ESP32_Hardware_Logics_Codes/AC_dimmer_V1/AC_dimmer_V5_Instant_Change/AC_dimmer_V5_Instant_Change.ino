#include <Ticker.h>
#include <dimmable_light.h>

// Use your hardware pins:
#define ZC_PIN   34  // Zero-Crossing pin

// Define output pins for each channel
#define DIM_PIN1 16  // Channel 1
#define DIM_PIN2 19  // Channel 2
#define DIM_PIN3 17  // Channel 3
#define DIM_PIN4 18  // Channel 4

// Create four DimmableLight instances using the corresponding pins.
DimmableLight l1(DIM_PIN1);
DimmableLight l2(DIM_PIN2);
DimmableLight l3(DIM_PIN3);
DimmableLight l4(DIM_PIN4);

// This function maps a percentage value (0-100) to a brightness value (0-255)
// according to your custom mapping:
//   0% -> 0, 1% -> 40, and 100% -> 255. The range 40 to 255 is divided into 99 equal parts.
int mapPercentageToBrightness(int p) {
  // For 0%, return 0.
  if (p <= 0) return 0;
  // Ensure percentage doesn't exceed 100.
  if (p > 100) p = 100;
  // Map p from [1, 100] to [40, 255]:
  // 215 = 255 - 40, and there are 99 steps (from 1% to 100%).
  return 40 + ((p - 1) * 215) / 99;
}

void setup() {
  Serial.begin(115200);
  while (!Serial);  // Wait for the Serial Monitor to open
  Serial.println();
  Serial.println("Individual Dimmable Light Control (Percentage Mapping)");
  Serial.println();

  // Initialize the dimmable light system with the zero-cross pin.
  DimmableLight::setSyncPin(ZC_PIN);
  DimmableLight::begin();
  Serial.print("Initialized ");
  Serial.print(DimmableLight::getLightNumber());
  Serial.println(" lights.");
  
  Serial.println();
  Serial.println("Enter command in the format: set <p1> <p2> <p3> <p4>");
  Serial.println("Each value is a percentage (0 to 100).");
  Serial.println("For example: set 50 75 100 25");
}

void loop() {
  // Check for serial input and process the command.
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    // Expect a command that starts with "set "
    if (input.startsWith("set ")) {
      // Remove the "set " part.
      input = input.substring(4);
      int p1, p2, p3, p4;
      // Parse four integer percentage values from the command.
      int numParsed = sscanf(input.c_str(), "%d %d %d %d", &p1, &p2, &p3, &p4);
      if (numParsed == 4) {
        setIndividualBrightnesses(p1, p2, p3, p4);
        Serial.print("Set percentages to: ");
        Serial.print(p1); Serial.print("% ");
        Serial.print(p2); Serial.print("% ");
        Serial.print(p3); Serial.print("% ");
        Serial.print(p4); Serial.println("%");
      } else {
        Serial.println("Invalid command. Please enter 4 values separated by spaces.");
      }
    } else {
      Serial.println("Unknown command. Use the 'set' command.");
    }
  }
}

// This function accepts percentage brightness values (0-100) for each channel,
// maps them to brightness values (using the custom mapping), and sets the brightness.
void setIndividualBrightnesses(int p1, int p2, int p3, int p4) {
  // Constrain percentage values to 0–100.
  p1 = constrain(p1, 0, 100);
  p2 = constrain(p2, 0, 100);
  p3 = constrain(p3, 0, 100);
  p4 = constrain(p4, 0, 100);

  // Map the percentage values to brightness values.
  int brightness1 = mapPercentageToBrightness(p1);
  int brightness2 = mapPercentageToBrightness(p2);
  int brightness3 = mapPercentageToBrightness(p3);
  int brightness4 = mapPercentageToBrightness(p4);

  // Set the brightness for each channel.
  l1.setBrightness(brightness1);
  l2.setBrightness(brightness2);
  l3.setBrightness(brightness3);
  l4.setBrightness(brightness4);
}


