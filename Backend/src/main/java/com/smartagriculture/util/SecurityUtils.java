package com.smartagriculture.util;

import com.smartagriculture.entity.User;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.UserRepository;
import com.smartagriculture.security.ApplicationUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof ApplicationUserDetails details)) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }
        Long id = details.getUser().getId();
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
