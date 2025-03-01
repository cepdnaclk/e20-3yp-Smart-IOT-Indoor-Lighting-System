package com.example.Lightify.DTO;

import com.example.Lightify.Entity.Schedule;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ScheduleTask implements Comparable<ScheduleTask> {
    private final String roomName;
    private final String username;
    private final Schedule schedule;

    public ScheduleTask(String roomName, String username, Schedule schedule) {
        this.roomName = roomName;
        this.username = username;
        this.schedule = schedule;
    }

    /**
     * Retrieves the scheduled execution time from the associated schedule.
     */
    public LocalDateTime getScheduledTime() {
        return schedule.getScheduledDateTime();
    }

    @Override
    public int compareTo(ScheduleTask other) {
        // Compare tasks based on their scheduled execution time.
        return this.getScheduledTime().compareTo(other.getScheduledTime());
    }

    @Override
    public String toString() {
        return "ScheduleTask{" +
                "roomName='" + roomName + '\'' +
                ", username='" + username + '\'' +
                ", scheduledTime=" + getScheduledTime() +
                '}';
    }

    // Optionally, override equals and hashCode if needed.
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof ScheduleTask other)) return false;
        return roomName.equals(other.roomName) &&
                username.equals(other.username) &&
                getScheduledTime().equals(other.getScheduledTime());
    }

    @Override
    public int hashCode() {
        return roomName.hashCode() + username.hashCode() + getScheduledTime().hashCode();
    }
}
