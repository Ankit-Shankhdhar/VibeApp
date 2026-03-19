package com.vibe.vibe.chat;

import com.vibe.vibe.common.BaseEntity;
import com.vibe.vibe.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "messages",
       indexes = {
           @Index(name = "idx_message_conversation_sent", columnList = "conversation_id, created_at"),
           @Index(name = "idx_message_conversation_read_sender", columnList = "conversation_id, is_read, sender_id")
       })
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, length = 5000)
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;
}