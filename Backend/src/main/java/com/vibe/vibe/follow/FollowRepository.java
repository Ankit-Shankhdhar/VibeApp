package com.vibe.vibe.follow;

import com.vibe.vibe.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollower(User follower);

    List<Follow> findByFollowing(User following);

    boolean existsByFollowerAndFollowing(User follower, User following);
    
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    long countByFollowing(User following);

    long countByFollower(User follower);

    void deleteByFollowerAndFollowing(User follower, User following);
}
