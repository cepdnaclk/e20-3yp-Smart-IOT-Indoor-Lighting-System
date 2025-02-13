package com.example.Lightify.DTO;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {
    private String username;
    private String email;
    private String password;
}
