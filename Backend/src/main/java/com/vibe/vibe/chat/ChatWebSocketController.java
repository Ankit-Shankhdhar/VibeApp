package com.vibe.vibe.chat;

import com.vibe.vibe.chat.dto.MessageResponse;
import com.vibe.vibe.chat.dto.SendMessageRequest;
import com.vibe.vibe.user.User;
import com.vibe.vibe.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService; // Changed from MessageService to ChatService
    private final UserService userService;

    @MessageMapping("/chat/{conversationId}")
    public void processMessage(
            @DestinationVariable Long conversationId,
            @Payload SendMessageRequest request,
            Principal principal) {

        log.info("Socket message received: conversationId={}, senderEmail={}, content={}",
                conversationId, principal.getName(), request.getContent());
        
        // principal.getName() gets the email from your JWT
        User sender = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use your existing service logic to save the message
        MessageResponse savedMessage = chatService.sendMessage(sender, conversationId, request);

        User receiver = userService.findById(savedMessage.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Send to the specific user's private queue
        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/messages", 
                savedMessage
        );

        log.info("Socket message delivered: conversationId={}, receiverId={}, messageId={}",
                savedMessage.getConversationId(), savedMessage.getReceiverId(), savedMessage.getId());
    }
}