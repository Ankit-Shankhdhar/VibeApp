package com.vibe.vibe.user;

import com.vibe.vibe.user.dto.ChatUserResponse;
import com.vibe.vibe.user.dto.UserProfileResponse;
import com.vibe.vibe.user.dto.UpdateUserRequest;
import com.vibe.vibe.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getCurrentUserProfile() {

        User user = userService.getCurrentUser();

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
                .build();
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid UpdateUserRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(userDetails.getUsername(), request)
        );
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id) {
        // Assuming your UserService has a method for this
        // You might need to pass the currently logged-in user's email/id too
        userService.followUser(id); 
        return ResponseEntity.ok().body("Successfully followed user " + id);
    }

    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long id) {
        // Assuming your UserService has a method for this
        userService.unfollowUser(id);
        return ResponseEntity.ok().body("Successfully unfollowed user " + id);
    }

    @GetMapping("/chat-available")
    public ResponseEntity<List<ChatUserResponse>> getAvailableChatUsers() {
        return ResponseEntity.ok(userService.getAvailableChatUsers());
    }
}
