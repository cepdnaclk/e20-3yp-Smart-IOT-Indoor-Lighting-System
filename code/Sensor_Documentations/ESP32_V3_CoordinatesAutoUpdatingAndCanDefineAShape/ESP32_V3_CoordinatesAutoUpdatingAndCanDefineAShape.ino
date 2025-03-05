#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <Arduino.h>


unsigned long previousMillis = 0;  // Stores the last time the check was done
const long interval = 1000;        // 1 second interval
//Object to store data in ESP32 flash memory
Preferences preferences;
//Wifi access data SSID,password
const char* ssid = "RadarESP32";
const char* password = "12345678";

WebServer server(80);

//PIN define
#define RX_PIN 16
#define TX_PIN 17
#define BAUD_RATE 256000

uint8_t RX_BUF[64] = {0};
uint8_t RX_count = 0;
uint8_t RX_temp = 0;

int16_t target1_x = 0;
int16_t target1_y = 0;
uint16_t target1_speed = 0;
uint16_t target1_distance_res = 0;
float target1_distance = 0.0f;
float target1_angle = 0.0f;

//Shape structure define
struct Shape {
    String name;
    String type;
    int16_t x[4];
    int16_t y[4];
    int count;
    String equation;  // To store the equation of the 
    int radius;
};

Shape shapes[10];  // Store up to 10 shapes
int shapeCount = 0;

uint8_t Single_Target_Detection_CMD[12] = {0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x80, 0x00, 0x04, 0x03, 0x02, 0x01};

