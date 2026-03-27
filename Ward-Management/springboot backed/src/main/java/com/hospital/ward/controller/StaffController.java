package com.hospital.ward.controller;

import com.hospital.ward.dto.StaffDTO;
import com.hospital.ward.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Management", description = "Endpoints for managing hospital staff")
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    @Operation(summary = "Create a new staff member")
    public ResponseEntity<StaffDTO.Response> createStaff(@Valid @RequestBody StaffDTO.Request request) {
        return new ResponseEntity<>(staffService.createStaff(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all staff members")
    public ResponseEntity<List<StaffDTO.Response>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/by-ward/{wardId}")
    @Operation(summary = "Get staff members by ward ID")
    public ResponseEntity<List<StaffDTO.Response>> getStaffByWard(@PathVariable String wardId) {
        return ResponseEntity.ok(staffService.getStaffByWard(wardId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update staff member by ID")
    public ResponseEntity<StaffDTO.Response> updateStaff(@PathVariable String id, @Valid @RequestBody StaffDTO.Request request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete staff member by ID")
    public ResponseEntity<Void> deleteStaff(@PathVariable String id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
