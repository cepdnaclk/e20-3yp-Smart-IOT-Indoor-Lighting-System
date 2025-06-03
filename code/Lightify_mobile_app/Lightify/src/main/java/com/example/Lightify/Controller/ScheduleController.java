package com.example.Lightify.Controller;

import com.example.Lightify.DTO.ScheduleSetRequest;
import com.example.Lightify.Entity.ScheduleSetting;
import com.example.Lightify.Service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Exposes two endpoints:
 *   POST /api/rooms/{roomName}/scheduleSet?username={username}
 *     → Accepts the JSON schedule_set, saves it, and possibly queues it immediately.
 *
 *   GET /api/rooms/{roomName}/schedules?username={username}
 *     → Returns all stored schedules for that user+room.
 */
@RestController
@RequestMapping("/api/rooms")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * Example POST with body:
     * {
     *   "command": "schedule_set",
     *   "payload": {
     *     "room_name": "Bathroom",
     *     "date": "2025-06-05",
     *     "time": "14:30",
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
     * Called by front‐end (or Postman).  The service will:
     *   1) Save it to Mongo.
     *   2) If executionTime ∈ [now, top‐of‐next‐hour), queue it immediately.
     *   3) Otherwise wait for the next hourly scan.
     */
    @PostMapping("/{roomName}/scheduleSet")
    public ResponseEntity<?> createSchedule(
            @RequestParam String username,
            @PathVariable String roomName,
            @RequestBody ScheduleSetRequest request
    ) {
        try {
            // Validate the payload’s room_name matches the path variable:
            if (!roomName.equals(request.getPayload().getRoom_name())) {
                return ResponseEntity.badRequest()
                        .body("Path variable roomName must match payload.room_name");
            }
            scheduleService.saveScheduleSetting(username, request);
            return ResponseEntity.ok("Schedule saved for " + username + "/" + roomName);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Failed to save schedule: " + e.getMessage());
        }
    }

    /**
     * GET all stored schedules for a given user + room:
     *   GET /api/rooms/Bathroom/schedules?username=Tharindu
     */
    @GetMapping("/{roomName}/schedules")
    public ResponseEntity<?> getSchedules(
            @RequestParam String username,
            @PathVariable String roomName
    ) {
        List<ScheduleSetting> list = scheduleService.getSchedulesForRoom(username, roomName);
        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }
}
