package com.hackathon.service;

import com.hackathon.dto.request.LoginRequest;
import com.hackathon.dto.request.RegisterRequest;
import com.hackathon.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    com.hackathon.model.User getCurrentUser(String token);

    AuthResponse updateProfile(String userId, com.hackathon.dto.request.UpdateProfileRequest request);
}
