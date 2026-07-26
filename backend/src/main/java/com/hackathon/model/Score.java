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
@Document(collection = "scores")
public class Score {

    @Id
    private String id;

    private String projectId;

    private String judgeId;

    private String judgeName;

    private String hackathonId;

    private int innovation;        // 1-10

    private int technical;         // 1-10

    private int presentation;     // 1-10

    private int problemSolving;   // 1-10

    private int totalScore;       // sum of above

    private String comments;

    @Builder.Default
    private LocalDateTime scoredAt = LocalDateTime.now();
}
