package com.hackathon.service.impl;

import com.hackathon.dto.request.LoginRequest;
import com.hackathon.dto.request.RegisterRequest;
import com.hackathon.dto.response.AuthResponse;
import com.hackathon.exception.BadRequestException;
import com.hackathon.model.Role;
import com.hackathon.model.User;
import com.hackathon.repository.UserRepository;
import com.hackathon.security.JwtUtil;
import com.hackathon.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // If this is the first user, make them an ADMIN. Otherwise, PARTICIPANT.
        Role assignedRole = userRepository.count() == 0 ? Role.ADMIN : Role.PARTICIPANT;

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .build();

        user = userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .assignedHackathons(user.getAssignedHackathons())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        System.out.println("Login attempt for email: " + request.getEmail());
        try {
            // Authenticate credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("Authentication successful for: " + request.getEmail());
        } catch (org.springframework.security.core.AuthenticationException e) {
            System.out.println("Authentication failed for " + request.getEmail() + ": " + e.getMessage());
            throw new BadCredentialsException("Invalid email or password");
        }

        // Fetch user and generate token
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .assignedHackathons(user.getAssignedHackathons())
                .build();
    }

    @Override
    public User getCurrentUser(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadRequestException("Invalid token format");
        }
        String jwt = token.replace("Bearer ", "");
        String userId = jwtUtil.extractClaim(jwt, claims -> claims.get("userId", String.class));
        return userRepository.findById(userId)
                .orElseThrow(() -> new com.hackathon.exception.ResourceNotFoundException("User", "id", userId));
    }

    @Override
    public AuthResponse updateProfile(String userId, com.hackathon.dto.request.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.hackathon.exception.ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .assignedHackathons(user.getAssignedHackathons())
                .build();
    }
}
