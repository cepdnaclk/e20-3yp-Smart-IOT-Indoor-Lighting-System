package com.example.Lightify.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DeleteRoomRequest {
    private String username;
    private String roomName;
}
