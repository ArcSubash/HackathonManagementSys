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
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    private String title;

    private String description;

    private String githubLink;

    private String demoVideo;

    private String teamId;

    private String teamName;

    private String hackathonId;

    private String hackathonTitle;

    private String submittedBy;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
