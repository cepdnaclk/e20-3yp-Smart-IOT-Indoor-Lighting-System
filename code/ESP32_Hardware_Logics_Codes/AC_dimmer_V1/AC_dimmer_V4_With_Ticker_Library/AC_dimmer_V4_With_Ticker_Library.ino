// /**
//  * In this example you can see a number of effects on independent lights.
//  * To switch among the available effects, (un)comment the proper line in the setup() function.
//  *
//  * NOTE: Compiles only for ESP8266 and ESP32 because of the Ticker.h dependency.
//  */

// #include <Ticker.h>
// #include <dimmable_light.h>

// // Use your hardware pins:
// #define ZC_PIN   34  // Zero-Crossing pin

// // Define output pins for each channel
// #define DIM_PIN1 16  // Channel 1
// #define DIM_PIN2 19  // Channel 2
// #define DIM_PIN3 17  // Channel 3
// #define DIM_PIN4 18  // Channel 4

// // Create four DimmableLight instances using the corresponding pins.
// DimmableLight l1(DIM_PIN1);
// DimmableLight l2(DIM_PIN2);
// DimmableLight l3(DIM_PIN3);
// DimmableLight l4(DIM_PIN4);

// Ticker dim;

// void setup() {
//   Serial.begin(115200);
//   while (!Serial);
//   Serial.println();
//   Serial.println("Dimmable Light for Arduino: Updated Example");
//   Serial.println();

//   Serial.print("Initializing the dimmable light class... ");
//   // Set the sync pin to the zero-crossing pin defined by ZC_PIN.
//   DimmableLight::setSyncPin(ZC_PIN);
//   DimmableLight::begin();
//   Serial.println("Done!");

//   Serial.println(String("Number of instantiated lights: ") + DimmableLight::getLightNumber());

//   // Uncomment one and only one among the following lines to see an effect
//   // doEqual();
//   // doEqualOnOff();
//   // doDimSpecificStep();
//   // doRangeLimit();
//   // doNearValues();
//   // doDimMixed();
//   // doDimSweepEqual();
//   // doInvertedDim();
//   doCircularSwipe();
// }

// /**
//  * Set particular values of brightness to every light.
//  */
// void doEqual() {
//   const float period = 3;
//   static int briLevels[] = { 0, 1, 2, 50, 100, 150, 254, 255 };
//   static uint8_t brightnessStep = 0;
//   Serial.println(String("Dimming at: ") + briLevels[brightnessStep] + "/255");
//   l1.setBrightness(briLevels[brightnessStep]);
//   l2.setBrightness(briLevels[brightnessStep]);
//   l3.setBrightness(briLevels[brightnessStep]);
//   l4.setBrightness(briLevels[brightnessStep]);

//   brightnessStep++;
//   if (brightnessStep == sizeof(briLevels) / sizeof(briLevels[0])) { 
//     brightnessStep = 0; 
//   }
//   dim.once(period, doEqual);
// }

// /**
//  * Turn on and off simultaneously all the bulbs.
//  */
// void doEqualOnOff() {
//   const float period = 3;
//   static int briLevels[] = { 0, 255 };
//   static uint8_t brightnessStep = 0;
//   Serial.println(String("Dimming at: ") + briLevels[brightnessStep] + "/255");
//   l1.setBrightness(briLevels[brightnessStep]);
//   l2.setBrightness(briLevels[brightnessStep]);
//   l3.setBrightness(briLevels[brightnessStep]);
//   l4.setBrightness(briLevels[brightnessStep]);

//   brightnessStep++;
//   if (brightnessStep == sizeof(briLevels) / sizeof(briLevels[0])) { 
//     brightnessStep = 0; 
//   }
//   dim.once(period, doEqualOnOff);
// }

// /**
//  * Set brightness to specific values.
//  */
// void doDimSpecificStep(void) {
//   const float period = 3;
//   static int briLevels1[] = { 40, 200 };
//   static int briLevels2[] = { 60, 160 };
//   static int briLevels3[] = { 80, 150 };
//   static int briLevels4[] = { 50, 220 };  // Added for channel 4
//   static uint8_t brightnessStep = 0;
//   Serial.println(String("Dimming at: ") + briLevels1[brightnessStep] + " , " +
//                  briLevels2[brightnessStep] + " , " + briLevels3[brightnessStep] + " , " +
//                  briLevels4[brightnessStep] + " /255");
//   l1.setBrightness(briLevels1[brightnessStep]);
//   l2.setBrightness(briLevels2[brightnessStep]);
//   l3.setBrightness(briLevels3[brightnessStep]);
//   l4.setBrightness(briLevels4[brightnessStep]);

