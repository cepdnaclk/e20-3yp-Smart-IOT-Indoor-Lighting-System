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

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room createdRoom = roomService.createRoom(room);
        return ResponseEntity.ok(createdRoom);
    }

    // TODO : Get mapping for all rooms

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable String id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
//TODO : create a method to take all rooms ( it should bring only the room name and the id)

    @GetMapping("/room-number/{roomName}")
    public ResponseEntity<Room> getRoomByName(@PathVariable String roomName) {
        Room room = roomService.getRoomByNumber(roomName);
        return room != null ? ResponseEntity.ok(room) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{roomName}/schedules")
    public ResponseEntity<Room> addSchedule(@PathVariable String ro
                                            omName, @RequestBody Schedule schedule) {
        Room updated = roomService.addScheduleToRoom(roomName, schedule);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{roomName}/schedules/{index}")
    public ResponseEntity<Room> updateSchedule(@PathVariable String roomName, @PathVariable int index, @RequestBody Schedule updatedSchedule) {
        Room updated = roomService.updateSchedule(roomName, updatedSchedule, index);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{roomName}/schedules/{index}")
    public ResponseEntity<Room> deleteSchedule(@PathVariable String roomName, @PathVariable int index) {
        Room updated = roomService.deleteSchedule(roomName, index);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{roomName}/update-room")
    public ResponseEntity<Room> updateRoomName(@PathVariable String roomName, @RequestParam String newroomName) {
        Room updatedRoom = roomService.updateRoomName(roomName, newroomName);
        return updatedRoom != null ? ResponseEntity.ok(updatedRoom) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{roomName}")
    public ResponseEntity<String> deleteRoom(@PathVariable String roomName) {
        boolean deleted = roomService.deleteRoom(roomName);
        return deleted ? ResponseEntity.ok("Room deleted successfully") : ResponseEntity.notFound().build();
    }
}

