package com.hackathon.service;

import com.hackathon.dto.response.AdminStatsResponse;
import com.hackathon.model.Project;
import com.hackathon.model.Team;
import com.hackathon.model.User;

import java.util.List;

public interface AdminService {

    AdminStatsResponse getStats();

    List<User> getAllJudges();

    List<User> getAllParticipants();

    List<Team> getAllTeams();

    List<Project> getAllProjects();

    void assignJudgeToHackathon(String judgeId, String hackathonId);

    void removeJudgeFromHackathon(String judgeId, String hackathonId);

    User createJudge(String name, String email, String password);

    User updateUser(String userId, String name, String email, String role);

    void changeUserPassword(String userId, String newPassword);

    void deleteUser(String userId);
}
