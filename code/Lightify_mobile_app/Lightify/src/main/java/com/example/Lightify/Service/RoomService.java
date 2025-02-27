//package com.example.Lightify.Service;
//
//import com.example.Lightify.Entity.Room;
//import com.example.Lightify.Entity.Schedule;
//import com.example.Lightify.Repository.RoomRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class RoomService {
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//    public Room createRoom(Room room) {
//        return roomRepository.save(room);
//    }
//
//    public Optional<Room> getRoomById(String id) {
//        return roomRepository.findById(id);
//    }
//
//    public Room getRoomByNumber(String roomName) {
//        return roomRepository.findByRoom(roomName);
//    }
//
//    public Room addScheduleToRoom(String roomName, Room updatedRoom) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            existingRoom.setSchedule(updatedRoom.getSchedule());
//            return roomRepository.save(existingRoom);
//        }
//        return null;
//    }
//
//    public Room updateSchedule(String roomName, Schedule updatedSchedule, int index) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            List<Schedule> schedules = existingRoom.getSchedule();
//            if (index >= 0 && index < schedules.size()) {
//                schedules.set(index, updatedSchedule);
//                existingRoom.setSchedule(schedules);
//                return roomRepository.save(existingRoom);
//            }
//        }
//        return null;
//    }
//
//    public Room deleteSchedule(String roomName, int index) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            List<Schedule> schedules = existingRoom.getSchedule();
//            if (index >= 0 && index < schedules.size()) {
//                schedules.remove(index);
//                existingRoom.setSchedule(schedules);
//                return roomRepository.save(existingRoom);
//            }
//        }
//        return null;
//    }
//
//    public Room updateRoomName(String roomName, String newRoomName) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            existingRoom.setRoom(newRoomName);
//            return roomRepository.save(existingRoom);
//        }
//        return null;
//    }
//
//    public boolean deleteRoom(String roomName) {
//        Room existingRoom = roomRepository.findByRoom(roomName);
//        if (existingRoom != null) {
//            roomRepository.delete(existingRoom);
//            return true;
//        }
//        return false;
//    }
//}
//
package com.example.Lightify.Service;

import com.example.Lightify.Entity.Room;
import com.example.Lightify.Entity.Schedule;
import com.example.Lightify.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Iterator;

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

    public Room addScheduleToRoom(String roomName, Schedule schedule) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            List<Schedule> schedules = existingRoom.getSchedule();
            schedules.add(schedule);  // Add the new schedule to the list
            existingRoom.setSchedule(schedules);
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

    public Room updateRoomName(String roomName, String newRoomName) {
        Room existingRoom = roomRepository.findByRoom(roomName);
        if (existingRoom != null) {
            existingRoom.setRoom(newRoomName);
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

    // Remove expired schedules (run periodically)
    @Scheduled(cron = "0 0 * * * ?")  // Runs every hour, adjust as needed
    public void removeExpiredSchedules() {
        List<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            List<Schedule> schedules = room.getSchedule();
            // Check and remove expired schedules
            schedules.removeIf(Schedule::isExpired);  // Calls isExpired() method from Schedule
            room.setSchedule(schedules);
            roomRepository.save(room);  // Save the updated room with the remaining schedules
        }
    }

    // Execute schedules (run periodically or based on event triggers)
    @Scheduled(cron = "0 * * * * ?")  // Runs every minute, adjust as needed
    public void executeSchedules() {
        List<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            List<Schedule> schedules = room.getSchedule();
            for (Schedule schedule : schedules) {
                if (schedule.isDueNow()) {  // Check if the schedule time is now
                    executeScheduleAction(schedule);  // Execute the schedule action
                }
            }
        }
    }

    private void executeScheduleAction(Schedule schedule) {
        // Implement the logic to execute the schedule (e.g., turning on/off lights, sending a command)
        System.out.println("Executing schedule: " + schedule.getIntensityPercentage() + "% intensity, Color: " + schedule.getColor());
        // Additional logic for interacting with devices based on the schedule's action can go here.
    }
}