//   brightnessStep++;
//   if (brightnessStep == sizeof(briLevels1) / sizeof(briLevels1[0])) { 
//     brightnessStep = 0; 
//   }
//   dim.once(period, doDimSpecificStep);
// }

// /**
//  * Test a mixture between on, off and middle brightness.
//  */
// void doRangeLimit(void) {
//   const float period = 5;
//   static int briLevels1[] = { 0, 255 };
//   static int briLevels2[] = { 255, 0 };
//   static int briLevels3[] = { 100, 100 };
//   static int briLevels4[] = { 50, 50 }; // For channel 4
//   static uint8_t brightnessStep = 0;
//   Serial.println(String("Dimming at: ") + briLevels1[brightnessStep] + " , " +
//                  briLevels2[brightnessStep] + " , " + briLevels3[brightnessStep] + " , " +
//                  briLevels4[brightnessStep] + " /255");
//   l1.setBrightness(briLevels1[brightnessStep]);
//   l2.setBrightness(briLevels2[brightnessStep]);
//   l3.setBrightness(briLevels3[brightnessStep]);
//   l4.setBrightness(briLevels4[brightnessStep]);

//   brightnessStep++;
//   if (brightnessStep == sizeof(briLevels1) / sizeof(briLevels1[0])) { 
//     brightnessStep = 0; 
//   }
//   dim.once(period, doRangeLimit);
// }

// /**
//  * Test your eyes' sensitivity by switching between near values.
//  */
// void doNearValues(void) {
//   const float period = 4;
//   static int briLevels1[] = { 70, 70 };
//   static int briLevels2[] = { 71, 71 };
//   static int briLevels3[] = { 72, 73 };
//   static int briLevels4[] = { 74, 74 }; // For channel 4
//   static uint8_t brightnessStep = 0;
//   Serial.println(String("Dimming at: ") + briLevels1[brightnessStep] + " , " +
//                  briLevels2[brightnessStep] + " , " + briLevels3[brightnessStep] + " , " +
//                  briLevels4[brightnessStep] + " /255");
//   l1.setBrightness(briLevels1[brightnessStep]);
//   l2.setBrightness(briLevels2[brightnessStep]);
//   l3.setBrightness(briLevels3[brightnessStep]);
//   l4.setBrightness(briLevels4[brightnessStep]);

//   brightnessStep++;
//   if (brightnessStep == sizeof(briLevels1) / sizeof(briLevels1[0])) { 
//     brightnessStep = 0; 
//   }
//   dim.once(period, doNearValues);
// }

// /**
//  * The 1st and 3rd channels sweep in one direction while the 2nd and 4th sweep in the opposite direction.
//  */
// void doDimMixed(void) {
//   const float period = 0.05;
//   static uint8_t brightnessStep = 1;
//   static bool up = true;
//   l1.setBrightness(brightnessStep);
//   l2.setBrightness(105);
//   l3.setBrightness(255 - brightnessStep);
//   l4.setBrightness(105);
//   Serial.println(String("Dimming at: ") + brightnessStep + " , 105 , " + (255 - brightnessStep) + " , 105 /255");

//   if (brightnessStep == 255 && up) {
//     up = false;
//   } else if (brightnessStep == 0 && !up) {
//     up = true;
//   } else {
//     if (up) {
//       brightnessStep++;
//     } else {
//       brightnessStep--;
//     }
//   }
//   dim.once(period, doDimMixed);
// }

// /**
//  * All the lights simultaneously fade in and out.
//  */
// void doDimSweepEqual(void) {
//   const float period = 0.05;
//   static uint8_t brightnessStep = 1;
//   static bool up = true;
//   l1.setBrightness(brightnessStep);
//   l2.setBrightness(brightnessStep);
//   l3.setBrightness(brightnessStep);
//   l4.setBrightness(brightnessStep);
//   Serial.println(String("Dimming at: ") + brightnessStep + "/255");

//   if (brightnessStep == 255 && up) {
//     up = false;
//   } else if (brightnessStep == 0 && !up) {
//     up = true;
//   } else {
//     if (up) {
//       brightnessStep++;
//     } else {
//       brightnessStep--;
//     }
//   }
//   dim.once(period, doDimSweepEqual);
// }

