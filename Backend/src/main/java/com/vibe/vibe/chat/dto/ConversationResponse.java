package com.vibe.vibe.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ConversationResponse {
    private Long conversationId;
    private Long otherUserId;
    private String otherUsername;
    private String otherProfilePicture;
    private String lastMessageContent;
    private Instant lastMessageSentAt;
    private long unreadCount;
}