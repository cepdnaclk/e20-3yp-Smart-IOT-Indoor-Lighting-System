package com.example.Lightify.Service;

import com.example.Lightify.DTO.UserDTO;
import com.example.Lightify.Entity.User;
import com.example.Lightify.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String registerUser(UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            return "User already exists";
        }
        User newUser = new User(null, userDTO.getUsername(), userDTO.getEmail(), passwordEncoder.encode(userDTO.getPassword()));
        userRepository.save(newUser);
        return "User registered successfully";
    }

//    public boolean authenticateUser(String email, String password) {
//        Optional<User> user = userRepository.findByEmail(email);
//        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
//    }

    public boolean authenticateUser(String email, String username, String password) {
        Optional<User> userOptional;

        if (email != null && !email.isEmpty()) {
            userOptional = userRepository.findByEmail(email);
        } else if (username != null && !username.isEmpty()) {
            userOptional = userRepository.findByUsername(username);
        } else {
            return false; // If both are null, return false
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(password, user.getPassword());
        }

        return false;
    }
}
