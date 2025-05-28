package com.example.Lightify.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SelectedBulb {
    private String bulb;
    private int intensity;
}