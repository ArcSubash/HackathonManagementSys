package com.hackathon.service.impl;

import com.hackathon.dto.request.HackathonRequest;
import com.hackathon.exception.BadRequestException;
import com.hackathon.exception.ResourceNotFoundException;
import com.hackathon.model.Hackathon;
import com.hackathon.model.HackathonStatus;
import com.hackathon.repository.HackathonRepository;
import com.hackathon.service.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class HackathonServiceImpl implements HackathonService {

    private final HackathonRepository hackathonRepository;

    @Override
    public Hackathon create(HackathonRequest request, String userId) {
        Hackathon hackathon = Hackathon.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .theme(request.getTheme())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .registrationDeadline(request.getRegistrationDeadline())
                .maxTeamSize(request.getMaxTeamSize() != null ? request.getMaxTeamSize() : 4)
                .status(HackathonStatus.UPCOMING)
                .createdBy(userId)
                .build();

        return hackathonRepository.save(hackathon);
    }

    @Override
    public Hackathon update(String id, HackathonRequest request) {
        Hackathon hackathon = getById(id);

        hackathon.setTitle(request.getTitle());
        hackathon.setDescription(request.getDescription());
        hackathon.setTheme(request.getTheme());
        hackathon.setStartDate(request.getStartDate());
        hackathon.setEndDate(request.getEndDate());
        hackathon.setRegistrationDeadline(request.getRegistrationDeadline());

        if (request.getMaxTeamSize() != null) {
            hackathon.setMaxTeamSize(request.getMaxTeamSize());
        }

        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            try {
                hackathon.setStatus(HackathonStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + request.getStatus());
            }
        }

        return hackathonRepository.save(hackathon);
    }

    @Override
    public void delete(String id) {
        Hackathon hackathon = getById(id);
        hackathonRepository.delete(hackathon);
    }

    @Override
    public Hackathon getById(String id) {
        return hackathonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hackathon", "id", id));
    }

    @Override
    public List<Hackathon> getAll() {
        return hackathonRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Hackathon> getByStatus(String status) {
        try {
            HackathonStatus hackathonStatus = HackathonStatus.valueOf(status.toUpperCase());
            return hackathonRepository.findByStatus(hackathonStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
    }
}
