package com.hackathon.service.impl;

import com.hackathon.dto.request.ProjectRequest;
import com.hackathon.exception.BadRequestException;
import com.hackathon.exception.ResourceNotFoundException;
import com.hackathon.model.Hackathon;
import com.hackathon.model.Project;
import com.hackathon.model.Team;
import com.hackathon.repository.HackathonRepository;
import com.hackathon.repository.ProjectRepository;
import com.hackathon.repository.TeamRepository;
import com.hackathon.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final HackathonRepository hackathonRepository;

    @Override
    public Project submit(ProjectRequest request, String userId) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", request.getTeamId()));

        Hackathon hackathon = hackathonRepository.findById(request.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", request.getHackathonId()));

        // Only team leader can submit
        if (!team.getLeaderId().equals(userId)) {
            throw new BadRequestException("Only the team leader can submit a project");
        }

        // Check if project already submitted for this team + hackathon
        if (projectRepository.existsByTeamIdAndHackathonId(request.getTeamId(), request.getHackathonId())) {
            throw new BadRequestException("A project has already been submitted for this team");
        }

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .githubLink(request.getGithubLink())
                .demoVideo(request.getDemoVideo())
                .teamId(request.getTeamId())
                .teamName(team.getTeamName())
                .hackathonId(request.getHackathonId())
                .hackathonTitle(hackathon.getTitle())
                .submittedBy(userId)
                .build();

        return projectRepository.save(project);
    }

    @Override
    public Project update(String id, ProjectRequest request, String userId) {
        Project project = getById(id);

        Team team = teamRepository.findById(project.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", project.getTeamId()));

        // Only team leader can edit
        if (!team.getLeaderId().equals(userId)) {
            throw new BadRequestException("Only the team leader can edit the project");
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setGithubLink(request.getGithubLink());
        project.setDemoVideo(request.getDemoVideo());

        return projectRepository.save(project);
    }

    @Override
    public Project getById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    @Override
    public List<Project> getByHackathonId(String hackathonId) {
        return projectRepository.findByHackathonId(hackathonId);
    }

    @Override
    public Project getByTeamId(String teamId) {
        return projectRepository.findByTeamId(teamId).orElse(null);
    }

    @Override
    public void delete(String id, String userId) {
        Project project = getById(id);

        Team team = teamRepository.findById(project.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", project.getTeamId()));

        if (!team.getLeaderId().equals(userId)) {
            throw new BadRequestException("Only the team leader can delete the project");
        }

        projectRepository.delete(project);
    }
}
