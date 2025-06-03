package com.example.Lightify.DTO;

import com.example.Lightify.Entity.ScheduleSetting;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Wraps a ScheduleSetting so we can put it in a PriorityQueue ordered
 * by the actual execution timestamp (date + time).
 *
 * If two schedules have the exact same date+time, the queue will poll both
 * in the same “second”—they will both be submitted to publishPool at once.
 */
@Getter
public class ScheduleTask implements Comparable<ScheduleTask> {
    private final String roomName;
    private final String username;
    private final ScheduleSetting schedule;

    public ScheduleTask(String roomName, String username, ScheduleSetting schedule) {
        this.roomName = roomName;
        this.username = username;
        this.schedule = schedule;
    }

    /** Compute the exact execution timestamp from date+time */
    public LocalDateTime getScheduledTime() {
        return LocalDateTime.of(schedule.getDate(), schedule.getTime());
    }

    @Override
    public int compareTo(ScheduleTask other) {
        return this.getScheduledTime().compareTo(other.getScheduledTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ScheduleTask other)) return false;
        return roomName.equals(other.roomName)
                && username.equals(other.username)
                && getScheduledTime().equals(other.getScheduledTime());
    }

    @Override
    public int hashCode() {
        return roomName.hashCode()
                + username.hashCode()
                + getScheduledTime().hashCode();
    }

    @Override
    public String toString() {
        return "ScheduleTask{" +
                "roomName='" + roomName + '\'' +
                ", username='" + username + '\'' +
                ", scheduledTime=" + getScheduledTime() +
                '}';
    }
}
