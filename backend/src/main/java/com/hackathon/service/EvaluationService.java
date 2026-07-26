package com.hackathon.service;

import com.hackathon.dto.request.ScoreRequest;
import com.hackathon.dto.response.LeaderboardEntry;
import com.hackathon.model.Score;

import java.util.List;

public interface EvaluationService {

    Score submitScore(ScoreRequest request, String judgeId);

    List<Score> getScoresByProject(String projectId);

    List<Score> getScoresByJudge(String judgeId);

    List<Score> getScoresByJudgeAndHackathon(String judgeId, String hackathonId);

    List<LeaderboardEntry> getLeaderboard(String hackathonId);
}