//////////////////////////////////////Function 1 - Start wifi access point///////////////////////////////////
void setupWiFi() {
    WiFi.softAP(ssid, password);
    Serial.println("WiFi Access Point Started.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.softAPIP());
}


//////////////////////////////////////Function 2 - HTML interface///////////////////////////////////
String generateHTML() {
    return R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>Radar Shapes Visualization</title>
    <style>
        #plotCanvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <h1>Radar Target Data & Shape Saver</h1>

    <canvas id="plotCanvas" width="800" height="800"></canvas>

    <p><b>Live Coordinates:</b></p>
    <p id="liveData">Loading...</p>

    <h2>Save Shape</h2>
    <form id="shapeForm">
        <label>Shape Name:</label>
        <input type="text" id="shapeName"><br><br>

        <label>Shape Type:</label>
        <select id="shapeType" onchange="updateCoordinateFields()">
            <option value="point">Point</option>
            <option value="line">Line</option>
            <option value="rectangle">Rectangle</option>
        </select><br><br>

        <div id="coordinates"></div>

        <button type="button" onclick="saveShape()">Save Shape</button>
    </form>

    <h2>Saved Shapes</h2>
    <div id="savedData">No shapes saved.</div>

    <h2>Entered Shapes</h2>
    <div id="enteredShapes">No shapes entered yet.</div>


<script>
// This dictionary tells us how many points each shape type needs.

const pointCount = { point: 1, line: 2, rectangle: 4 };

const canvas = document.getElementById('plotCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const SCALE = 0.08; // Scale factor to fit radar coordinates into the canvas.

//////////////////////////////////////// DYNAMICALLY UPDATING COORDINATE ENTERING AREA ///////////////////////////////////////////
function updateCoordinateFields() {
    const type = document.getElementById('shapeType').value;
    const count = pointCount[type];
    let fields = '';

    if (type === 'point') {
        // For point, include X, Y and Radius fields
        fields += `<label>X:</label>
                   <input type='number' id='x1' readonly>
                   <label>Y:</label>
                   <input type='number' id='y1' readonly>
                   <label>Radius:</label>
                   <input type='number' id='radius'>
                   <button type='button' onclick='setPoint(1)'>Set Point 1</button><br><br>`;
    } else {
        for (let i = 1; i <= count; i++) {
            fields += `<label>Point ${i} X:</label>
                       <input type='number' id='x${i}' readonly>
                       <label>Y:</label>
                       <input type='number' id='y${i}' readonly>
                       <button type='button' onclick='setPoint(${i})'>Set Point ${i}</button><br><br>`;
        }
    }

    document.getElementById('coordinates').innerHTML = fields;
}

function setPoint(pointIndex) {
    fetch('/getCurrentCoordinates')
        .then(response => response.json())
        .then(data => {
            document.getElementById(`x${pointIndex}`).value = data.x;
            document.getElementById(`y${pointIndex}`).value = data.y;
        });
}

function saveShape() {
    const name = document.getElementById('shapeName').value;
    const type = document.getElementById('shapeType').value;
    const count = pointCount[type];

    let query = `name=${name}&type=${type}`;
    for (let i = 1; i <= count; i++) {
        query += `&x${i}=${document.getElementById(`x${i}`).value}`;
        query += `&y${i}=${document.getElementById(`y${i}`).value}`;
    }

    if (type === 'point') {
        const radius = document.getElementById('radius').value;
        query += `&radius=${radius}`;
    }

    fetch(`/save?${query}`)
        .then(() => {
            alert('Shape saved!');
            loadSavedShapes();
        });
}

function drawAxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function scaleX(rawX) {
    return centerX + rawX * SCALE;
}

function scaleY(rawY) {
    return centerY - rawY * SCALE;
}

// Updated plot function to plot a circle instead of a point.
function plotCircle(x, y, radius,rgbaColor = 'rgba(255, 0, 0, 1.0)') {
    const plotX = scaleX(x);
    const plotY = scaleY(y);
    const plotRadius = radius * SCALE; // Apply scale to radius

    ctx.fillStyle = rgbaColor;
    ctx.beginPath();
    ctx.arc(plotX, plotY, plotRadius, 0, 2 * Math.PI);
    ctx.fill();
}

function plotLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.strokeStyle = 'green';
    ctx.stroke();
}

function plotRectangle(coords) {
    ctx.beginPath();
    ctx.moveTo(scaleX(coords[0].x), scaleY(coords[0].y));
    for (let i = 1; i < coords.length; i++) {
        ctx.lineTo(scaleX(coords[i].x), scaleY(coords[i].y));
    }
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function loadSavedShapes() {
    fetch('/getData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('liveData').innerHTML = `X: ${data.x}, Y: ${data.y}`;

            drawAxes();

            const liveX = Number(data.x) || 0;
            const liveY = Number(data.y) || 0;

            plotCircle(liveX, liveY, 10, 'rgba(255, 0, 0, 1.0)');

            let savedHTML = '';
            if (data.shapes && data.shapes.length > 0) {
                data.shapes.forEach(shape => {
                    savedHTML += `<b>${shape.name} (${shape.type})</b><br>`;
                    const coords = [];

                    for (let i = 0; i < shape.count; i++) {
                        const x = Number(shape.x[i]);
                        const y = Number(shape.y[i]);
                        coords.push({ x, y });
                        savedHTML += `Point ${i + 1}: X=${x}, Y=${y}<br>`;
                    }

                    if (shape.type === 'point') {
                        const radius = shape.radius;
                        plotCircle(coords[0].x, coords[0].y, radius, 'rgba(0,255,0,0.5)');
                    } else if (shape.type === 'line') {
                        plotLine(coords[0].x, coords[0].y, coords[1].x, coords[1].y);
                    } else if (shape.type === 'rectangle') {
                        plotRectangle(coords);
                    }

                    savedHTML += '<br>';
                });
            } else {
                savedHTML = "No shapes saved.";
            }

            document.getElementById('savedData').innerHTML = savedHTML;
        })
        .catch(error => {
            console.error('Error loading shapes:', error);
            document.getElementById('liveData').innerHTML = 'Error loading data.';
            document.getElementById('savedData').innerHTML = 'Failed to load saved shapes.';
        });
}
function loadEnteredShapes() {
    fetch('/getEnteredShapes')
        .then(response => response.text())
        .then(data => {
            document.getElementById('enteredShapes').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading entered shapes:', error);
            document.getElementById('enteredShapes').innerHTML = 'Error loading entered shapes.';
        });
}

// Call this function periodically to update entered shapes.
setInterval(loadEnteredShapes, 1000);

updateCoordinateFields();
setInterval(loadSavedShapes, 100);
</script>
</body>
</html>
)rawliteral";
}

