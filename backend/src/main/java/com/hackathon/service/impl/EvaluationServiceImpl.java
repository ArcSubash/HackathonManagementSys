package com.hackathon.service.impl;

import com.hackathon.dto.request.ScoreRequest;
import com.hackathon.dto.response.LeaderboardEntry;
import com.hackathon.exception.BadRequestException;
import com.hackathon.exception.ResourceNotFoundException;
import com.hackathon.model.Hackathon;
import com.hackathon.model.Project;
import com.hackathon.model.Score;
import com.hackathon.model.User;
import com.hackathon.repository.ProjectRepository;
import com.hackathon.repository.ScoreRepository;
import com.hackathon.repository.UserRepository;
import com.hackathon.repository.HackathonRepository;
import com.hackathon.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class EvaluationServiceImpl implements EvaluationService {

    private final ScoreRepository scoreRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;

    @Override
    public Score submitScore(ScoreRequest request, String judgeId) {
        User judge = userRepository.findById(judgeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", judgeId));

        // Check if project exists
        projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        // Check if judge is assigned to this hackathon
        if (!judge.getAssignedHackathons().contains(request.getHackathonId())) {
            throw new BadRequestException("You are not assigned to this hackathon");
        }

        // Check if already scored
        if (scoreRepository.existsByProjectIdAndJudgeId(request.getProjectId(), judgeId)) {
            throw new BadRequestException("You have already scored this project");
        }

        int totalScore = request.getInnovation() + request.getTechnical()
                + request.getPresentation() + request.getProblemSolving();

        Score score = Score.builder()
                .projectId(request.getProjectId())
                .judgeId(judgeId)
                .judgeName(judge.getName())
                .hackathonId(request.getHackathonId())
                .innovation(request.getInnovation())
                .technical(request.getTechnical())
                .presentation(request.getPresentation())
                .problemSolving(request.getProblemSolving())
                .totalScore(totalScore)
                .comments(request.getComments())
                .build();

        return scoreRepository.save(score);
    }

    @Override
    public List<Score> getScoresByProject(String projectId) {
        return scoreRepository.findByProjectId(projectId);
    }

    @Override
    public List<Score> getScoresByJudge(String judgeId) {
        return scoreRepository.findByJudgeId(judgeId);
    }

    @Override
    public List<Score> getScoresByJudgeAndHackathon(String judgeId, String hackathonId) {
        return scoreRepository.findByJudgeIdAndHackathonId(judgeId, hackathonId);
    }

    @Override
    public List<LeaderboardEntry> getLeaderboard(String hackathonId) {
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));

        if (hackathon.getEndDate() != null && java.time.LocalDateTime.now().isBefore(hackathon.getEndDate())) {
            throw new BadRequestException("Leaderboard is only available after the hackathon has ended");
        }

        List<Project> projects = projectRepository.findByHackathonId(hackathonId);
        List<Score> allScores = scoreRepository.findByHackathonId(hackathonId);

        // Group scores by projectId
        Map<String, List<Score>> scoresByProject = allScores.stream()
                .collect(Collectors.groupingBy(Score::getProjectId));

        List<LeaderboardEntry> entries = new ArrayList<>();

        for (Project project : projects) {
            List<Score> projectScores = scoresByProject.getOrDefault(project.getId(), Collections.emptyList());

            double avgScore = projectScores.isEmpty() ? 0 :
                    projectScores.stream()
                            .mapToInt(Score::getTotalScore)
                            .average()
                            .orElse(0);

            entries.add(LeaderboardEntry.builder()
                    .projectId(project.getId())
                    .projectTitle(project.getTitle())
                    .teamId(project.getTeamId())
                    .teamName(project.getTeamName())
                    .averageScore(Math.round(avgScore * 100.0) / 100.0)
                    .totalReviews(projectScores.size())
                    .build());
        }

        // Sort by average score descending
        entries.sort((a, b) -> Double.compare(b.getAverageScore(), a.getAverageScore()));

        // Assign ranks
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }

        return entries;
    }
}
