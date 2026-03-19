package com.vibe.vibe.follow;

import com.vibe.vibe.follow.dto.FollowInfoDto;
import com.vibe.vibe.user.User;
import com.vibe.vibe.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor

public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
    public void followUser(Long targetUserId, String currentUserEmail){

        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->
         new EntityNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId).orElseThrow(() ->
         new EntityNotFoundException("Target user not found"));

         if(followRepository.existsByFollowerAndFollowing(currentUser, targetUser)){
            return ;
         }

         Follow follow = Follow.builder()
                 .follower(currentUser)
                 .following(targetUser)
                 .build();

            followRepository.save(follow);
    }

    @Override
    @Transactional
    public void unfollowUser(Long targetUserId, String currentUserEmail) {  

        User currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->
         new EntityNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId).orElseThrow(() ->
         new EntityNotFoundException("Target user not found"));

         if(!followRepository.existsByFollowerAndFollowing(currentUser, targetUser)){
            return ;
         }

         followRepository.deleteByFollowerAndFollowing(currentUser, targetUser);
    }


    @Override
    @Transactional(readOnly = true)

     public FollowInfoDto getFollowInfo(Long targetUserId, String currentUserEmail) {

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("Target user not found"));

        long followersCount = followRepository.countByFollowing(targetUser);
        long followingCount = followRepository.countByFollower(targetUser);

        boolean isFollowing =
                followRepository.existsByFollowerAndFollowing(currentUser, targetUser);

        return FollowInfoDto.builder()
                .userId(targetUser.getId())
                .followersCount(followersCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .build();
    }

}