// /**
//  * The even channels sweep in the opposite direction compared to the odd channels.
//  */
// void doInvertedDim(void) {
//   const float period = 0.05;
//   static uint8_t brightnessStep = 1;
//   static bool up = true;
//   int oppositeBrightness = 255 - brightnessStep;

//   l1.setBrightness(brightnessStep);
//   l2.setBrightness(oppositeBrightness);
//   l3.setBrightness(brightnessStep);
//   l4.setBrightness(oppositeBrightness);
//   Serial.println(String("Dimming at: ") + brightnessStep + " , " + oppositeBrightness + " , " +
//                  brightnessStep + " , " + oppositeBrightness + "/255");

//   if (brightnessStep == 255 && up) {
//     up = false;
//   } else if (brightnessStep == 0 && !up) {
//     up = true;
//   } else {
//     if (up) {
//       brightnessStep++;
//     } else {
//       brightnessStep--;
//     }
//   }
//   dim.once(period, doInvertedDim);
// }

// /**
//  * Turn on the lights with an offset between consecutive channels (circular swipe effect).
//  */
// void doCircularSwipe(void) {
//   const float period = 0.01;
//   static uint16_t brightnessStep = 255;

//   // For four channels, use offsets of 128 (512/4)
//   l1.setBrightness(triangularFunction(module(brightnessStep + 0, 512)));
//   l2.setBrightness(triangularFunction(module(brightnessStep + 128, 512)));
//   l3.setBrightness(triangularFunction(module(brightnessStep + 256, 512)));
//   l4.setBrightness(triangularFunction(module(brightnessStep + 384, 512)));

//   brightnessStep++;
//   if (brightnessStep == 512) { brightnessStep = 0; }
//   dim.once(period, doCircularSwipe);
// }

// /**
//  * Return the modulo of a non-negative number (optimized).
//  */
// unsigned int module(unsigned int value, unsigned int max) {
//   if (value < max) { return value; }
//   return value % max;
// }

// /**
//  * Given a number in range [0, 512), return a triangular function [0,255].
//  */
// uint8_t triangularFunction(uint16_t value) {
//   int simmetricValue = 0;
//   if (value <= 255) { 
//     simmetricValue = value; 
//   } else if (value <= 511) { 
//     simmetricValue = -value + 511; 
//   }
//   return simmetricValue;
// }

// /**
//  * Given a number in range [0, 512), return a "pow-ed" triangular function [0,255].
//  */
// uint8_t conversionPow(uint16_t value) {
//   int simmetricValue = (value <= 255) ? value : -value + 511;
//   if (simmetricValue < 150) { return 0; }
//   int y = pow(simmetricValue - 150, 1.2);
//   if (y > 255) { return 255; }
//   return y;
// }

// void loop() {}


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

void setup() {
  Serial.begin(115200);
  while (!Serial);  // Wait for serial monitor to open
  Serial.println();
  Serial.println("Individual Dimmable Light Control");
  Serial.println();

  // Initialize the dimmable light system:
  DimmableLight::setSyncPin(ZC_PIN);
  DimmableLight::begin();
  Serial.print("Initialized ");
  Serial.print(DimmableLight::getLightNumber());
  Serial.println(" lights.");

  Serial.println();
  Serial.println("Enter command in the format: set <b1> <b2> <b3> <b4>");
  Serial.println("For example: set 100 150 200 50");
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
      int b1, b2, b3, b4;
      // Use sscanf to parse four integers from the command.
      int numParsed = sscanf(input.c_str(), "%d %d %d %d", &b1, &b2, &b3, &b4);
      if (numParsed == 4) {
        setIndividualBrightnesses(b1, b2, b3, b4);
        Serial.print("Set brightnesses to: ");
        Serial.print(b1); Serial.print(" ");
        Serial.print(b2); Serial.print(" ");
        Serial.print(b3); Serial.print(" ");
        Serial.println(b4);
      } else {
        Serial.println("Invalid command. Please enter 4 values separated by spaces.");
      }
    } else {
      Serial.println("Unknown command. Use the 'set' command.");
    }
  }
}

// This function sets the brightness of each channel individually.
void setIndividualBrightnesses(int b1, int b2, int b3, int b4) {
  // Optionally, constrain brightness values to 0–255.
  b1 = constrain(b1, 0, 255);
  b2 = constrain(b2, 0, 255);
  b3 = constrain(b3, 0, 255);
  b4 = constrain(b4, 0, 255);

  l1.setBrightness(b1);
  l2.setBrightness(b2);
  l3.setBrightness(b3);
  l4.setBrightness(b4);
}
