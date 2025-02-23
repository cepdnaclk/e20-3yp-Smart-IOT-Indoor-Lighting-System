package com.example.Lightify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection="topics")
@CompoundIndex(name = "nic_room_unique", def = "{'nic' : 1, 'roomName' : 1}", unique = true)
public class Topic {
    @Id
    private String id;

    private String roomName;
    private String nic;
    private String macAddress;

    public String getTopicString() {
        return nic + "/" + macAddress;
    }
}
