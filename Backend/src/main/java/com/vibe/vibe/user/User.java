package com.vibe.vibe.user;

import com.vibe.vibe.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 500)
    private String bio;

    private String profileImage;

    @Column(length = 500)
    private String profilePicture;

    // ==========================================
    // FOLLOWERS & FOLLOWING RELATIONSHIP
    // ==========================================

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_followers", // Creates a join table in the DB
            joinColumns = @JoinColumn(name = "follower_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @Builder.Default
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<User> followers = new HashSet<>();

    // --- Helper Methods ---
    // Always use these methods to keep both sides of the relationship in sync!

    public void follow(User targetUser) {
        this.following.add(targetUser);
        targetUser.getFollowers().add(this);
    }

    public void unfollow(User targetUser) {
        this.following.remove(targetUser);
        targetUser.getFollowers().remove(this);
    }
}   