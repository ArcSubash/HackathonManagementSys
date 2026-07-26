package com.hackathon.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoreRequest {

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Hackathon ID is required")
    private String hackathonId;

    @Min(value = 1, message = "Innovation score must be between 1 and 10")
    @Max(value = 10, message = "Innovation score must be between 1 and 10")
    private int innovation;

    @Min(value = 1, message = "Technical score must be between 1 and 10")
    @Max(value = 10, message = "Technical score must be between 1 and 10")
    private int technical;

    @Min(value = 1, message = "Presentation score must be between 1 and 10")
    @Max(value = 10, message = "Presentation score must be between 1 and 10")
    private int presentation;

    @Min(value = 1, message = "Problem solving score must be between 1 and 10")
    @Max(value = 10, message = "Problem solving score must be between 1 and 10")
    private int problemSolving;

    private String comments;
}
