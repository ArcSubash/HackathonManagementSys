package com.hackathon.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignJudgeRequest {

    @NotBlank(message = "Judge ID is required")
    private String judgeId;

    @NotBlank(message = "Hackathon ID is required")
    private String hackathonId;
}
