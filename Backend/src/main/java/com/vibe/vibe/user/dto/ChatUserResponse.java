package com.vibe.vibe.user.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ChatUserResponse {
    Long id;
    String username;
    String profilePicture;
}
