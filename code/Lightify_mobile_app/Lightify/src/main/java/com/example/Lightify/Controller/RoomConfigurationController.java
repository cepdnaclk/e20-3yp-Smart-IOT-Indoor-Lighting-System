package com.example.Lightify.Controller;

import com.example.Lightify.DTO.RoomConfigurationRequest;
import com.example.Lightify.Service.RoomConfigurationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomConfigurationController {
    private static final Logger logger = LoggerFactory.getLogger(RoomConfigurationController.class);

    private final RoomConfigurationService configService;

    public RoomConfigurationController(RoomConfigurationService configService) {
        this.configService = configService;
    }

    /**
     * Endpoint to receive full room configuration. Can be tested via Postman:
     * POST /api/rooms/configure
     * Body: RoomConfigurationRequest JSON
     */
    @PostMapping("/configure")
    public ResponseEntity<String> configureRoom(@RequestBody RoomConfigurationRequest request) {
        logger.info("Received room configuration request: {}", request);
        try {
            configService.configureRoom(request);
            return ResponseEntity.ok("Configuration applied successfully");
        } catch (Exception e) {
            logger.error("Error applying configuration for user='{}', room='{}': {}",
                    request.getUsername(), request.getRoomName(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Configuration failed: " + e.getMessage());
        }
    }

    /**
     * Endpoint to fetch the full saved room configuration.
     * GET /api/rooms/configure?username=...&roomName=...
     */
    @GetMapping("/configure")
    public ResponseEntity<?> getConfiguration(@RequestParam String username,
                                              @RequestParam String roomName) {
        logger.info("Received get configuration request for user='{}', room='{}'", username, roomName);
        try {
            RoomConfigurationRequest config = configService.getRoomConfiguration(username, roomName);
            return ResponseEntity.ok(config);
        } catch (Exception e) {
            logger.error("Error fetching configuration for user='{}', room='{}': {}",
                    username, roomName, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch configuration: " + e.getMessage());
        }
    }
}
