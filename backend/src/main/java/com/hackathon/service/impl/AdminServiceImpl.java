package com.hackathon.service.impl;

import com.hackathon.dto.response.AdminStatsResponse;
import com.hackathon.exception.BadRequestException;
import com.hackathon.exception.ResourceNotFoundException;
import com.hackathon.model.HackathonStatus;
import com.hackathon.model.Project;
import com.hackathon.model.Role;
import com.hackathon.model.Team;
import com.hackathon.model.User;
import com.hackathon.repository.*;
import com.hackathon.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;
    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalHackathons(hackathonRepository.count())
                .totalParticipants(userRepository.findByRole(Role.PARTICIPANT).size())
                .totalTeams(teamRepository.count())
                .totalProjects(projectRepository.count())
                .totalJudges(userRepository.findByRole(Role.JUDGE).size())
                .activeHackathons(hackathonRepository.findByStatus(HackathonStatus.ACTIVE).size())
                .build();
    }

    @Override
    public List<User> getAllJudges() {
        return userRepository.findByRole(Role.JUDGE);
    }

    @Override
    public List<User> getAllParticipants() {
        return userRepository.findByRole(Role.PARTICIPANT);
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public void assignJudgeToHackathon(String judgeId, String hackathonId) {
        User judge = userRepository.findById(judgeId)
                .orElseThrow(() -> new ResourceNotFoundException("Judge", "id", judgeId));

        if (judge.getRole() != Role.JUDGE) {
            throw new BadRequestException("User is not a judge");
        }

        // Verify hackathon exists
        hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));

        if (judge.getAssignedHackathons().contains(hackathonId)) {
            throw new BadRequestException("Judge is already assigned to this hackathon");
        }

        judge.getAssignedHackathons().add(hackathonId);
        userRepository.save(judge);
    }

    @Override
    public void removeJudgeFromHackathon(String judgeId, String hackathonId) {
        User judge = userRepository.findById(judgeId)
                .orElseThrow(() -> new ResourceNotFoundException("Judge", "id", judgeId));

        judge.getAssignedHackathons().remove(hackathonId);
        userRepository.save(judge);
    }

    @Override
    public User createJudge(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        User judge = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.JUDGE)
                .build();

        return userRepository.save(judge);
    }

    @Override
    public User updateUser(String userId, String name, String email, String roleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already in use");
        }

        user.setName(name);
        user.setEmail(email);

        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role");
        }

        return userRepository.save(user);
    }

    @Override
    public void changeUserPassword(String userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete an Admin account");
        }

        userRepository.delete(user);
    }
}
