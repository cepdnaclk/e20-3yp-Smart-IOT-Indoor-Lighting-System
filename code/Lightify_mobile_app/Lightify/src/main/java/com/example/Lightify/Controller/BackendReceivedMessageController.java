package com.example.Lightify.Controller;

import com.example.Lightify.Entity.RoomState;
import com.example.Lightify.Entity.WebsocketIp;
import com.example.Lightify.Service.BackendMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/backend")
public class BackendReceivedMessageController {

    private final BackendMessageService backendMessageService;

    public BackendReceivedMessageController(BackendMessageService backendMessageService) {
        this.backendMessageService = backendMessageService;
    }

    /**
     * GET /api/backend/roomState?username={username}&roomName={roomName}
     *
     * Returns the latest RoomState (list of bulbs & brightness) for the given user and room.
     */
    @GetMapping("/roomState")
    public ResponseEntity<?> getRoomState(
            @RequestParam String username,
            @RequestParam String roomName
    ) {
        Optional<RoomState> maybeState = backendMessageService.getRoomState(username, roomName);
        if (maybeState.isPresent()) {
            return ResponseEntity.ok(maybeState.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No room_state found for username='" + username + "', roomName='" + roomName + "'");
        }
    }

    /**
     * GET /api/backend/websocketIp?username={username}&roomName={roomName}
     *
     * Returns the latest WebsocketIp (IP address) for the given user and room.
     */
    @GetMapping("/websocketIp")
    public ResponseEntity<?> getWebsocketIp(
            @RequestParam String username,
            @RequestParam String roomName
    ) {
        Optional<WebsocketIp> maybeIp = backendMessageService.getWebsocketIp(username, roomName);
        if (maybeIp.isPresent()) {
            return ResponseEntity.ok(maybeIp.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No websocket_ip found for username='" + username + "', roomName='" + roomName + "'");
        }
    }

    @GetMapping("/allRoomStates")
    public ResponseEntity<?> getAllRoomStates() {
        List<RoomState> all = backendMessageService.getAllRoomStates();
        // (You may need to add getAllRoomStates() to your service, which just calls roomStateRepository.findAll())
        return ResponseEntity.ok(all);
    }

    @PostMapping("/requestRoomState")
    public ResponseEntity<String> requestRoomState(
            @RequestParam String username,
            @RequestParam String roomName
    ) {
        try {
            backendMessageService.requestRoomState(username, roomName);
            return ResponseEntity.ok("room_state request published to MQTT");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to publish room_state request: " + e.getMessage());
        }
    }
}
