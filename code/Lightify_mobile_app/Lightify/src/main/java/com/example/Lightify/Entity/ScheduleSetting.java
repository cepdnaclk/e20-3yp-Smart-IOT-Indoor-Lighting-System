package com.example.Lightify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Each document represents exactly one schedule_set request, tagged by (username, roomName).
 * We store:
 *   - date, time → when the device should execute
 *   - message[] → which bulbs & brightness levels
 *   - automation → { schedule_type: "non_permanent"|"permanent", schedule_working_period: <minutes>|null }
 *
 * Collections “schedule_settings” will contain many of these; we queue them in memory at runtime
 * based on their LocalDate+LocalTime.
 */
@Data
@Document(collection = "schedule_settings")
public class ScheduleSetting {
    @Id
    private String id;

    private String username;
    private String roomName;

    /** Array of { bulb_id, brightness } */
    private List<BulbInfo> message;

    /** "non_permanent" or "permanent" */
    private String scheduleType;

    /** If non_permanent, run for this many minutes. If permanent, null. */
    private Integer scheduleWorkingPeriod;

    /**
     * The date on which the device should execute, e.g. "2025-06-05".
     * Provided by front‐end JSON.
     */
    private LocalDate date;

    /**
     * The time of day on which it should execute, e.g. "14:30".
     * Provided by front‐end JSON.
     */
    private LocalTime time;

    @Data
    public static class BulbInfo {
        private int bulb_id;
        private int brightness;
    }
}
