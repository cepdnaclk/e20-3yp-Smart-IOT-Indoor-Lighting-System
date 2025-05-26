package com.example.Lightify.Controller;

import com.example.Lightify.Service.DeviceInstructionsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/device")
public class DeviceInstructionsController {

    private final DeviceInstructionsService instructionsSvc;

    public DeviceInstructionsController(DeviceInstructionsService instructionsSvc) {
        this.instructionsSvc = instructionsSvc;
    }

    @PostMapping("/instructions")
    public ResponseEntity<?> sendInstructions(
            @RequestParam("topic") String topic,      // topic as query param
            @RequestBody String instructionsJson
    ) {
        try {
            Map<String,String> result = instructionsSvc.sendTransactional(instructionsJson, topic);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error",   "Failed to send instructions",
                            "details", e.getMessage()
                    ));
        }
    }
}
