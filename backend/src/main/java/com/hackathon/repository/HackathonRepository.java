package com.hackathon.repository;

import com.hackathon.model.Hackathon;
import com.hackathon.model.HackathonStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HackathonRepository extends MongoRepository<Hackathon, String> {

    List<Hackathon> findByStatus(HackathonStatus status);

    List<Hackathon> findByCreatedBy(String createdBy);

    List<Hackathon> findAllByOrderByCreatedAtDesc();
}
