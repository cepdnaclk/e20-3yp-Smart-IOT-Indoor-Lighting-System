package com.example.Lightify.DTO;

public class ActivatedModeInfoDTO {
    private final String username;
    private final String roomName;
    private final String modeName;

    public ActivatedModeInfoDTO(String username, String roomName, String modeName) {
        this.username = username;
        this.roomName = roomName;
        this.modeName = modeName;
    }

    public String getUsername()   { return username; }
    public String getRoomName()   { return roomName; }
    public String getModeName()   { return modeName; }
}
