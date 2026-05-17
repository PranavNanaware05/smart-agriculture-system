package com.smartagriculture.service.impl;

import com.smartagriculture.dto.UserResponse;
import com.smartagriculture.entity.User;
import com.smartagriculture.service.UserService;
import com.smartagriculture.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final SecurityUtils securityUtils;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        return toResponse(getCurrentUserEntity());
    }

    @Override
    @Transactional(readOnly = true)
    public User getCurrentUserEntity() {
        return securityUtils.currentUser();
    }

    private static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
