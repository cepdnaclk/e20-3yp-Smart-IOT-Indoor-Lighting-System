package com.example.Lightify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "room_settings")
@CompoundIndex(name = "user_room_unique", def = "{'username':1,'roomName':1}", unique = true)
public class RoomSetting {
    @Id
    private String id;
    private String username;
    private String roomName;
    private List<DeviceAssignment> addedDevices;
}