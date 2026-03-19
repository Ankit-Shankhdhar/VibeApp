package com.vibe.vibe.user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String profileImage;
}


