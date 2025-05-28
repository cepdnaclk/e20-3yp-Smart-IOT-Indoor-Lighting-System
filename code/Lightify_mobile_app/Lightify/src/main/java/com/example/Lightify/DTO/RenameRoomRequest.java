package com.example.Lightify.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RenameRoomRequest {
    private String username;
    private String oldRoomName;
    private String newRoomName;
}