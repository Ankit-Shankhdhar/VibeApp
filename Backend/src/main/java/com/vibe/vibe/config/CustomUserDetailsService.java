package com.vibe.vibe.config;

import com.vibe.vibe.user.User;
import com.vibe.vibe.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor

public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{

        User user = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("Username not found!"));

        return new org.springframework.security.core.userdetails.User(

        user.getEmail(),
        user.getPassword(),
        Collections.emptyList()
        );
    }


}
