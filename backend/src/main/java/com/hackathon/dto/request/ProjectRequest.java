package com.hackathon.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String githubLink;

    private String demoVideo;

    @NotBlank(message = "Team ID is required")
    private String teamId;

    @NotBlank(message = "Hackathon ID is required")
    private String hackathonId;
}
