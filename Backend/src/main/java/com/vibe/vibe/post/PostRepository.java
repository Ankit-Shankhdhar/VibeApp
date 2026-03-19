package com.vibe.vibe.post;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.vibe.vibe.user.User;

public interface PostRepository extends JpaRepository<Post,Long>{
    List<Post> findByUser(User user);
}
