package com.example.Lightify.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModeDetail {
    @JsonProperty("Mode_Name")
    private String modeName;

    @JsonProperty("Rules")
    private List<RuleDetail> rules;
}