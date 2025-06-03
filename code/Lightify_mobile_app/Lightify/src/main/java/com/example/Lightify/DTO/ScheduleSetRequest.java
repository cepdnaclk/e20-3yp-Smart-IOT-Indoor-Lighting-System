package com.example.Lightify.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Matches JSON of the form:
 *
 * {
 *   "command": "schedule_set",
 *   "payload": {
 *     "room_name": "kitchen",
 *     "date": "2025-06-05",                 // newly‐added
 *     "time": "14:30",                      // newly‐added
 *     "message": [
 *       { "bulb_id": 1, "brightness": 74 },
 *       { "bulb_id": 2, "brightness": 74 },
 *       { "bulb_id": 3, "brightness": 74 }
 *     ],
 *     "automation": [
 *       { "schedule_type": "non_permanent", "schedule_working_period": 30 }
 *     ]
 *   }
 * }
 *
 * (If the schedule is permanent, schedule_working_period can be null:
 *
 * {
 *   "command": "schedule_set",
 *   "payload": {
 *     "room_name": "kitchen",
 *     "date": "2025-06-05",
 *     "time": "14:30",
 *     "message": [ … ],
 *     "automation": [
 *       { "schedule_type": "permanent", "schedule_working_period": null }
 *     ]
 *   }
 * }
 * )
 */
@Data
public class ScheduleSetRequest {
    private String command;
    private Payload payload;

    @Data
    public static class Payload {
        private String room_name;

        /** Must be formatted exactly "yyyy‐MM‐dd". */
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate date;

        /** Must be formatted exactly "HH:mm". */
        @JsonFormat(pattern = "HH:mm")
        private LocalTime time;

        private List<BulbInfo> message;
        private List<AutomationInfo> automation;
    }

    @Data
    public static class BulbInfo {
        private int bulb_id;
        private int brightness;
    }

    @Data
    public static class AutomationInfo {
        private String schedule_type;
        private Integer schedule_working_period;
    }
}
