package com.vibe.vibe.chat;

import java.time.Instant;

public interface ConversationProjection {
    Long getId();
    Long getOtherUserId();
    String getOtherUsername();
    String getOtherProfilePicture();
    String getLastMessageContent();
    Instant getLastMessageSentAt();
    Long getUnreadCount();
}