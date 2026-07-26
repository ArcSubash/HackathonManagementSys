package com.hackathon.repository;

import com.hackathon.model.TeamInvitation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamInvitationRepository extends MongoRepository<TeamInvitation, String> {
    List<TeamInvitation> findByInviteeIdAndStatus(String inviteeId, String status);
    boolean existsByTeamIdAndInviteeIdAndStatus(String teamId, String inviteeId, String status);
}
