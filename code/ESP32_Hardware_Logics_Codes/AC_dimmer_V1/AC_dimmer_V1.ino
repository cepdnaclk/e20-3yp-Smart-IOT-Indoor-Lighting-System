// #include <RBDdimmer.h>

// // Define Serial Communication
// #define USE_SERIAL Serial

// // Define Output Pins for the Dimmer Module
// #define outputPin1  4   // GPIO4
// #define outputPin2  16  // GPIO16
// #define outputPin3  21  // GPIO21
// #define outputPin4  23  // GPIO23

// // Define Zero-Cross Detection Pin
// #define zerocross 5  // If your module does not require it, ignore

// // Create Dimmer Objects (Must Pass Both Arguments)
// dimmerLamp dimmer1(outputPin1, zerocross);
// dimmerLamp dimmer2(outputPin2, zerocross);
// dimmerLamp dimmer3(outputPin3, zerocross);
// dimmerLamp dimmer4(outputPin4, zerocross);

// // Variable to store brightness value
// int outVal = 0;

// void setup() {
//     // Start Serial Communication at 9600 baud rate
//     USE_SERIAL.begin(9600);
    
//     // Initialize dimmers in NORMAL_MODE and set them ON
//     dimmer1.begin(NORMAL_MODE, ON);
//     dimmer2.begin(NORMAL_MODE, ON);
//     dimmer3.begin(NORMAL_MODE, ON);
//     dimmer4.begin(NORMAL_MODE, ON);
    
//     // Display Startup Message
//     USE_SERIAL.println("Dimmer Program is starting...");
// }

// void loop() {
//     int preVal = outVal;

//     // Check if Serial Data is Available
//     if (USE_SERIAL.available()) {
//         int buf = USE_SERIAL.parseInt();  // Read input value from Serial
//         if (buf != 0) outVal = buf;  // Update brightness value if valid input
//         delay(200);  // Prevent rapid updates
//     }

//     // Set brightness for all dimmers
//     dimmer1.setPower(outVal);
//     dimmer2.setPower(outVal);
//     dimmer3.setPower(outVal);
//     dimmer4.setPower(outVal);

//     // Display brightness values if changed
//     if (preVal != outVal) {
//         USE_SERIAL.print("Lamp 1 Brightness -> ");
//         printSpace(dimmer1.getPower());
//         USE_SERIAL.print(dimmer1.getPower());
//         USE_SERIAL.println("%");

//         USE_SERIAL.print("Lamp 2 Brightness -> ");
//         printSpace(dimmer2.getPower());
//         USE_SERIAL.print(dimmer2.getPower());
//         USE_SERIAL.println("%");

//         USE_SERIAL.print("Lamp 3 Brightness -> ");
//         printSpace(dimmer3.getPower());
//         USE_SERIAL.print(dimmer3.getPower());
//         USE_SERIAL.println("%");

//         USE_SERIAL.print("Lamp 4 Brightness -> ");
//         printSpace(dimmer4.getPower());
//         USE_SERIAL.print(dimmer4.getPower());
//         USE_SERIAL.println("%");
//     }

//     delay(50);  // Small delay for smooth operation
// }

// // Function to format output spacing
// void printSpace(int val) {
//     if ((val / 100) == 0) USE_SERIAL.print(" ");
//     if ((val / 10) == 0) USE_SERIAL.print(" ");
// }


#include <RBDdimmer.h>

// Define Serial Communication
#define USE_SERIAL Serial

// Define Output Pins for the Dimmer Module
#define outputPin1  4   // GPIO4
#define outputPin2  16  // GPIO16
#define outputPin3  21  // GPIO21
#define outputPin4  23  // GPIO23

// Define Zero-Cross Detection Pin
#define zerocross 5  // If your module does not require it, ignore

// Create Dimmer Objects (Must Pass Both Arguments)
dimmerLamp dimmer1(outputPin1, zerocross);
dimmerLamp dimmer2(outputPin2, zerocross);
dimmerLamp dimmer3(outputPin3, zerocross);
dimmerLamp dimmer4(outputPin4, zerocross);

// Variable to store brightness value
int outVal = 10;  // Initialize with a safe default value

void setup() {
    // Start Serial Communication at 9600 baud rate
    USE_SERIAL.begin(9600);
    
    // Initialize dimmers in NORMAL_MODE and set them ON
    dimmer1.begin(NORMAL_MODE, ON);
    dimmer2.begin(NORMAL_MODE, ON);
    dimmer3.begin(NORMAL_MODE, ON);
    dimmer4.begin(NORMAL_MODE, ON);
    
    // Display Startup Message
    USE_SERIAL.println("Dimmer Program is starting...");
    USE_SERIAL.println("Enter a value between 1-100 to set brightness.");
}

void loop() {
    int preVal = outVal;

    // Check if Serial Data is Available
    if (USE_SERIAL.available()) {
        int buf = USE_SERIAL.parseInt();
        if (buf > 0 && buf <= 100) {  // Ensure value is valid (1-100)
            outVal = buf;
        } else {
            USE_SERIAL.println("Invalid input. Enter a value between 1-100.");
        }
        delay(200);  // Prevent rapid updates
    }

    // Prevent Division by Zero Error
    if (outVal > 0) {
        dimmer1.setPower(outVal);
        dimmer2.setPower(outVal);
        dimmer3.setPower(outVal);
        dimmer4.setPower(outVal);
    } else {
        USE_SERIAL.println("Warning: outVal is 0. Skipping dimmer update.");
    }

    // Display brightness values if changed
    if (preVal != outVal) {
        USE_SERIAL.print("Lamp 1 Brightness -> ");
        printSpace(dimmer1.getPower());
        USE_SERIAL.print(dimmer1.getPower());
        USE_SERIAL.println("%");

        USE_SERIAL.print("Lamp 2 Brightness -> ");
        printSpace(dimmer2.getPower());
        USE_SERIAL.print(dimmer2.getPower());
        USE_SERIAL.println("%");

        USE_SERIAL.print("Lamp 3 Brightness -> ");
        printSpace(dimmer3.getPower());
        USE_SERIAL.print(dimmer3.getPower());
        USE_SERIAL.println("%");

        USE_SERIAL.print("Lamp 4 Brightness -> ");
        printSpace(dimmer4.getPower());
        USE_SERIAL.print(dimmer4.getPower());
        USE_SERIAL.println("%");
    }

    delay(50);  // Small delay for smooth operation
}

// Function to format output spacing
void printSpace(int val) {
    if ((val / 100) == 0) USE_SERIAL.print(" ");
    if ((val / 10) == 0) USE_SERIAL.print(" ");
}
