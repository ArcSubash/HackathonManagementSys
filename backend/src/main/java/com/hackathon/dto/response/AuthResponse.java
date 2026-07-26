package com.hackathon.dto.response;

import com.hackathon.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String id;
    private String name;
    private String email;
    private Role role;
    private java.util.List<String> assignedHackathons;
}
