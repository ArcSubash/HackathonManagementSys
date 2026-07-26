package com.hackathon.service;

import com.hackathon.dto.request.TeamRequest;
import com.hackathon.model.Team;

import java.util.List;

public interface TeamService {

    Team create(TeamRequest request, String userId);

    Team joinTeam(String teamId, String userId);

    Team leaveTeam(String teamId, String userId);

    void removeMember(String teamId, String leaderId, String memberId);

    Team getById(String id);

    List<Team> getByHackathonId(String hackathonId);

    List<Team> getMyTeams(String userId);

    Team getMyTeamForHackathon(String userId, String hackathonId);

    void delete(String id, String userId);

    void inviteParticipant(String teamId, String inviterId, String inviteeEmail);

    List<com.hackathon.model.TeamInvitation> getMyInvitations(String userId);

    Team acceptInvitation(String invitationId, String userId);

    void rejectInvitation(String invitationId, String userId);
}
