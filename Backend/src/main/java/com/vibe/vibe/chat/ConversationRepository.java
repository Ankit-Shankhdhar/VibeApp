package com.vibe.vibe.chat;

import com.vibe.vibe.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
        SELECT c FROM Conversation c
        WHERE (c.user1 = :userA AND c.user2 = :userB)
           OR (c.user1 = :userB AND c.user2 = :userA)
    """)
    Optional<Conversation> findByUsers(@Param("userA") User userA, @Param("userB") User userB);

    @Query(value = """
        SELECT
            c.id AS id,
            CASE WHEN c.user1_id = :userId THEN c.user2_id ELSE c.user1_id END AS otherUserId,
            u.username AS otherUsername,
            u.profile_picture AS otherProfilePicture,
            m.content AS lastMessageContent,
            m.created_at AS lastMessageSentAt,
            COALESCE((
                SELECT COUNT(*)
                FROM messages msg
                WHERE msg.conversation_id = c.id
                  AND msg.sender_id != :userId
                  AND msg.is_read = false
            ), 0) AS unreadCount
        FROM conversations c
        JOIN users u ON u.id = CASE WHEN c.user1_id = :userId THEN c.user2_id ELSE c.user1_id END
        LEFT JOIN LATERAL (
            SELECT content, created_at
            FROM messages
            WHERE conversation_id = c.id
            ORDER BY created_at DESC
            LIMIT 1
        ) m ON true
        WHERE c.user1_id = :userId OR c.user2_id = :userId
        ORDER BY m.created_at DESC NULLS LAST
        """,
        countQuery = """
            SELECT COUNT(*)
            FROM conversations
            WHERE user1_id = :userId OR user2_id = :userId
            """,
        nativeQuery = true)
    Page<ConversationProjection> findUserConversations(@Param("userId") Long userId, Pageable pageable);
}