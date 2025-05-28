package com.example.Lightify.Controller;

import com.example.Lightify.Entity.Device;
import com.example.Lightify.Service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device) {
        Device saved = deviceService.addDevice(device);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getDevices(@RequestParam String username) {
        List<Device> list = deviceService.getDevicesByUsername(username);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String id) {
        deviceService.deleteDeviceById(id);
        return ResponseEntity.ok().build();
    }
}