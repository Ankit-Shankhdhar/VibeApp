package com.vibe.vibe.chat;

import com.vibe.vibe.common.BaseEntity;
import com.vibe.vibe.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "conversations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user1_id", "user2_id"}))
@Getter @Setter
@NoArgsConstructor
public class Conversation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @PrePersist
    @PreUpdate
    private void enforceUserOrder() {
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }
    }
}