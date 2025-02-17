# Lightify - Smart Indoor Light Control & Automation System

Lightify is a Smart Indoor Light Control & Automation System designed to transform any indoor space into an intelligent, automated environment. Our system offers motion-based lighting activation, zone-specific lighting control, and app-based management, providing convenience, energy efficiency, and modern automation.

---

## Project Overview

The project involves developing an embedded system that integrates smart lighting solutions with IoT technology. Key features include:
- **Motion-based lighting activation** to save energy.
- **Zone-specific lighting control** for customized lighting environments.
- **App-based control** for ease of access and management.

This repository contains all necessary files and documentation related to the project.

---

## Team Members
- **E/20/262:** Tharindu Lakshan ([e20262@eng.pdn.ac.lk](mailto:e20262@eng.pdn.ac.lk))
- **E/20/266:** Pradeep Nilupul ([e20266@eng.pdn.ac.lk](mailto:e20266@eng.pdn.ac.lk))
- **E/20/449:** Sandaru Wijewardhana ([e20449@eng.pdn.ac.lk](mailto:e20449@eng.pdn.ac.lk))
- **E/20/288:** Chalaka Perera ([e20288@eng.pdn.ac.lk](mailto:e20288@eng.pdn.ac.lk))

---

## Solution Architecture & Components

The system comprises three main components:
- **Control Unit:** ESP32 and AC dimmer circuit for light control.
- **Central Hub:** Manages communication and overall control.
- **Sensor Unit:** Includes humidity, radar, and ambient light sensors.

### Architecture Diagrams
- ![Solution Architecture](images/SolutionArchitecture.png)
- ![Components & Data Flow](images/Components&DataFlow.png)
- ![Components & Data Flow Explained](images/Components&DataFlowExplained.png)

---

## Budget

- **Control Unit:**
  - ESP32 = LKR 1200
  - 4-channel AC dimmer circuit = LKR 1000
- **Central Hub:**
  - ESP32 and other components = LKR 3000
- **Sensor Unit:**
  - Humidity Sensor = LKR 500
  - RD-03D mm wave radar sensor = LKR 1250
  - VEML7700 Ambient light sensor = LKR 1200

**Total cost per unit: LKR 8150**

---

## Useful Links
- [Project Repository](https://github.com/cepdnaclk/e20-3yp-Smart-IOT-Indoor-Lighting-System)
- [Project Page](https://cepdnaclk.github.io/e20-3yp-Smart-IOT-Indoor-Lighting-System)

---

This project is part of the Embedded Systems module at the Department of Computer Engineering, University of Peradeniya.


```
{
  "title": "This is the title of the project",
  "team": [
    {
      "name": "Team Member Name 1",
      "email": "email@eng.pdn.ac.lk",
      "eNumber": "E/yy/xxx"
    },
    {
      "name": "Team Member Name 2",
      "email": "email@eng.pdn.ac.lk",
      "eNumber": "E/yy/xxx"
    },
    {
      "name": "Team Member Name 3",
      "email": "email@eng.pdn.ac.lk",
      "eNumber": "E/yy/xxx"
    }
  ],
  "supervisors": [
    {
      "name": "Dr. Supervisor 1",
      "email": "email@eng.pdn.ac.lk"
    },
    {
      "name": "Supervisor 2",
      "email": "email@eng.pdn.ac.lk"
    }
  ],
  "tags": ["Web", "Embedded Systems"]
}
```

Once you filled this _index.json_ file, please verify the syntax is correct. (You can use [this](https://jsonlint.com/) tool).

### Page Theme

A custom theme integrated with this GitHub Page, which is based on [github.com/cepdnaclk/eYY-project-theme](https://github.com/cepdnaclk/eYY-project-theme). If you like to remove this default theme, you can remove the file, _docs/\_config.yml_ and use HTML based website.
