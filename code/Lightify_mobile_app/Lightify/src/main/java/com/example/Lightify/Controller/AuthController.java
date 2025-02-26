package com.example.Lightify.Controller;

import com.example.Lightify.DTO.UserDTO;
import com.example.Lightify.Service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        logger.info("Received registration request for user: {}", userDTO.getUsername());
        try {
            String response = authService.registerUser(userDTO);
            logger.info("User registration successful for: {}", userDTO.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error during user registration for {}: {}", userDTO.getUsername(), e.getMessage());
            return ResponseEntity.status(500).body("Registration failed");
        }
    }

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
//        logger.info("Received login request for email: {}", userDTO.getEmail());
//        try {
//            boolean isAuthenticated = authService.authenticateUser(userDTO.getEmail(), userDTO.getPassword());
//            if (isAuthenticated) {
//                logger.info("User login successful for email: {}", userDTO.getEmail());
//                return ResponseEntity.ok("Login successful");
//            } else {
//                logger.warn("Invalid login attempt for email: {}", userDTO.getEmail());
//                return ResponseEntity.status(401).body("Invalid credentials");
//            }
//        } catch (Exception e) {
//            logger.error("Error during login for email {}: {}", userDTO.getEmail(), e.getMessage());
//            return ResponseEntity.status(500).body("Login failed");
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        logger.info("Received login request for: {}", userDTO.getEmail() != null ? userDTO.getEmail() : userDTO.getUsername());
        try {
            boolean isAuthenticated = authService.authenticateUser(userDTO.getEmail(), userDTO.getUsername(), userDTO.getPassword());
            if (isAuthenticated) {
                logger.info("User login successful for: {}", userDTO.getEmail() != null ? userDTO.getEmail() : userDTO.getUsername());
                return ResponseEntity.ok("Login successful");
            } else {
                logger.warn("Invalid login attempt for: {}", userDTO.getEmail() != null ? userDTO.getEmail() : userDTO.getUsername());
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        } catch (Exception e) {
            logger.error("Error during login for {}: {}", userDTO.getEmail() != null ? userDTO.getEmail() : userDTO.getUsername(), e.getMessage());
            return ResponseEntity.status(500).body("Login failed");
        }
    }

}
