package com.example.Lightify.Controller;

import com.example.Lightify.Entity.Room;
import com.example.Lightify.Entity.Schedule;
import com.example.Lightify.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /** Create **/
    @PostMapping
    public ResponseEntity<?> createRoom(
            @RequestParam String username,
            @RequestParam String roomName) {
        try {
            Room created = roomService.createRoom(username, roomName);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/room/{roomName}")
    public ResponseEntity<?> getRoom(
            @RequestParam String username,
            @RequestParam String roomName) {
        Optional<Room> room = roomService.getRoom(username, roomName);
        return room
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // TODO : Get mapping for all rooms

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
//TODO : create a method to take all rooms ( it should bring only the room name and the id)


    /** Add Schedule **/
    @PutMapping("/{roomName}/schedules")
    public ResponseEntity<?> addSchedule(
            @RequestParam String username,
            @PathVariable String roomName,
            @RequestBody Schedule schedule) {
        try {
            Room updated = roomService.addScheduleToRoom(username, roomName, schedule);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Update Schedule **/
    @PutMapping("/{roomName}/schedules/{index}")
    public ResponseEntity<?> updateSchedule(
            @RequestParam String username,
            @PathVariable String roomName,
            @PathVariable int index,
            @RequestBody Schedule schedule) {
        try {
            Room updated = roomService.updateSchedule(username, roomName, schedule, index);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Delete Schedule **/
    @DeleteMapping("/{roomName}/schedules/{index}")
    public ResponseEntity<?> deleteSchedule(
            @RequestParam String username,
            @PathVariable String roomName,
            @PathVariable int index) {
        try {
            Room updated = roomService.deleteSchedule(username, roomName, index);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Delete Room **/
    @DeleteMapping("/{roomName}")
    public ResponseEntity<?> deleteRoom(
            @RequestParam String username,
            @PathVariable String roomName) {
        try {
            roomService.deleteRoom(username, roomName);
            return ResponseEntity.ok("Room deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
