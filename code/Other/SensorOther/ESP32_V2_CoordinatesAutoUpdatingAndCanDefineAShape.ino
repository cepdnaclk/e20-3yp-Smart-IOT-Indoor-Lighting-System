#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Preferences.h>

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
    String equation;  // To store the equation of the shape
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
                   <input type='number' id='radius' readonly>
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
function plotCircle(x, y, radius) {
    const plotX = scaleX(x);
    const plotY = scaleY(y);
    const plotRadius = radius * SCALE; // Apply scale to radius

    ctx.fillStyle = 'red'; // Fill color for the circle
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

            plotCircle(liveX, liveY, 5); // Using plotCircle instead of plotPoint

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
                        plotCircle(coords[0].x, coords[0].y, radius); // Plot circle for point
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

updateCoordinateFields();
setInterval(loadSavedShapes, 100);

</body>
</html>
)rawliteral";
}


void handleRoot() {
    server.send(200, "text/html", generateHTML());
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
        // Point: Store the coordinates and generate a circle equation (x - cx)^2 + (y - cy)^2 = r^2
        int radius = server.arg("radius").toInt();
        shape.equation = "(x - " + String(shape.x[0]) + ")^2 + (y - " + String(shape.y[0]) + ")^2 = " + String(radius * radius);
    }
    else if (shape.type == "rectangle") {
        // Rectangle: Generate line equations for each side (Ax + By + C = 0)
        shape.equation = "Rectangle with coordinates: ";
        for (int i = 0; i < 4; i++) {
            shape.equation += "(" + String(shape.x[i]) + "," + String(shape.y[i]) + ") ";
        }
    }
    else if (shape.type == "line") {
        // Line: Generate the line equation (y = mx + b)
        int m = (shape.y[1] - shape.y[0]) / (shape.x[1] - shape.x[0]);
        int b = shape.y[0] - m * shape.x[0];
        shape.equation = "y = " + String(m) + "x + " + String(b);
    }

    // Store shape data in preferences (flash memory)
    preferences.begin("shapes", false);
    String shapeKey = "shape" + String(shapeCount);
    preferences.putString(shapeKey + "_name", shape.name);
    preferences.putString(shapeKey + "_type", shape.type);
    preferences.putInt(shapeKey + "_count", shape.count);
    preferences.putString(shapeKey + "_equation", shape.equation);  // Save the equation
    for (int i = 0; i < shape.count; i++) {
        preferences.putInt(shapeKey + "_x" + String(i + 1), shape.x[i]);
        preferences.putInt(shapeKey + "_y" + String(i + 1), shape.y[i]);
    }
    preferences.end();

    server.send(200, "text/plain", "Shape saved");
}


void handleGetData() {
    StaticJsonDocument<1024> doc;
    doc["x"] = target1_x;
    doc["y"] = target1_y;

    JsonArray shapesArray = doc.createNestedArray("shapes");
    preferences.begin("shapes", true);
    for (int i = 0; i < 10; i++) {
        String shapeKey = "shape" + String(i + 1);
        if (preferences.isKey(shapeKey + "_name")) {
            JsonObject shape = shapesArray.createNestedObject();
            shape["name"] = preferences.getString(shapeKey + "_name");
            shape["type"] = preferences.getString(shapeKey + "_type");
            shape["equation"] = preferences.getString(shapeKey + "_equation");  // Fetch the equation
            shape["count"] = preferences.getInt(shapeKey + "_count");

            JsonArray xArray = shape.createNestedArray("x");
            JsonArray yArray = shape.createNestedArray("y");

            int count = shape["count"];
            for (int j = 0; j < count; j++) {
                xArray.add(preferences.getInt(shapeKey + "_x" + String(j + 1)));
                yArray.add(preferences.getInt(shapeKey + "_y" + String(j + 1)));
            }
        }
    }
    preferences.end();

    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
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
    server.on("/", handleRoot);
    server.on("/save", handleSave);
    server.on("/getData", handleGetData);
    server.on("/getCurrentCoordinates", handleGetCurrentCoordinates);
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
  }
}
