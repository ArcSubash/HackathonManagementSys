package com.hackathon.service;

import com.hackathon.dto.request.ProjectRequest;
import com.hackathon.model.Project;

import java.util.List;

public interface ProjectService {

    Project submit(ProjectRequest request, String userId);

    Project update(String id, ProjectRequest request, String userId);

    Project getById(String id);

    List<Project> getByHackathonId(String hackathonId);

    Project getByTeamId(String teamId);

    void delete(String id, String userId);
}
