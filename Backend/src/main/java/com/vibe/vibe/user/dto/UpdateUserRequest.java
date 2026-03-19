package com.vibe.vibe.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest { 

    @Size(max = 100)
    private String userName;

    @Size(max = 250)
    private String bio;

    private String profilePicture;
   }