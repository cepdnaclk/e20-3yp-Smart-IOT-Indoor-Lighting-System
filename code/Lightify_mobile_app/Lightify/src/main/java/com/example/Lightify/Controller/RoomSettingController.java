package com.example.Lightify.Controller;
import com.example.Lightify.DTO.AddDevicesRequest;
import com.example.Lightify.DTO.DeleteRoomRequest;
import com.example.Lightify.DTO.RenameRoomRequest;
import com.example.Lightify.DTO.RoomInfoDTO;
import com.example.Lightify.Entity.RoomSetting;
import com.example.Lightify.Service.RoomSettingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomSettingController {
    private static final Logger logger = LoggerFactory.getLogger(RoomSettingController.class);
    private final RoomSettingService roomSettingService;

    public RoomSettingController(RoomSettingService roomSettingService) {
        this.roomSettingService = roomSettingService;
    }

    @PostMapping("/devices")
    public ResponseEntity<?> addDevicesToRoom(@RequestBody AddDevicesRequest req) {
        try {
            RoomSetting created = roomSettingService.addDevicesToRoom(
                    req.getUsername(),
                    req.getRoomName(),
                    req.getAddedDevices());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.startsWith("Room already exists")) {
                // 409 Conflict is appropriate for duplicate creation
                return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
            }
            logger.error("Unexpected error in addDevicesToRoom", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listRooms(@RequestParam String username) {
        logger.info("[listRooms] for user='{}'", username);
        try {
            List<RoomInfoDTO> rooms = roomSettingService.getRoomsForUser(username);
            return ResponseEntity.ok(rooms);

        } catch (IllegalArgumentException e) {
            // missing or blank username
            logger.warn("[listRooms] bad request: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (RuntimeException e) {
            // user not found
            if ("User not found".equals(e.getMessage())) {
                logger.warn("[listRooms] user not found='{}'", username);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(e.getMessage());
            }
            // any other error
            logger.error("[listRooms] unexpected error for user='{}': {}", username, e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch rooms: " + e.getMessage());
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<?> renameRoom(@RequestBody RenameRoomRequest req) {
        logger.info("Renaming room='{}'→'{}' for user='{}'",
                req.getOldRoomName(), req.getNewRoomName(), req.getUsername());
        try {
            RoomSetting updated = roomSettingService.renameRoom(
                    req.getUsername(),
                    req.getOldRoomName(),
                    req.getNewRoomName()
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
            }
            logger.error("Error renaming room", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to rename room: " + msg);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteRoom(@RequestBody DeleteRoomRequest req) {
        logger.info("Deleting room='{}' for user='{}'",
                req.getRoomName(), req.getUsername());
        try {
            roomSettingService.deleteRoom(req.getUsername(), req.getRoomName());
            return ResponseEntity.ok("Room deleted successfully");
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
            }
            logger.error("Error deleting room", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete room: " + msg);
        }
    }

}
