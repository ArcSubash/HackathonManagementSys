package com.hackathon.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teams")
public class Team {

    @Id
    private String id;

    private String teamName;

    private String leaderId;

    private String leaderName;

    @Builder.Default
    private List<String> memberIds = new ArrayList<>();

    @Builder.Default
    private List<String> memberNames = new ArrayList<>();

    private String hackathonId;

    private String hackathonTitle;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
