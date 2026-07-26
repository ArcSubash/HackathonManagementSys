package com.hackathon.controller;

import com.hackathon.dto.request.AssignJudgeRequest;
import com.hackathon.dto.request.RegisterRequest;
import com.hackathon.dto.response.AdminStatsResponse;
import com.hackathon.dto.response.ApiResponse;
import com.hackathon.model.Project;
import com.hackathon.model.Team;
import com.hackathon.model.User;
import com.hackathon.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved", stats));
    }

    @GetMapping("/judges")
    public ResponseEntity<ApiResponse<List<User>>> getAllJudges() {
        List<User> judges = adminService.getAllJudges();
        return ResponseEntity.ok(ApiResponse.success("Judges retrieved", judges));
    }

    @GetMapping("/participants")
    public ResponseEntity<ApiResponse<List<User>>> getAllParticipants() {
        List<User> participants = adminService.getAllParticipants();
        return ResponseEntity.ok(ApiResponse.success("Participants retrieved", participants));
    }

    @GetMapping("/teams")
    public ResponseEntity<ApiResponse<List<Team>>> getAllTeams() {
        List<Team> teams = adminService.getAllTeams();
        return ResponseEntity.ok(ApiResponse.success("Teams retrieved", teams));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = adminService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projects));
    }

    @PostMapping("/judges")
    public ResponseEntity<ApiResponse<User>> createJudge(@Valid @RequestBody RegisterRequest request) {
        User judge = adminService.createJudge(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Judge created successfully", judge));
    }

    @PostMapping("/judges/assign")
    public ResponseEntity<ApiResponse<Void>> assignJudge(@Valid @RequestBody AssignJudgeRequest request) {
        adminService.assignJudgeToHackathon(request.getJudgeId(), request.getHackathonId());
        return ResponseEntity.ok(ApiResponse.success("Judge assigned to hackathon"));
    }

    @PostMapping("/judges/unassign")
    public ResponseEntity<ApiResponse<Void>> unassignJudge(@Valid @RequestBody AssignJudgeRequest request) {
        adminService.removeJudgeFromHackathon(request.getJudgeId(), request.getHackathonId());
        return ResponseEntity.ok(ApiResponse.success("Judge removed from hackathon"));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable String userId,
            @RequestBody java.util.Map<String, String> request) {
        User user = adminService.updateUser(userId, request.get("name"), request.get("email"), request.get("role"));
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", user));
    }

    @PutMapping("/users/{userId}/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable String userId,
            @RequestBody java.util.Map<String, String> request) {
        adminService.changeUserPassword(userId, request.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }
}
