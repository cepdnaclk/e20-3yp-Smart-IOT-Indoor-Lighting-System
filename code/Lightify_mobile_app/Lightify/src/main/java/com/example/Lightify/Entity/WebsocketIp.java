package com.example.Lightify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Stores the latest “websocket_ip” payload for a given (username, roomName).
 * Again uses a compound unique index so that saving another one replaces the old.
 */
@Data
@Document(collection = "websocket_ips")
@CompoundIndex(
        name = "username_room_unique",
        def = "{ 'username': 1, 'roomName': 1 }",
        unique = true
)
public class WebsocketIp {
    @Id private String id;

    private String username;
    private String roomName;

    /** This comes from { "payload": { "ipaddress": "192.168.8.107" } } **/
    private String ipaddress;
}
