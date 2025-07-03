package com.example.Lightify.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomWishlistDTO {
    private String id;
    private String roomName;
    private boolean isWishlist;
}