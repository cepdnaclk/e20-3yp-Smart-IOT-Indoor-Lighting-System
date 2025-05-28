package com.example.Lightify.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RuleDetail {
    @JsonProperty("Rule_Name")
    private String ruleName;

    @JsonProperty("Area")
    private AreaDetail area;

    @JsonProperty("Selected_Bulbs")
    private SelectedBulbs selectedBulbs;

    @JsonProperty("Start_Time")
    private String startTime;

    @JsonProperty("End_Time")
    private String endTime;

    @JsonProperty("Priority")
    private String priority;
}