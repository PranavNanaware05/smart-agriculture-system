package com.smartagriculture.service;

import com.smartagriculture.dto.AuthResponse;
import com.smartagriculture.dto.LoginRequest;
import com.smartagriculture.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
