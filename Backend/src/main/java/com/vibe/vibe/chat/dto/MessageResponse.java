package com.vibe.vibe.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private Long receiverId;
    private String senderUsername;
    private String content;
    private Instant sentAt;
    private boolean isRead;
}