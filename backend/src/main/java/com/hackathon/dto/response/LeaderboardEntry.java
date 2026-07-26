package com.hackathon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {

    private String projectId;
    private String projectTitle;
    private String teamId;
    private String teamName;
    private double averageScore;
    private int totalReviews;
    private int rank;
}
