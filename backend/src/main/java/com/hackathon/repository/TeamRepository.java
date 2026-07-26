package com.hackathon.repository;

import com.hackathon.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {

    List<Team> findByHackathonId(String hackathonId);

    Optional<Team> findByLeaderIdAndHackathonId(String leaderId, String hackathonId);

    List<Team> findByMemberIdsContaining(String userId);

    Optional<Team> findByMemberIdsContainingAndHackathonId(String userId, String hackathonId);

    boolean existsByTeamNameAndHackathonId(String teamName, String hackathonId);
}
