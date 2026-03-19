package com.vibe.vibe.like;

import com.vibe.vibe.post.Post;
import com.vibe.vibe.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndPost(User user, Post post);

    long countByPost(Post post);
}
