package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.UserResponse;
import com.smartagriculture.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_V1 + "/users")
@Tag(name = "Users")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Current authenticated user profile")
    public ResponseEntity<UserResponse> currentUser() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }
}
