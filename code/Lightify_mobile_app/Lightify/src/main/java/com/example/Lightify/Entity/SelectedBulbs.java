package com.example.Lightify.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectedBulbs {
    @JsonProperty("ON")
    private List<SelectedBulb> on;

    @JsonProperty("OFF")
    private List<SelectedBulb> off;
}