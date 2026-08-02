package com.hackathon.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
