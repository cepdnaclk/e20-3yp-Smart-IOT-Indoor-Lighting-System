package com.example.Lightify.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "automation_modes")
public class AutomationMode {
    @Id
    private String id;
    private String username;
    private String roomName;
    private List<ModeDetail> Automation_Modes;
    private String currentlyActivatedMode;
}
