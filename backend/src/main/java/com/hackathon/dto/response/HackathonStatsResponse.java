package com.hackathon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HackathonStatsResponse {
    private long totalTeams;
    private long totalParticipants;
}
