package com.hackathon.repository;

import com.hackathon.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

    List<Project> findByHackathonId(String hackathonId);

    Optional<Project> findByTeamIdAndHackathonId(String teamId, String hackathonId);

    Optional<Project> findByTeamId(String teamId);

    boolean existsByTeamIdAndHackathonId(String teamId, String hackathonId);
}
