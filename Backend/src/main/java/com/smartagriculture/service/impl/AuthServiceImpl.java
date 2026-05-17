package com.smartagriculture.service.impl;

import com.smartagriculture.dto.AuthResponse;
import com.smartagriculture.dto.LoginRequest;
import com.smartagriculture.dto.RegisterRequest;
import com.smartagriculture.entity.Role;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.BadRequestException;
import com.smartagriculture.exception.ConflictException;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.UserRepository;
import com.smartagriculture.security.ApplicationUserDetails;
import com.smartagriculture.security.JwtService;
import com.smartagriculture.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.security.jwt.expiration-ms}")
    private long expirationMs;

    @Value("${app.security.allow-only-farmer-self-registration:true}")
    private boolean allowOnlyFarmerSelfRegistration;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (allowOnlyFarmerSelfRegistration && request.getRole() != Role.FARMER) {
            throw new BadRequestException("Only FARMER self-registration is allowed");
        }
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("Email is already registered");
        }
        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phoneNumber(request.getPhoneNumber().trim())
                .enabled(true)
                .build();
        userRepository.save(user);
        UserDetails details = new ApplicationUserDetails(user);
        String token = jwtService.generateToken(details);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresInMs(expirationMs)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserDetails details = new ApplicationUserDetails(user);
        String token = jwtService.generateToken(details);
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresInMs(expirationMs)
                .build();
    }
}
