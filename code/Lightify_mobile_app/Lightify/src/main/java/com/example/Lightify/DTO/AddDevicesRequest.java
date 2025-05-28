package com.example.Lightify.DTO;


import com.example.Lightify.Entity.DeviceAssignment;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for incoming JSON:
 * {
 *   "roomName": "Bathroom",
 *   "username": "Tharindu",
 *   "Added Devices": [ { "deviceName":"Device 4", "macAddress":"94:54:..." } ]
 * }
 */
@Data
@NoArgsConstructor
public class AddDevicesRequest {
    @JsonProperty("roomName")
    private String roomName;

    private String username;

    @JsonProperty("addedDevices")
    private List<DeviceAssignment> addedDevices;
}
