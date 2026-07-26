package com.hackathon.service.impl;

import com.hackathon.dto.request.TeamRequest;
import com.hackathon.exception.BadRequestException;
import com.hackathon.exception.ResourceNotFoundException;
import com.hackathon.model.Hackathon;
import com.hackathon.model.Team;
import com.hackathon.model.User;
import com.hackathon.repository.HackathonRepository;
import com.hackathon.repository.TeamRepository;
import com.hackathon.repository.TeamInvitationRepository;
import com.hackathon.repository.UserRepository;
import com.hackathon.service.TeamService;
import com.hackathon.model.TeamInvitation;
import com.hackathon.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final HackathonRepository hackathonRepository;
    private final UserRepository userRepository;
    private final TeamInvitationRepository teamInvitationRepository;

    @Override
    public Team create(TeamRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Hackathon hackathon = hackathonRepository.findById(request.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", request.getHackathonId()));

        // Check registration deadline
        if (hackathon.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(hackathon.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline has passed for this hackathon");
        }

        // Check if user already has a team for this hackathon
        if (teamRepository.findByMemberIdsContainingAndHackathonId(userId, request.getHackathonId()).isPresent()) {
            throw new BadRequestException("You are already in a team for this hackathon");
        }

        // Check if team name already exists for this hackathon
        if (teamRepository.existsByTeamNameAndHackathonId(request.getTeamName(), request.getHackathonId())) {
            throw new BadRequestException("Team name already exists for this hackathon");
        }

        List<String> memberIds = new ArrayList<>();
        memberIds.add(userId);

        List<String> memberNames = new ArrayList<>();
        memberNames.add(user.getName());

        Team team = Team.builder()
                .teamName(request.getTeamName())
                .leaderId(userId)
                .leaderName(user.getName())
                .memberIds(memberIds)
                .memberNames(memberNames)
                .hackathonId(request.getHackathonId())
                .hackathonTitle(hackathon.getTitle())
                .build();

        return teamRepository.save(team);
    }

    @Override
    public Team joinTeam(String teamId, String userId) {
        Team team = getById(teamId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Hackathon hackathon = hackathonRepository.findById(team.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", team.getHackathonId()));

        // Check registration deadline
        if (hackathon.getRegistrationDeadline() != null && LocalDateTime.now().isAfter(hackathon.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline has passed for this hackathon");
        }

        if (teamRepository.findByMemberIdsContainingAndHackathonId(userId, team.getHackathonId()).isPresent()) {
            throw new BadRequestException("You are already in a team for this hackathon");
        }

        if (team.getMemberIds().size() >= hackathon.getMaxTeamSize()) {
            throw new BadRequestException("Team has reached the maximum size of " + hackathon.getMaxTeamSize());
        }

        team.getMemberIds().add(userId);
        team.getMemberNames().add(user.getName());

        return teamRepository.save(team);
    }

    @Override
    public Team leaveTeam(String teamId, String userId) {
        Team team = getById(teamId);

        if (!team.getMemberIds().contains(userId)) {
            throw new BadRequestException("You are not a member of this team");
        }

        // Leader cannot leave — must disband
        if (team.getLeaderId().equals(userId)) {
            throw new BadRequestException("Team leader cannot leave. Please disband the team instead.");
        }

        int index = team.getMemberIds().indexOf(userId);
        team.getMemberIds().remove(index);
        if (index < team.getMemberNames().size()) {
            team.getMemberNames().remove(index);
        }

        return teamRepository.save(team);
    }

    @Override
    public Team getById(String id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "id", id));
    }

    @Override
    public List<Team> getByHackathonId(String hackathonId) {
        return teamRepository.findByHackathonId(hackathonId);
    }

    @Override
    public List<Team> getMyTeams(String userId) {
        return teamRepository.findByMemberIdsContaining(userId);
    }

    @Override
    public Team getMyTeamForHackathon(String userId, String hackathonId) {
        return teamRepository.findByMemberIdsContainingAndHackathonId(userId, hackathonId)
                .orElse(null);
    }

    @Override
    public void delete(String id, String userId) {
        Team team = getById(id);

        if (!team.getLeaderId().equals(userId)) {
            throw new BadRequestException("Only the team leader can disband the team");
        }

        teamRepository.delete(team);
    }

    @Override
    public void inviteParticipant(String teamId, String inviterId, String inviteeEmail) {
        Team team = getById(teamId);

        if (!team.getLeaderId().equals(inviterId)) {
            throw new BadRequestException("Only the team leader can invite members");
        }

        Hackathon hackathon = hackathonRepository.findById(team.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", team.getHackathonId()));

        if (team.getMemberIds().size() >= hackathon.getMaxTeamSize()) {
            throw new BadRequestException("Team has reached the maximum size of " + hackathon.getMaxTeamSize());
        }

        User invitee = userRepository.findByEmail(inviteeEmail)
                .orElseThrow(() -> new BadRequestException("No user found with this email"));

        if (invitee.getRole() != Role.PARTICIPANT) {
            throw new BadRequestException("You can only invite participants");
        }

        if (team.getMemberIds().contains(invitee.getId())) {
            throw new BadRequestException("User is already in the team");
        }

        if (teamRepository.findByMemberIdsContainingAndHackathonId(invitee.getId(), team.getHackathonId()).isPresent()) {
            throw new BadRequestException("User is already in a team for this hackathon");
        }

        if (teamInvitationRepository.existsByTeamIdAndInviteeIdAndStatus(teamId, invitee.getId(), "PENDING")) {
            throw new BadRequestException("An invitation has already been sent to this user");
        }

        TeamInvitation invitation = TeamInvitation.builder()
                .teamId(teamId)
                .teamName(team.getTeamName())
                .hackathonId(team.getHackathonId())
                .inviterId(inviterId)
                .inviteeId(invitee.getId())
                .status("PENDING")
                .build();

        teamInvitationRepository.save(invitation);
    }

    @Override
    public List<TeamInvitation> getMyInvitations(String userId) {
        return teamInvitationRepository.findByInviteeIdAndStatus(userId, "PENDING");
    }

    @Override
    public Team acceptInvitation(String invitationId, String userId) {
        TeamInvitation invitation = teamInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        if (!invitation.getInviteeId().equals(userId)) {
            throw new BadRequestException("This invitation is not for you");
        }

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new BadRequestException("Invitation is already " + invitation.getStatus());
        }

        Team team = getById(invitation.getTeamId());
        String hackathonId = team.getHackathonId();
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", hackathonId));

        if (team.getMemberIds().size() >= hackathon.getMaxTeamSize()) {
            throw new BadRequestException("Team has reached the maximum size of " + hackathon.getMaxTeamSize());
        }

        if (teamRepository.findByMemberIdsContainingAndHackathonId(userId, hackathonId).isPresent()) {
            throw new BadRequestException("You are already in a team for this hackathon");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        team.getMemberIds().add(userId);
        team.getMemberNames().add(user.getName());
        teamRepository.save(team);

        invitation.setStatus("ACCEPTED");
        teamInvitationRepository.save(invitation);

        return team;
    }

    @Override
    public void rejectInvitation(String invitationId, String userId) {
        TeamInvitation invitation = teamInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));

        if (!invitation.getInviteeId().equals(userId)) {
            throw new BadRequestException("This invitation is not for you");
        }

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new BadRequestException("Invitation is already " + invitation.getStatus());
        }

        invitation.setStatus("REJECTED");
        teamInvitationRepository.save(invitation);
    }
}
