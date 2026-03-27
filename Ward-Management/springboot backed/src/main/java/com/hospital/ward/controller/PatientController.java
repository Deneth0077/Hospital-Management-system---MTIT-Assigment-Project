package com.hospital.ward.controller;

import com.hospital.ward.dto.PatientDTO;
import com.hospital.ward.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@Tag(name = "Patient Management", description = "Endpoints for managing hospital patients")
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/admit")
    @Operation(summary = "Admit a new patient with automated ward and bed assignment")
    public ResponseEntity<PatientDTO.Response> admitPatient(@Valid @RequestBody PatientDTO.Request request) {
        return new ResponseEntity<>(patientService.admitPatient(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all patients")
    public ResponseEntity<List<PatientDTO.Response>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get patient by ID")
    public ResponseEntity<PatientDTO.Response> getPatientById(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update patient by ID")
    public ResponseEntity<PatientDTO.Response> updatePatient(@PathVariable String id, @Valid @RequestBody PatientDTO.Request request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete patient by ID")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
