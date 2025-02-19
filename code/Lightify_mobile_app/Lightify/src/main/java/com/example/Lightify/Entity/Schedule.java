package com.example.Lightify.Entity;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class Schedule {
    private LocalDate date;
    private LocalTime time;
    private int intensityPercentage;
    private String color;
    private boolean recurrence;
    private List<String> bulbId;
}
