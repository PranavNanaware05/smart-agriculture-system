package com.smartagriculture.dto;

import com.smartagriculture.entity.Role;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponse {
    Long id;
    String fullName;
    String email;
    Role role;
    String phoneNumber;
    boolean enabled;
    Instant createdAt;
}
