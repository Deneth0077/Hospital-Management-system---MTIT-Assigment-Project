package com.hospital.ward.service;

import com.hospital.ward.dto.BedDTO;
import com.hospital.ward.exception.ResourceNotFoundException;
import com.hospital.ward.model.Bed;
import com.hospital.ward.model.Ward;
import com.hospital.ward.repository.BedRepository;
import com.hospital.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BedService {

    private final BedRepository bedRepository;
    private final WardRepository wardRepository;

    public BedDTO.Response createBed(BedDTO.Request request) {
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + request.getWardId()));
        
        Bed bed = Bed.builder()
                .wardId(request.getWardId())
                .bedNumber(request.getBedNumber())
                .status(request.getStatus())
                .build();
        Bed savedBed = bedRepository.save(bed);
        return mapToResponse(savedBed);
    }

    public List<BedDTO.Response> getAllBeds() {
        return bedRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BedDTO.Response> getBedsByWard(String wardId) {
        return bedRepository.findByWardId(wardId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BedDTO.Response updateBed(String id, BedDTO.Request request) {
        Bed bed = bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with id: " + id));
        
        bed.setWardId(request.getWardId());
        bed.setBedNumber(request.getBedNumber());
        bed.setStatus(request.getStatus());
        
        Bed updatedBed = bedRepository.save(bed);
        return mapToResponse(updatedBed);
    }

    public void deleteBed(String id) {
        if (!bedRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bed not found with id: " + id);
        }
        bedRepository.deleteById(id);
    }

    private BedDTO.Response mapToResponse(Bed bed) {
        return BedDTO.Response.builder()
                .id(bed.getId())
                .wardId(bed.getWardId())
                .bedNumber(bed.getBedNumber())
                .status(bed.getStatus())
                .patientId(bed.getPatientId())
                .build();
    }
}
