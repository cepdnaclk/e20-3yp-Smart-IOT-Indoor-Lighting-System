#include "WiFiConfig.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESPmDNS.h>
#include <Preferences.h>

static String ssid="", pass="", userName="", sensorMac="";

// ——— reset — clears both “wifi” and “config” namespaces ———
void WiFiConfig::reset() {
  Preferences p;
  p.begin("wifi", false);
  p.clear();
  p.end();
  p.begin("config", false);
  p.clear();
  p.end();
  Serial.println("⚠️ All credentials cleared from NVM.");
}

// ——— load & save credentials ———
void WiFiConfig::loadCredentials() {
  Preferences p;
  p.begin("wifi", true);
  ssid = p.getString("ssid", "");
  pass = p.getString("pass", "");
  p.end();
  Serial.print("Loaded SSID: "); Serial.println(ssid);
}

void WiFiConfig::saveCredentials(const String& s, const String& pw) {
  Preferences p;
  p.begin("wifi", false);
  p.putString("ssid", s);
  p.putString("pass", pw);
  p.end();
  Serial.println("✅ WiFi credentials saved to NVM.");
}

// ——— load & save sensorMac ———
void WiFiConfig::loadSensorMac() {
  Preferences p;
  p.begin("wifi", true);
  sensorMac = p.getString("sensorMac", "");
  p.end();
  Serial.print("Loaded Sensor MAC: "); Serial.println(sensorMac);
}

void WiFiConfig::saveSensorMac(const String& mac) {
  Preferences p;
  p.begin("wifi", false);
  p.putString("sensorMac", mac);
  p.end();
  Serial.println("✅ Sensor MAC saved to NVM: " + mac);
}

// ——— load & save userName ———
void WiFiConfig::loadUserName() {
  Preferences p;
  p.begin("config", true);
  userName = p.getString("userName", "");
  p.end();
  Serial.print("Loaded User Name: "); Serial.println(userName);
}

void WiFiConfig::saveUserName(const String& name) {
  Preferences p;
  p.begin("config", false);
  p.putString("userName", name);
  p.end();
  Serial.println("✅ User Name saved to NVM: " + name);
}

static void startConfigPortal() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP("ESP32_Config");

  if (!MDNS.begin("esp32")) {
    Serial.println("Error setting up mDNS responder!");
  }

  AsyncWebServer server(80);

  // Build SSID dropdown options
  int numNetworks = WiFi.scanNetworks();
  String networkOptions = "<option value=''>-- Select WiFi --</option>";
  for (int i = 0; i < numNetworks; i++) {
    networkOptions += "<option value='" + WiFi.SSID(i) + "'>"
                    + WiFi.SSID(i) + " (" + String(WiFi.RSSI(i)) + " dBm)</option>";
  }
  networkOptions += "<option value='custom'>Other (Enter Manually)</option>";

  // HTTP GET handler: show form
  server.on("/", HTTP_GET, [networkOptions](AsyncWebServerRequest *request) {
    String html = R"rawliteral(
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Device Configuration</title>
        <style>
          body { font-family: Arial; text-align: center; background: #f4f4f4; }
          .container {
            max-width: 400px;
            background: white;
            padding: 20px;
            margin: 50px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          input, select {
            width: 90%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          input[type='submit'] {
            background: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
          }
          input[type='submit']:hover {
            background: #218838;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Configure Device</h1>
          <form action="/save" method="POST">
            <label>Wi-Fi SSID:</label>
            <select id="ssidSelect" name="ssid" onchange="toggleManualInput()">
    )rawliteral"
    + networkOptions +
    R"rawliteral(
            </select><br>
            <input type="text" id="manualSSID" name="manualSSID"
                   placeholder="Enter SSID manually" style="display:none;"><br>

            <label>Password:</label>
            <input type="password" name="password" required><br>

            <label>User Name:</label>
            <input type="text" name="userName" placeholder="e.g. Alice" required><br>

            <label>Sensor MAC (AA:BB:CC:DD:EE:FF):</label>
            <input type="text" name="sensorMac"
                   placeholder="xx:xx:xx:xx:xx:xx" required><br>

            <input type="submit" value="Save & Reboot">
          </form>
        </div>
        <script>
          function toggleManualInput() {
            var sel = document.getElementById('ssidSelect');
            var man = document.getElementById('manualSSID');
            man.style.display = sel.value==='custom' ? 'block':'none';
          }
        </script>
      </body>
      </html>
    )rawliteral";

    request->send(200, "text/html", html);
  });

  // HTTP POST handler: save values and reboot
  server.on("/save", HTTP_POST, [](AsyncWebServerRequest *request) {
    String s = request->getParam("ssid", true)->value();
    if (s == "custom") {
      s = request->getParam("manualSSID", true)->value();
    }
    ssid       = s;
    pass       = request->getParam("password", true)->value();
    userName   = request->getParam("userName", true)->value();
    sensorMac  = request->getParam("sensorMac", true)->value();

    // Persist to NVM
    Preferences p;
    p.begin("wifi", false);
    p.putString("ssid", ssid);
    p.putString("pass", pass);
    p.putString("sensorMac", sensorMac);
    p.end();

    p.begin("config", false);
    p.putString("userName", userName);
    p.end();

    // Acknowledge then reboot
    request->send(200, "text/html",
                  "<!DOCTYPE html><html><body>"
                  "<h3>Saved — rebooting…</h3>"
                  "</body></html>");
    delay(1000);
    ESP.restart();
  });

  server.begin();
  Serial.println("Config Portal Started. Connect to SSID 'ESP32_Config' and open http://esp32.local");
  // Block here forever
  while (true) {
    delay(100);
  }
}

void WiFiConfig::begin() {
  loadCredentials();
  loadSensorMac();
  loadUserName();

  if (ssid == "" || pass == "") {
    startConfigPortal();
  }
}

String WiFiConfig::getSSID()      { return ssid; }
String WiFiConfig::getPassword()  { return pass; }
String WiFiConfig::getUserName()  { return userName; }
String WiFiConfig::getSensorMac() { return sensorMac; }
