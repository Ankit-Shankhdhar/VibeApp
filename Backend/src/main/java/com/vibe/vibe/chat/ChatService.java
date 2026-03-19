package com.vibe.vibe.chat;

import com.vibe.vibe.chat.dto.ConversationResponse;
import com.vibe.vibe.chat.dto.MessageResponse;
import com.vibe.vibe.chat.dto.SendMessageRequest;
import com.vibe.vibe.user.User;
import com.vibe.vibe.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public Conversation getOrCreateConversation(User currentUser, Long otherUserId) {
        if (currentUser.getId().equals(otherUserId)) {
            throw new IllegalArgumentException("Cannot create conversation with yourself");
        }
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return conversationRepository.findByUsers(currentUser, other)
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1(currentUser);
                    newConv.setUser2(other);
                    return conversationRepository.save(newConv);
                });
    }

   @Transactional
    public MessageResponse sendMessage(User sender, Long conversationId, SendMessageRequest request) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));
        
        // Security check to ensure sender belongs to the chat
        if (!conversation.getUser1().getId().equals(sender.getId()) &&
            !conversation.getUser2().getId().equals(sender.getId())) {
            throw new AccessDeniedException("You are not a participant of this conversation");
        }

        // Logic to identify the other person in the chat
        User receiver = conversation.getUser1().getId().equals(sender.getId()) 
                        ? conversation.getUser2() 
                        : conversation.getUser1();

        // Building the message with the required 'receiver' field
        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .receiver(receiver) // This fixes the PostgreSQL Not-Null constraint error
                .content(request.getContent())
                .isRead(false)
                .build();

        message = messageRepository.save(message);
        return mapToMessageResponse(message);
    }

    @Transactional(readOnly = true)
    public Page<ConversationResponse> getUserConversations(User currentUser, Pageable pageable) {
        Page<ConversationProjection> projections = conversationRepository
                .findUserConversations(currentUser.getId(), pageable);
        return projections.map(this::mapToConversationResponse);
    }

    @Transactional(readOnly = true)
    public Page<MessageResponse> getMessages(User currentUser, Long conversationId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not a participant of this conversation");
        }
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::mapToMessageResponse);
    }

    @Transactional
    public void markMessagesAsRead(User currentUser, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not a participant of this conversation");
        }
        messageRepository.markMessagesAsRead(conversationId, currentUser.getId());
    }

    @Transactional(readOnly = true)
    public long getTotalUnreadCount(User currentUser) {
        Page<ConversationProjection> page = conversationRepository
                .findUserConversations(currentUser.getId(), Pageable.unpaged());
        return page.stream().mapToLong(ConversationProjection::getUnreadCount).sum();
    }

    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .senderUsername(message.getSender().getUsername())
                .content(message.getContent())
                // FIX APPLIED HERE: Using systemDefault() instead of UTC
                .sentAt(message.getCreatedAt() != null ? message.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant() : null)
                .isRead(message.isRead())
                .build();
    }

    private ConversationResponse mapToConversationResponse(ConversationProjection proj) {
        return ConversationResponse.builder()
                .conversationId(proj.getId())
                .otherUserId(proj.getOtherUserId())
                .otherUsername(proj.getOtherUsername())
                .otherProfilePicture(proj.getOtherProfilePicture())
                .lastMessageContent(proj.getLastMessageContent())
                // Assuming proj.getLastMessageSentAt() returns an Instant now based on your comment
                .lastMessageSentAt(proj.getLastMessageSentAt())
                .unreadCount(proj.getUnreadCount())
                .build();
    }
}