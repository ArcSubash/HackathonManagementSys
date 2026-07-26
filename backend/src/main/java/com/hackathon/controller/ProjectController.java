package com.hackathon.controller;

import com.hackathon.dto.request.ProjectRequest;
import com.hackathon.dto.response.ApiResponse;
import com.hackathon.model.Project;
import com.hackathon.security.JwtUtil;
import com.hackathon.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> submit(
            @Valid @RequestBody ProjectRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Project project = projectService.submit(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project submitted successfully", project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> update(
            @PathVariable String id,
            @Valid @RequestBody ProjectRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Project project = projectService.update(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getById(@PathVariable String id) {
        Project project = projectService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Project retrieved", project));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<Project>>> getByHackathon(@PathVariable String hackathonId) {
        List<Project> projects = projectService.getByHackathonId(hackathonId);
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projects));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<Project>> getByTeam(@PathVariable String teamId) {
        Project project = projectService.getByTeamId(teamId);
        return ResponseEntity.ok(ApiResponse.success("Project retrieved", project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        projectService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }

    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
    }
}
