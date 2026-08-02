package com.hackathon.service;

import com.hackathon.dto.request.HackathonRequest;
import com.hackathon.model.Hackathon;

import java.util.List;

public interface HackathonService {

    Hackathon create(HackathonRequest request, String userId);

    Hackathon update(String id, HackathonRequest request);

    void delete(String id);

    Hackathon getById(String id);

    List<Hackathon> getAll();

    List<Hackathon> getByStatus(String status);

    com.hackathon.dto.response.HackathonStatsResponse getHackathonStats(String hackathonId);
}
