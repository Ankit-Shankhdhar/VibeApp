package com.vibe.vibe.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    java.util.List<User> findByIdNot(Long id);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    

    
}
