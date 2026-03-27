package com.hospital.ward.service;

import com.hospital.ward.dto.StaffDTO;
import com.hospital.ward.exception.ResourceNotFoundException;
import com.hospital.ward.model.Staff;
import com.hospital.ward.model.Ward;
import com.hospital.ward.repository.StaffRepository;
import com.hospital.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final WardRepository wardRepository;

    public StaffDTO.Response createStaff(StaffDTO.Request request) {
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + request.getWardId()));
        
        Staff staff = Staff.builder()
                .name(request.getName())
                .role(request.getRole())
                .wardId(request.getWardId())
                .shift(request.getShift())
                .build();
        Staff savedStaff = staffRepository.save(staff);
        return mapToResponse(savedStaff);
    }

    public List<StaffDTO.Response> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StaffDTO.Response> getStaffByWard(String wardId) {
        return staffRepository.findByWardId(wardId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StaffDTO.Response updateStaff(String id, StaffDTO.Request request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        
        staff.setName(request.getName());
        staff.setRole(request.getRole());
        staff.setWardId(request.getWardId());
        staff.setShift(request.getShift());
        
        Staff updatedStaff = staffRepository.save(staff);
        return mapToResponse(updatedStaff);
    }

    public void deleteStaff(String id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff not found with id: " + id);
        }
        staffRepository.deleteById(id);
    }

    private StaffDTO.Response mapToResponse(Staff staff) {
        return StaffDTO.Response.builder()
                .id(staff.getId())
                .name(staff.getName())
                .role(staff.getRole())
                .wardId(staff.getWardId())
                .shift(staff.getShift())
                .assignedPatients(staff.getAssignedPatients())
                .build();
    }
}
