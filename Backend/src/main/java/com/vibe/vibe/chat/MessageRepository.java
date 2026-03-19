package com.vibe.vibe.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.vibe.vibe.user.User;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);

    Long countByConversationAndSenderNotAndIsReadFalse(Conversation conversation, User recipient);

    @Modifying
    @Transactional
    @Query("""
        UPDATE Message m
        SET m.isRead = true
        WHERE m.conversation.id = :conversationId
          AND m.sender.id != :recipientId
          AND m.isRead = false
    """)
    int markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("recipientId") Long recipientId);

    // Optional: keep a legacy method if needed during migration
    // List<Message> findBySenderAndReceiver(User sender, User receiver);
}