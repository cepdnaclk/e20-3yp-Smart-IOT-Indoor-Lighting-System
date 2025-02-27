package com.example.Lightify.Entity;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    // Helper method to combine date and time into LocalDateTime
    public LocalDateTime getScheduledDateTime() {
        return LocalDateTime.of(date, time);  // Combines LocalDate and LocalTime into one LocalDateTime
    }

    // Method to check if the schedule time has passed
    public boolean isExpired() {
        return getScheduledDateTime().isBefore(LocalDateTime.now());  // Checks if scheduled time is in the past
    }

    // Method to check if the schedule time is now
    public boolean isDueNow() {
        return getScheduledDateTime().isEqual(LocalDateTime.now());  // Checks if the schedule time is exactly now
    }

    public boolean isDueWithinNextMinute() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime scheduleTime = getScheduledDateTime();
        // Check if the schedule is not in the past and is before now+1 minute
        return (!scheduleTime.isBefore(now)) && scheduleTime.isBefore(now.plusMinutes(1));
    }

}