void loadHardcodedShapes() {
    // Shape 1 - Point
    shapes[0].name = "Main light1";
    shapes[0].type = "point";
    shapes[0].count = 1;
    shapes[0].x[0] = 500;
    shapes[0].y[0] = -2000;
    shapes[0].radius=2000;
    shapes[0].equation = "(x - 500)^2 + (y - 600)^2 = 4000000";  // Example equation for point
    shapeCount++;

    // Shape 2 - Line
    shapes[1].name = "Door1";
    shapes[1].type = "line";
    shapes[1].count = 2;
    shapes[1].x[0] = -2500;
    shapes[1].y[0] = -3000;
    shapes[1].x[1] = -800;
    shapes[1].y[1] = -5000;
    shapes[1].equation = "y = -11.8x -5941.2";  // Example line equation
    shapeCount++;

    // Shape 3 - Rectangle
    shapes[2].name = "Bed1";
    shapes[2].type = "rectangle";
    shapes[2].count = 4;
    shapes[2].x[0] = 100;
    shapes[2].y[0] = -100;
    shapes[2].x[1] = 2200;
    shapes[2].y[1] = -100;
    shapes[2].x[2] = 2200;
    shapes[2].y[2] = -2200;
    shapes[2].x[3] = 100;
    shapes[2].y[3] = -2200;
    shapes[2].equation = "Rectangle with corners (100,-100), (2200,-100), (2200,-2200), (100,-2200)";
    shapeCount++;
}
void handleRoot() {
    server.send(200, "text/html", generateHTML());
}

///////////////////////////////////////CHECK IF IT IS INSIDE THE ROOM////////////////////////////////////////
String enteredShapes = "";  // Keep track of entered shapes.

void checkIfEnteredShape() {
    enteredShapes = "";  // Reset entered shapes.

    for (int i = 0; i < shapeCount; i++) {
        if (shapes[i].type == "point") {
            if (isInsideCircle(target1_x, target1_y, shapes[i])) {
                enteredShapes += shapes[i].name + " (Circle)<br>";  // Add entered shape to the string.
            }
        } 
        else if (shapes[i].type == "rectangle") {
            if (isInsideRectangle(target1_x, target1_y, shapes[i])) {
                enteredShapes += shapes[i].name + " (Rectangle)<br>";  // Add entered shape to the string.
            }
        }
    }
}

void handleGetEnteredShapes() {
    server.send(200, "text/html", enteredShapes);  // Send entered shapes to frontend.
}


// Check if (x, y) is inside a circle (point shape with radius)
bool isInsideCircle(int x, int y, Shape& shape) {
    int dx = x - shape.x[0];
    int dy = y - shape.y[0];
    int distanceSquared = dx * dx + dy * dy;
    int radiusSquared = shape.radius * shape.radius;
    return distanceSquared <= radiusSquared;
}

// Check if (x, y) is inside rectangle (simple bounding box check)
bool isInsideRectangle(int x, int y, Shape& shape) {
    int minX = shape.x[0];
    int maxX = shape.x[0];
    int minY = shape.y[0];
    int maxY = shape.y[0];

    for (int i = 1; i < shape.count; i++) {
        if (shape.x[i] < minX) minX = shape.x[i];
        if (shape.x[i] > maxX) maxX = shape.x[i];
        if (shape.y[i] < minY) minY = shape.y[i];
        if (shape.y[i] > maxY) maxY = shape.y[i];
    }

    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
}


