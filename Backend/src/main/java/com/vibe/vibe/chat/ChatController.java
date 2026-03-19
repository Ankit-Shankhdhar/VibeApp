package com.vibe.vibe.chat;

import com.vibe.vibe.chat.dto.ConversationResponse;
import com.vibe.vibe.chat.dto.MessageResponse;
import com.vibe.vibe.chat.dto.SendMessageRequest;
import com.vibe.vibe.user.User;
import com.vibe.vibe.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> getOrCreateConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long otherUserId) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Conversation conversation = chatService.getOrCreateConversation(currentUser, otherUserId);
        ConversationResponse response = ConversationResponse.builder()
                .conversationId(conversation.getId())
                .otherUserId(otherUserId)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<ConversationResponse>> getUserConversations(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "lastMessageSentAt", direction = Sort.Direction.DESC) Pageable pageable) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getUserConversations(currentUser, pageable));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId,
            // THE FIX: Changed 'sentAt' to 'createdAt' so the database doesn't crash!
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getMessages(currentUser, conversationId, pageable));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId,
            @Valid @RequestBody SendMessageRequest request) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MessageResponse response = chatService.sendMessage(currentUser, conversationId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long conversationId) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        chatService.markMessagesAsRead(currentUser, conversationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getTotalUnreadCount(currentUser));
    }
}