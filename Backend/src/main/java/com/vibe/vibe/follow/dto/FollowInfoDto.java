package com.vibe.vibe.follow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FollowInfoDto {

    private Long userId;
    private long followersCount;
    private long followingCount;
    private boolean isFollowing;
}