void handleSave() {
    if (shapeCount >= 10) {
        server.send(500, "text/plain", "Shape storage full");
        return;
    }

    Shape& shape = shapes[shapeCount++];
    shape.name = server.arg("name");
    shape.type = server.arg("type");
    shape.count = shape.type == "point" ? 1 : (shape.type == "line" ? 2 : 4);

    // Get coordinates from the request
    for (int i = 0; i < shape.count; i++) {
        shape.x[i] = server.arg("x" + String(i + 1)).toInt();
        shape.y[i] = server.arg("y" + String(i + 1)).toInt();
    }

    // Generate equations based on the shape type
    if (shape.type == "point") {
        int radius = server.arg("radius").toInt();
        shape.equation = "(x - " + String(shape.x[0]) + ")^2 + (y - " + String(shape.y[0]) + ")^2 = " + String(radius * radius);
    } 
    else if (shape.type == "rectangle") {
        shape.equation = "Rectangle with coordinates: ";
        for (int i = 0; i < 4; i++) {
            shape.equation += "(" + String(shape.x[i]) + "," + String(shape.y[i]) + ") ";
        }
    } 
    else if (shape.type == "line") {
        int m = (shape.y[1] - shape.y[0]) / (shape.x[1] - shape.x[0]);
        int b = shape.y[0] - m * shape.x[0];
        shape.equation = "y = " + String(m) + "x + " + String(b);
    }

    // Send response back
    server.send(200, "text/plain", "Shape saved in RAM (not flash)");
}

void handleGetData() {
    StaticJsonDocument<1024> doc;
    doc["x"] = target1_x;
    doc["y"] = target1_y;

    JsonArray shapesArray = doc.createNestedArray("shapes");

    for (int i = 0; i < shapeCount; i++) {
        JsonObject shape = shapesArray.createNestedObject();
        shape["name"] = shapes[i].name;
        shape["type"] = shapes[i].type;
        shape["equation"] = shapes[i].equation;
        shape["count"] = shapes[i].count;
        if (shapes[i].type == "point") {
          shape["radius"] = shapes[i].radius;  // <-- Add this to include radius
}
        JsonArray xArray = shape.createNestedArray("x");
        JsonArray yArray = shape.createNestedArray("y");

        for (int j = 0; j < shapes[i].count; j++) {
            xArray.add(shapes[i].x[j]);
            yArray.add(shapes[i].y[j]);
        }
    }

    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
}

void handleGetCurrentCoordinates() {
    StaticJsonDocument<256> doc;
    doc["x"] = target1_x;
    doc["y"] = target1_y;
    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
}

void processRadarData() {
  if (RX_count >= 32) {
    uint16_t rawX = (RX_BUF[4] | (RX_BUF[5] << 8));
    if (rawX >= 32768) {
      rawX -= 32768;  // re-map 32768..65535 down to 0..32767
      //Changed minus to plus
      target1_x = (int16_t)rawX;
    } else {
      //Change plus to minus
      target1_x = -(int16_t)rawX;
    }
    // The image shows raw = 34481 which is converted as: 34481 - 32768 = 1713.
    uint16_t rawY = (RX_BUF[6] | (RX_BUF[7] << 8));
    if (rawY >= 32768) {
      rawY -= 32768;
    }
    target1_y = -(int16_t)rawY;
    target1_speed = (RX_BUF[8] | (RX_BUF[9] << 8));
    target1_distance_res = (RX_BUF[10] | (RX_BUF[11] << 8));
    target1_distance = sqrtf(powf((float)target1_x, 2) + powf((float)target1_y, 2));
    target1_angle = atan2f((float)target1_y, (float)target1_x) * (180.0f / M_PI);

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


void setup() {
    Serial.begin(115200);
    setupWiFi();
    Serial1.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
    //🔴
    Serial1.setRxBufferSize(64);  // Set buffer size
    Serial.println("RD-03D Radar Module Initialized");
    //🔴
    Serial1.write(Single_Target_Detection_CMD, sizeof(Single_Target_Detection_CMD));
    delay(200);
    Serial.println("Single-target detection mode activated.");
    //
    RX_count = 0;
    Serial1.flush();
    loadHardcodedShapes();
    server.on("/", handleRoot);
    server.on("/save", handleSave);
    server.on("/getData", handleGetData);
    server.on("/getCurrentCoordinates", handleGetCurrentCoordinates);
    server.on("/getEnteredShapes", handleGetEnteredShapes);
    server.begin();
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
      server.handleClient();
      delay(100);
    }
        unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        checkIfEnteredShape();
    }
  }
}
