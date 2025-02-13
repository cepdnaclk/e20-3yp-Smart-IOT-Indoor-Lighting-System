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

    public boolean authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
    }
}
