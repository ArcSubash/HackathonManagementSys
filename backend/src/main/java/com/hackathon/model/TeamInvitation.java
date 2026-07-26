package com.hackathon.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "team_invitations")
public class TeamInvitation {

    @Id
    private String id;

    private String teamId;

    private String teamName;

    private String hackathonId;

    private String inviterId;

    private String inviteeId;

    private String status; // PENDING, ACCEPTED, REJECTED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
