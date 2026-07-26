package com.hackathon.controller;

import com.hackathon.dto.request.ScoreRequest;
import com.hackathon.dto.response.ApiResponse;
import com.hackathon.model.Score;
import com.hackathon.security.JwtUtil;
import com.hackathon.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final JwtUtil jwtUtil;

    @PostMapping
    @PreAuthorize("hasRole('JUDGE')")
    public ResponseEntity<ApiResponse<Score>> submitScore(
            @Valid @RequestBody ScoreRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String judgeId = extractUserId(authHeader);
        Score score = evaluationService.submitScore(request, judgeId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Score submitted successfully", score));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<Score>>> getByProject(@PathVariable String projectId) {
        List<Score> scores = evaluationService.getScoresByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success("Scores retrieved", scores));
    }

    @GetMapping("/judge")
    @PreAuthorize("hasRole('JUDGE')")
    public ResponseEntity<ApiResponse<List<Score>>> getByJudge(
            @RequestHeader("Authorization") String authHeader) {
        String judgeId = extractUserId(authHeader);
        List<Score> scores = evaluationService.getScoresByJudge(judgeId);
        return ResponseEntity.ok(ApiResponse.success("Scores retrieved", scores));
    }

    @GetMapping("/judge/hackathon/{hackathonId}")
    @PreAuthorize("hasRole('JUDGE')")
    public ResponseEntity<ApiResponse<List<Score>>> getByJudgeAndHackathon(
            @PathVariable String hackathonId,
            @RequestHeader("Authorization") String authHeader) {
        String judgeId = extractUserId(authHeader);
        List<Score> scores = evaluationService.getScoresByJudgeAndHackathon(judgeId, hackathonId);
        return ResponseEntity.ok(ApiResponse.success("Scores retrieved", scores));
    }

    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
    }
}
