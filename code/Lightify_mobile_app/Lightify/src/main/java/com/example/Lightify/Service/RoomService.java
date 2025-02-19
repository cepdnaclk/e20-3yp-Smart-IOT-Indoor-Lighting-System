package com.example.Lightify.Service;

import com.example.Lightify.Entity.Room;
import com.example.Lightify.Entity.Schedule;
import com.example.Lightify.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    public Room getRoomByNumber(String roomName) {
        return roomRepository.findByRoom(roomName);
    }

    public Room addScheduleToRoom(String roomName, Room updatedRoom) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            existingRoom.setSchedule(updatedRoom.getSchedule());
            return roomRepository.save(existingRoom);
        }
        return null;
    }

    public Room updateSchedule(String roomName, Schedule updatedSchedule, int index) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            if (index >= 0 && index < schedules.size()) {
                schedules.set(index, updatedSchedule);
                existingRoom.setSchedule(schedules);
                return roomRepository.save(existingRoom);
            }
        }
        return null;
    }

    public Room deleteSchedule(String roomName, int index) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            if (index >= 0 && index < schedules.size()) {
                schedules.remove(index);
                existingRoom.setSchedule(schedules);
                return roomRepository.save(existingRoom);
            }
        }
        return null;
    }

    public Room updateRoomName(String roomName, String newroomName) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            existingRoom.setRoom(newroomName);
            return roomRepository.save(existingRoom);
        }
        return null;
    }

    public boolean deleteRoom(String roomName) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            roomRepository.delete(existingRoom);
            return true;
        }
        return false;
    }
}

