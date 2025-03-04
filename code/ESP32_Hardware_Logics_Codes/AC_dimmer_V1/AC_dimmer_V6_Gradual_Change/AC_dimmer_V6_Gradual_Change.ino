
#include <Ticker.h>
#include <dimmable_light.h>

// Hardware definitions:
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

// Ticker for gradual transitions:
Ticker transitionTicker;
const float transitionInterval = 0.02; // 50ms between steps

// Global arrays to track the current and target brightness values (range: 0–255)
int currentBrightness[4] = {0, 0, 0, 0};  // Initially off (0)
int targetBrightness[4]  = {0, 0, 0, 0};

// This function maps a percentage value (0–100) to a brightness value (0–255)
// according to the custom mapping:
//   0%  -> 0,
//   1%  -> 40,
//   100% -> 255,
// with the range 40 to 255 divided evenly into 99 steps.
int mapPercentageToBrightness(int p) {
  if (p <= 0) return 0;
  if (p > 100) p = 100;
  return 40 + ((p - 1) * 215) / 99;  // 215 = 255 - 40, 99 steps from 1% to 100%
}

void setup() {
  Serial.begin(115200);
  while (!Serial);  // Wait for Serial Monitor to open
  Serial.println();
  Serial.println("Individual Dimmable Light Control (Gradual Transition)");
  Serial.println();

  // Initialize the dimmable light system:
  DimmableLight::setSyncPin(ZC_PIN);
  DimmableLight::begin();
  Serial.print("Initialized ");
  Serial.print(DimmableLight::getLightNumber());
  Serial.println(" lights.");

  // Set initial brightness for all channels to 0 (off)
  l1.setBrightness(0);
  l2.setBrightness(0);
  l3.setBrightness(0);
  l4.setBrightness(0);

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
    // Look for commands starting with "set "
    if (input.startsWith("set ")) {
      input = input.substring(4); // Remove "set " prefix
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

// This function accepts percentage brightness values (0–100) for each channel,
// maps them to brightness values (using our custom mapping),
// stores the target brightness for each channel,
// and starts a gradual transition.
void setIndividualBrightnesses(int p1, int p2, int p3, int p4) {
  // Constrain percentage values to 0–100.
  p1 = constrain(p1, 0, 100);
  p2 = constrain(p2, 0, 100);
  p3 = constrain(p3, 0, 100);
  p4 = constrain(p4, 0, 100);
  
  // Map the percentages to brightness values.
  targetBrightness[0] = mapPercentageToBrightness(p1);
  targetBrightness[1] = mapPercentageToBrightness(p2);
  targetBrightness[2] = mapPercentageToBrightness(p3);
  targetBrightness[3] = mapPercentageToBrightness(p4);
  
  // Start the transition process.
  transitionTicker.once(transitionInterval, transitionStep);
}

// This function performs one transition step for all channels.
// It increments or decrements the current brightness toward the target by 1 unit.
// If any channel is still in transition, it schedules the next step.
void transitionStep() {
  bool needMore = false;
  
  // Channel 1:
  if (currentBrightness[0] < targetBrightness[0]) {
    currentBrightness[0]++;
    needMore = true;
  } else if (currentBrightness[0] > targetBrightness[0]) {
    currentBrightness[0]--;
    needMore = true;
  }
  l1.setBrightness(currentBrightness[0]);
  
  // Channel 2:
  if (currentBrightness[1] < targetBrightness[1]) {
    currentBrightness[1]++;
    needMore = true;
  } else if (currentBrightness[1] > targetBrightness[1]) {
    currentBrightness[1]--;
    needMore = true;
  }
  l2.setBrightness(currentBrightness[1]);
  
  // Channel 3:
  if (currentBrightness[2] < targetBrightness[2]) {
    currentBrightness[2]++;
    needMore = true;
  } else if (currentBrightness[2] > targetBrightness[2]) {
    currentBrightness[2]--;
    needMore = true;
  }
  l3.setBrightness(currentBrightness[2]);
  
  // Channel 4:
  if (currentBrightness[3] < targetBrightness[3]) {
    currentBrightness[3]++;
    needMore = true;
  } else if (currentBrightness[3] > targetBrightness[3]) {
    currentBrightness[3]--;
    needMore = true;
  }
  l4.setBrightness(currentBrightness[3]);
  
  // If any channel still needs to change, schedule another transition step.
  if (needMore) {
    transitionTicker.once(transitionInterval, transitionStep);
  }
}