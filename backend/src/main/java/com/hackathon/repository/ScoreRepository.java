package com.hackathon.repository;

import com.hackathon.model.Score;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends MongoRepository<Score, String> {

    List<Score> findByProjectId(String projectId);

    List<Score> findByJudgeId(String judgeId);

    List<Score> findByHackathonId(String hackathonId);

    Optional<Score> findByProjectIdAndJudgeId(String projectId, String judgeId);

    boolean existsByProjectIdAndJudgeId(String projectId, String judgeId);

    List<Score> findByJudgeIdAndHackathonId(String judgeId, String hackathonId);
}
