package com.vibe.vibe.follow;

import com.vibe.vibe.common.BaseEntity;
import com.vibe.vibe.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follows",
       uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
}
