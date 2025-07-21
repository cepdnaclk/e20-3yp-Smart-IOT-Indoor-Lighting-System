# Lightify – Smart Indoor Light Control & Automation System

## 1. Introduction

**Lightify** is a next‑generation home and commercial lighting solution that combines advanced sensor technologies, cloud connectivity, and automation to deliver adaptive, personalized illumination. By continuously detecting human presence and position via ultrasonic and millimeter‑wave sensors, it dynamically adjusts light intensity only where needed, drastically cutting energy waste. Thermal imaging further enables sleep‑mode dimming—gently reducing brightness when occupants rest and smoothly brightening as they awaken. Remote access through a React Native mobile app gives users full global control. Overall, Lightify enhances comfort and fits seamlessly into modern smart homes and offices.

---

## 2. Project Overview

| Component        | Description                                                                         |
|------------------|-------------------------------------------------------------------------------------|
| **Control Unit** | ESP32 + 4‑channel AC dimmer circuit for real‑time light intensity control.         |
| **Sensor Unit**  | ESP32 + RD‑03D mm‑wave radar + VEML7700 ambient‑light + humidity sensors.           |


---

## 3. Team Members

| Student No. | Name                         | Email                                  |
|------------:|------------------------------|----------------------------------------|
| **E/20/262**| Tharindu Lakshan             | <e20262@eng.pdn.ac.lk>                 |
| **E/20/266**| Pradeep Nilupul              | <e20266@eng.pdn.ac.lk>                 |
| **E/20/449**| Sandaru Wijewardhana         | <e20449@eng.pdn.ac.lk>                 |
| **E/20/288**| Chalaka Perera               | <e20288@eng.pdn.ac.lk>                 |

**Supervisors**  
- Dr. Isuru Navinne – "isurunawinne@eng.pdn.ac.lk"   
---

## 4. Objectives

1. **Adaptive Illumination**  
   Real‑time human position detection & dynamic intensity adjustment.
2. **Energy Efficiency**  
   Zone‑specific lighting & sleep‑mode dimming to minimize waste.
3. **Seamless Control**  
   Mobile app and cloud‑based scheduling for on/off and brightness presets.
4. **User Comfort**  
   Personalized experience with motion‑based and voice‑activated modes.

---

## 5. Features

### 5.1 Hardware

- **Ultrasonic & mm‑Wave Detection**  
  - Ultrasonic (RD‑03D): precise distance measurements.  
  - 24 GHz FMCW radar: angle & range resolution for position tracking.  
- **Control Unit**  
  - ESP32‑WROOM‑32 for local scheduling & fallback routines.  
  - 4‑channel AC dimmer (MOSFET based) for per‑bulb PWM control.  
- **Communication**  
  - **MQTT** via AWS IoT Core for cloud sync.  
  - **ESP‑NOW & BLE** for local sensor ↔ controller messaging (chunked JSON with seq/ACK).  
  - **WebSocket** server on hub for live coordinate streaming to mobile app.
- **Mobile App**  
  - React Native + Expo UI for profile management, QR Wi‑Fi setup, scheduling, live‑map view.

### 5.2 Software & Cloud

- **Backend**  
  - Spring Boot REST & WebSocket endpoints.  
  - MongoDB Atlas for device, user prefs & schedule storage.  
- **AWS Services**  
  - **IoT Core**: secure device MQTT broker & rules engine.  
  - **Rekognition**: facial recognition for personalized voice greetings.  
  - **S3**: stores profile images.  
- **Mobile**  
  - Used react native.
  - QR code for network credentials (`react-native-qrcode-svg`).  
  - OTA updates via Expo EAS.

---

## 6. Detailed Architecture

### 6.1 High‑Level Communication

Controller is split into **A** (Internet/IoT) and **B** (local comms):

- **Controller A** connects to AWS IoT Core over Wi‑Fi → handles schedules & direct user settings.  
- **Controller B** uses BLE to receive Wi‑Fi creds & ESP‑NOW channel info from Controller A → streams sensor coordinates & automation triggers.  
- **Serial link** between A & B carries chunked JSON (seq‑number + ACK + buffering) for reliable data exchange.  
- **Mobile WebSocket**: Controller B hosts WS server → mobile app listens for live position dots on room map.  

### 6.2 Controller Communication Design

Our controller design uses two ESP32s due to a hardware constraint: simultaneous use of Wi‑Fi (for AWS IoT Core) and ESP‑NOW/BLE (for local communication) isn’t possible with a single antenna. To solve this:

- We split the controller into **Controller A** and **Controller B**, connected via serial communication.

#### Controller A
- Connects to the internet via Wi‑Fi.  
- Handles MQTT communication with AWS IoT Core and fetches bulb settings/schedules from the backend database.  
- Directly controls the AC/DC dimmer hardware wired to it.  
- Sends Wi‑Fi credentials and the MAC address of the sensor to Controller B for network access and WebSocket streaming.  

#### Controller B
- Receives automation lighting setup triggers from the sensor (via ESP‑NOW/BLE).  
- Relays triggers to Controller A over the serial link.  
- Hosts a WebSocket server over TCP/IP to stream real-time sensor coordinates to the mobile app GUI (for live dot placement).  

Local sensor communication is handled via:  
- **BLE** for credential transfer and control signals (including broadcast restarts on Controller B reboot).  
- **ESP‑NOW** for position data and lighting rule distribution.  

Automation rules are stored in MongoDB Atlas and distributed to sensors as needed.  

Reliability over the serial link is ensured using a chunked JSON transmission system with sequence numbers, acknowledgments, buffers, and queues.  


### 6.3 Sensor Unit FSM

| State        | Flags       | Actions                                                                                     | Next            |
|--------------|-------------|---------------------------------------------------------------------------------------------|-----------------|
| **State 1**  | BLE=1, R=1  | Connect BLE → Receive & store Wi‑Fi creds → BLE=0, restart → ↠ State 2                     | State 2         |
| **State 2**  | BLE=0, R=1  | Deinit BLE → Connect Wi‑Fi & MQTT → Store rules JSON → BLE=1, R=0, restart → ↠ State 3     | State 3         |
| **State 3**  | BLE=1, R=0  | Normal op → BLE monitoring → On config change set BLE=1, R=1 + restart → ↠ State 1         | (loop back)     |

---

## 7. Budget

| Item                             | Qty | Unit Price (LKR) | Total (LKR) |
|----------------------------------|----:|------------------:|------------:|
| ESP32                            |   3 |            1,250 |       3,750 |
| 4‑channel AC dimmer circuit      |   1 |            1,000 |       1,000 |
| RD‑03D mm‑Wave Radar             |   1 |            1,250 |       1,250 |
| USB Cables                       |   3 |              250 |         750 |
| Miscellaneous                    |   – |            **–** |       1,000 |
| **Total per unit**               |     |                   |       7,750 |

---

## 8. Getting Started

### 8.1 Clone & Prerequisites

```bash
git clone https://github.com/cepdnaclk/e20-3yp-Smart-IOT-Indoor-Lighting-System.git
cd e20-3yp-Smart-IOT-Indoor-Lighting-System
