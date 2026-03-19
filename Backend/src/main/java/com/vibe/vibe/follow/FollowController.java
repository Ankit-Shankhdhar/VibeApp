package com.vibe.vibe.follow;

import com.vibe.vibe.follow.dto.FollowInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}")
    public void followUser(@PathVariable Long userId,
                           Authentication authentication) {

        followService.followUser(userId, authentication.getName());
    }

    @DeleteMapping("/{userId}")
    public void unfollowUser(@PathVariable Long userId,
                             Authentication authentication) {

        followService.unfollowUser(userId, authentication.getName());
    }

    @GetMapping("/{userId}")
    public FollowInfoDto getFollowInfo(@PathVariable Long userId,
                                       Authentication authentication) {

        return followService.getFollowInfo(userId, authentication.getName());
    }
}
