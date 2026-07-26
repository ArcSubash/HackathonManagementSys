package com.hackathon.controller;

import com.hackathon.dto.response.ApiResponse;
import com.hackathon.dto.response.LeaderboardEntry;
import com.hackathon.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final EvaluationService evaluationService;

    @GetMapping("/{hackathonId}")
    public ResponseEntity<ApiResponse<List<LeaderboardEntry>>> getLeaderboard(@PathVariable String hackathonId) {
        List<LeaderboardEntry> leaderboard = evaluationService.getLeaderboard(hackathonId);
        return ResponseEntity.ok(ApiResponse.success("Leaderboard retrieved", leaderboard));
    }
}
