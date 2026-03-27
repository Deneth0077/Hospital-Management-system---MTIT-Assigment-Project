package com.hospital.ward.service;

import com.hospital.ward.dto.WardDTO;
import com.hospital.ward.exception.ResourceNotFoundException;
import com.hospital.ward.model.Ward;
import com.hospital.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WardService {

    private final WardRepository wardRepository;

    public WardDTO.Response createWard(WardDTO.Request request) {
        System.out.println("DEBUG: Creating ward with name: " + request.getName() + ", capacity: " + request.getCapacity());
        Ward ward = Ward.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .availableBeds(request.getCapacity())
                .type(request.getType())
                .build();
        Ward savedWard = wardRepository.save(ward);
        return mapToResponse(savedWard);
    }

    public List<WardDTO.Response> getAllWards() {
        return wardRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public WardDTO.Response getWardById(String id) {
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + id));
        return mapToResponse(ward);
    }

    public WardDTO.Response updateWard(String id, WardDTO.Request request) {
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + id));
        
        ward.setName(request.getName());
        ward.setCapacity(request.getCapacity());
        ward.setType(request.getType());
        // Note: availableBeds logic might need to be more complex if capacity decreases
        
        Ward updatedWard = wardRepository.save(ward);
        return mapToResponse(updatedWard);
    }

    public void deleteWard(String id) {
        if (!wardRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ward not found with id: " + id);
        }
        wardRepository.deleteById(id);
    }

    private WardDTO.Response mapToResponse(Ward ward) {
        if (ward == null) return null;
        
        return WardDTO.Response.builder()
                .id(ward.getId() != null ? ward.getId() : "")
                .name(ward.getName() != null ? ward.getName() : "Unknown")
                .capacity(ward.getCapacity() != null ? ward.getCapacity() : 0)
                .availableBeds(ward.getAvailableBeds() != null ? ward.getAvailableBeds() : 0)
                .type(ward.getType() != null ? ward.getType() : "General")
                .build();
    }
}
