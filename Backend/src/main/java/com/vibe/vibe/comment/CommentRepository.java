package com.vibe.vibe.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.vibe.vibe.post.Post;

public interface CommentRepository extends JpaRepository<Comment,Long>{
    List<Comment> findByPost(Post post);
    
}
