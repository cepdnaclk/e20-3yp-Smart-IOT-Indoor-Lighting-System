package com.example.Lightify.graphql;

import com.example.Lightify.DTO.UserDTO;
import com.example.Lightify.Entity.User;
import com.example.Lightify.Service.AuthService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class UserResolver {

    private final AuthService authService;

    public UserResolver(AuthService authService) {
        this.authService = authService;
    }

    @QueryMapping
    public User getUser(@Argument String email) {
        return authService.getUserByEmail(email);
    }

    @MutationMapping
    public String registerUser(@Argument UserDTO input) {
        return authService.registerUser(input);
    }

    @MutationMapping
    public String loginUser(@Argument UserDTO input) {
        boolean authenticated = authService.authenticateUser(input.getEmail(), input.getPassword());
        return authenticated ? "Login successful" : "Invalid credentials";
    }
}
