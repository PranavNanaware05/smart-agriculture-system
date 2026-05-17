package com.smartagriculture.dto;

import com.smartagriculture.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {

    @NotBlank
    @Size(max = 160)
    private String fullName;

    @NotBlank
    @Email
    @Size(max = 120)
    private String email;

    @NotBlank
    @Size(min = 8, max = 128)
    private String password;

    @NotBlank
    @Pattern(regexp = "^[+]?[0-9\\s\\-]{10,20}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotNull
    private Role role;
}
