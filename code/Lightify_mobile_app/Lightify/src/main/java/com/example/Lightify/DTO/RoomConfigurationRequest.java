package com.example.Lightify.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import com.example.Lightify.Entity.Bulb;
import com.example.Lightify.Entity.AreaDetail;
import com.example.Lightify.Entity.ModeDetail;

@Data
public class RoomConfigurationRequest {
    private String username;
    private String roomName;
    private List<Bulb> bulbs;
    @JsonProperty("Areas")
    private List<AreaDetail> areas;

    @JsonProperty("Automation_Modes")
    private List<ModeDetail> automationModes;
}
