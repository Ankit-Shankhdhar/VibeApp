package com.vibe.vibe.follow;

import com.vibe.vibe.follow.dto.FollowInfoDto;

public interface FollowService {

    void followUser(Long targetUserId, String currentUserEmail);

    void unfollowUser(Long targetUserId, String currentUserEmail);

    FollowInfoDto getFollowInfo(Long targetUserId, String currentUserEmail);
}
