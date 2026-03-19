package com.vibe.vibe.like;

import com.vibe.vibe.common.BaseEntity;
import com.vibe.vibe.post.Post;
import com.vibe.vibe.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "likes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
