package com.example.Lightify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "room_states")
@CompoundIndex(name = "username_room_unique", def = "{ 'username': 1, 'roomName': 1 }", unique = true)
public class RoomState {
    @Id
    private String id;

    // Field names must match exactly what you see in Compass:
    private String username;
    private String roomName;

    // This matches “payload.message” in your JSON:
    private List<BulbInfo> message;

    @Data
    public static class BulbInfo {
        private int bulb_id;
        private int brightness;
    }
}
