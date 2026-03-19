package com.vibe.vibe.user;

import com.vibe.vibe.user.dto.ChatUserResponse;
import com.vibe.vibe.user.dto.UserResponse;
import com.vibe.vibe.user.dto.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {


    @Transactional
    public void followUser(Long targetUserId) {
        // 1. Get the currently logged-in user
        User currentUser = getCurrentUser(); 

        // 2. Prevent the user from following themselves
        if (currentUser.getId().equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot follow yourself!");
        }

        // 3. Find the user they are trying to follow
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + targetUserId));

        // 4. Add the relationship and save
        currentUser.follow(targetUser);
        userRepository.save(currentUser);
    }

    @Transactional
    public void unfollowUser(Long targetUserId) {
        // 1. Get the currently logged-in user
        User currentUser = getCurrentUser();

        // 2. Find the user they are trying to unfollow
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + targetUserId));

        // 3. Remove the relationship and save
        currentUser.unfollow(targetUser);
        userRepository.save(currentUser);
    }
    // Add this inside UserService.java
    public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
}

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<ChatUserResponse> getAvailableChatUsers() {
        User currentUser = getCurrentUser();
        return userRepository.findByIdNot(currentUser.getId())
                .stream()
                .map(user -> ChatUserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .profilePicture(user.getProfilePicture())
                        .build())
                .toList();
    }

    private final UserRepository userRepository;

  
    public User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    
    @Transactional
    public UserResponse updateProfile(String email, UpdateUserRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUserName() != null) {
            user.setUsername(request.getUserName());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        return mapToResponse(user);
    }

    
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .build();
    }
}