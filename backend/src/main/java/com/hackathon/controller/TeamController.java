package com.hackathon.controller;

import com.hackathon.dto.request.TeamRequest;
import com.hackathon.dto.response.ApiResponse;
import com.hackathon.model.Team;
import com.hackathon.model.TeamInvitation;
import com.hackathon.security.JwtUtil;
import com.hackathon.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<Team>> create(
            @Valid @RequestBody TeamRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Team team = teamService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team created successfully", team));
    }

    @PostMapping("/{teamId}/join")
    public ResponseEntity<ApiResponse<Team>> join(
            @PathVariable String teamId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Team team = teamService.joinTeam(teamId, userId);
        return ResponseEntity.ok(ApiResponse.success("Joined team successfully", team));
    }

    @PostMapping("/{teamId}/leave")
    public ResponseEntity<ApiResponse<Team>> leave(
            @PathVariable String teamId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Team team = teamService.leaveTeam(teamId, userId);
        return ResponseEntity.ok(ApiResponse.success("Left team successfully", team));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Team>> getById(@PathVariable String id) {
        Team team = teamService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Team retrieved", team));
    }

    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<ApiResponse<List<Team>>> getByHackathon(@PathVariable String hackathonId) {
        List<Team> teams = teamService.getByHackathonId(hackathonId);
        return ResponseEntity.ok(ApiResponse.success("Teams retrieved", teams));
    }

    @GetMapping("/my-teams")
    public ResponseEntity<ApiResponse<List<Team>>> getMyTeams(
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        List<Team> teams = teamService.getMyTeams(userId);
        return ResponseEntity.ok(ApiResponse.success("Your teams retrieved", teams));
    }

    @GetMapping("/my-team/{hackathonId}")
    public ResponseEntity<ApiResponse<Team>> getMyTeamForHackathon(
            @PathVariable String hackathonId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Team team = teamService.getMyTeamForHackathon(userId, hackathonId);
        return ResponseEntity.ok(ApiResponse.success("Team retrieved", team));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        teamService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Team disbanded successfully"));
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable String teamId,
            @PathVariable String memberId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        teamService.removeMember(teamId, userId, memberId);
        return ResponseEntity.ok(ApiResponse.success("Team member removed successfully"));
    }

    @PostMapping("/{teamId}/invite")
    public ResponseEntity<ApiResponse<Void>> inviteParticipant(
            @PathVariable String teamId,
            @RequestParam String email,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        teamService.inviteParticipant(teamId, userId, email);
        return ResponseEntity.ok(ApiResponse.success("Invitation sent successfully"));
    }

    @GetMapping("/invitations")
    public ResponseEntity<ApiResponse<List<TeamInvitation>>> getMyInvitations(
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        List<TeamInvitation> invitations = teamService.getMyInvitations(userId);
        return ResponseEntity.ok(ApiResponse.success("Invitations retrieved", invitations));
    }

    @PostMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<ApiResponse<Team>> acceptInvitation(
            @PathVariable String invitationId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Team team = teamService.acceptInvitation(invitationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Invitation accepted successfully", team));
    }

    @PostMapping("/invitations/{invitationId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectInvitation(
            @PathVariable String invitationId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        teamService.rejectInvitation(invitationId, userId);
        return ResponseEntity.ok(ApiResponse.success("Invitation rejected successfully"));
    }

    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
    }
}
