package com.example.Lightify.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "areas")
public class Area {
    @Id
    private String id;
    private String username;
    private String roomName;
    @JsonProperty("Areas")
    private List<AreaDetail> areas;

    public Area(String username, String roomName, List<AreaDetail> areas) {
        this.username = username;
        this.roomName = roomName;
        this.areas = areas;
    }
}
