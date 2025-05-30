package com.example.Lightify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bulbs")
public class Bulb {
    @Id
    private String id;
    private String bulbId;
    private String username;
    private String name;
}
