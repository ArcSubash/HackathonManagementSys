package com.hackathon.controller;

import com.hackathon.dto.request.HackathonRequest;
import com.hackathon.dto.response.ApiResponse;
import com.hackathon.model.Hackathon;
import com.hackathon.security.JwtUtil;
import com.hackathon.service.HackathonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
public class HackathonController {

    private final HackathonService hackathonService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hackathon>>> getAll() {
        List<Hackathon> hackathons = hackathonService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Hackathons retrieved", hackathons));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hackathon>> getById(@PathVariable String id) {
        Hackathon hackathon = hackathonService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Hackathon retrieved", hackathon));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Hackathon>>> getByStatus(@PathVariable String status) {
        List<Hackathon> hackathons = hackathonService.getByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Hackathons by status retrieved", hackathons));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Hackathon>> create(
            @Valid @RequestBody HackathonRequest request,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        Hackathon hackathon = hackathonService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Hackathon created successfully", hackathon));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Hackathon>> update(
            @PathVariable String id,
            @Valid @RequestBody HackathonRequest request) {
        Hackathon hackathon = hackathonService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Hackathon updated successfully", hackathon));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        hackathonService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Hackathon deleted successfully"));
    }

    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractClaim(token, claims -> claims.get("userId", String.class));
    }
}
