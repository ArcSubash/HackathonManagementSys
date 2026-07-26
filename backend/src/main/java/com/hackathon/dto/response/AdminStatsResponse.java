package com.hackathon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {

    private long totalHackathons;
    private long totalParticipants;
    private long totalTeams;
    private long totalProjects;
    private long totalJudges;
    private long activeHackathons;
}
