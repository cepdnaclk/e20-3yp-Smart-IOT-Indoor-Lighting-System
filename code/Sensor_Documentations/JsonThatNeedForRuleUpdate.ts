{
  "username": "Tharindu",
  "roomName": "Bathroom",
  "bulbs": [
    { "bulbId": "b1",
            "username": "Tharindu",
            "name": "Bulb1" },
    { "bulbId": "b2",
            "username": "Tharindu",
            "name": "Bulb1" },
   { "bulbId": "b3",
            "username": "Tharindu",
            "name": "Bulb1" },
    { "bulbId": "b4",
            "username": "Tharindu",
            "name": "Bulb1" }
  ],
  "Areas": [
      {
        "type": "Bed/Table",
        "name": "Bed1",
        "equation": "Rectangle with corners (1000,-1000), (1000,-2000), (2000,-2000), (2000,-1000)",
        "x": [1000, 1000, 2000, 2000],
        "y": [-1000, -2000, -2000, -1000]
      },
      {
        "type": "point",
        "name": "LightZone1",
        "equation": "(x + 500)^2 + (y + 500)^2 = 250000",
        "x": [-500],
        "y": [-500]
      },
      {
        "type": "Door",
        "name": "Door1",
        "equation": "y = -4000",
        "x": [-1000, 1000],
        "y": [-4000, -4000]
      }
    ],
  "Automation_Modes": [
    {
      "Mode_Name": "Night Mode",
      "Rules": [
      {
        "Rule_Name": "BedRule",
        "Area": {
          "type": "Bed/Table",
          "name": "Bed1",
          "equation": "Rectangle with corners (1000,-1000), (1000,-2000), (2000,-2000), (2000,-1000)",
          "x": [1000, 1000, 2000, 2000],
          "y": [-1000, -2000, -2000, -1000]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 }],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "00:00",
        "End_Time": "23:59",
        "Priority": "High"
      },
      {
        "Rule_Name": "LightZoneRule",
        "Area": {
          "type": "point",
          "name": "LightZone1",
          "equation": "(x + 500)^2 + (y + 500)^2 = 250000",
          "x": [-500],
          "y": [-500]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b2", "intensity": 80 }],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "00:00",
        "End_Time": "23:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "DoorRule",
        "Area": {
          "type": "Door",
          "name": "Door1",
          "equation": "y = -4000",
          "x": [-1000, 1000],
          "y": [-4000, -4000]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b1", "intensity": 100 },
            { "bulb": "b2", "intensity": 100 },
            { "bulb": "b3", "intensity": 100 },
            { "bulb": "b4", "intensity": 100 }
          ],
          "OFF": []
        },
        "Start_Time": "00:00",
        "End_Time": "23:59",
        "Priority": "Low"
      },
      {
        "Rule_Name": "None",
        "Area": {
          "type": "None",
          "name": "None",
          "equation": "",
          "x": [],
          "y": []
        },
        "Selected_Bulbs": {
          "ON": [],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "00:00",
        "End_Time": "23:59",
        "Priority": "Low"
      }
    ]
    },
    {
      "Mode_Name": "night_mode",
      "Rules": [
        {
          "Rule_Name": "Light 1_1747855896417",
          "Area": {
            "type": "point",
            "name": "Light 1",
            "equation": "(x - 0)^2 + (y - 0)^2 = 4000000",
            "x": [0],
            "y": [0]
          },
          "Selected_Bulbs": {
            "ON": [
              { "bulb": "b1", "intensity": 61 },
              { "bulb": "b3", "intensity": 79 }
            ],
            "OFF": [
              { "bulb": "b2", "intensity": 0 },
              { "bulb": "b4", "intensity": 0 }
            ]
          },
          "Start_Time": "01:00",
          "End_Time": "02:00",
          "Priority": "Low"
        },
        {
          "Rule_Name": "Door 1_1747855970623",
          "Area": {
            "type": "Door",
            "name": "Door 1",
            "equation": "y = -1.000x + 0.0",
            "x": [0, 500],
            "y": [0, -500]
          },
          "Selected_Bulbs": {
            "ON": [
              { "bulb": "b1", "intensity": 85 },
              { "bulb": "b3", "intensity": 69 }
            ],
            "OFF": [
              { "bulb": "b2", "intensity": 0 },
              { "bulb": "b4", "intensity": 0 }
            ]
          },
          "Start_Time": "01:01",
          "End_Time": "03:01",
          "Priority": "Medium"
        }
      ]
    },
    {
    "Mode_Name": "Normal_Mode",
    "Rules": [
      {
        "Rule_Name": "SleepZoneRule",
        "Area": {
          "type": "Bed/Table",
          "name": "Bed1",
          "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
          "x": [1000, 1200, 1200, 1000],
          "y": [2000, 2000, 2200, 2200]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b1", "intensity": 80 },
            { "bulb": "b2", "intensity": 60 }
          ],
          "OFF": [
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "22:00",
        "End_Time": "21:00",
        "Priority": "High"
      },
      {
        "Rule_Name": "BedMorningRule",
        "Area": {
          "type": "Bed/Table",
          "name": "Bed1",
          "equation": "Rectangle with corners (1000,2000), (1200,2000), (1200,2200), (1000,2200)",
          "x": [1000, 1200, 1200, 1000],
          "y": [2000, 2000, 2200, 2200]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b3", "intensity": 70 }],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "06:00",
        "End_Time": "05:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "DoorMonitorMorning",
        "Area": {
          "type": "Door",
          "name": "Door1",
          "equation": "y = 1.5x + 300.0",
          "x": [1200, 1800],
          "y": [1800, 2400]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b4", "intensity": 50 }],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "08:00",
        "End_Time": "7:59",
        "Priority": "Low"
      },
      {
        "Rule_Name": "DoorEveningAlert",
        "Area": {
          "type": "Door",
          "name": "Door1",
          "equation": "y = 1.5x + 300.0",
          "x": [1200, 1800],
          "y": [1800, 2400]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b1", "intensity": 90 },
            { "bulb": "b4", "intensity": 90 }
          ],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "17:00",
        "End_Time": "16:59",
        "Priority": "High"
      },
      {
        "Rule_Name": "LightZoneDaytime",
        "Area": {
          "type": "point",
          "name": "LightZone1",
          "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
          "x": [1500],
          "y": [2000]
        },
        "Selected_Bulbs": {
          "ON": [
            { "bulb": "b2", "intensity": 70 },
            { "bulb": "b3", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b1", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "09:00",
        "End_Time": "08:59",
        "Priority": "Low"
      },
      {
        "Rule_Name": "LightZoneEvening",
        "Area": {
          "type": "point",
          "name": "LightZone1",
          "equation": "(x - 1500)^2 + (y - 2000)^2 = 9000000",
          "x": [1500],
          "y": [2000]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 }],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "DeskZoneEvening",
        "Area": {
        "type": "point",
        "name": "DeskZone",
        "equation": "(x + 1000)^2 + (y + 3000)^2 = 1600000",
        "x": [-1000],
        "y": [-3000]
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 },
                { "bulb": "b2", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b3", "intensity": 0 },
            { "bulb": "b4", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      },
      {
        "Rule_Name": "None",
        "Area": {
        "type": "None",
        "name": "None",
        "equation": "",
        "x": [],
        "y": []
        },
        "Selected_Bulbs": {
          "ON": [{ "bulb": "b1", "intensity": 100 },
                { "bulb": "b4", "intensity": 70 }
          ],
          "OFF": [
            { "bulb": "b2", "intensity": 0 },
            { "bulb": "b3", "intensity": 0 }
          ]
        },
        "Start_Time": "14:00",
        "End_Time": "13:59",
        "Priority": "Medium"
      }
    ]
    } 
  ]
}
