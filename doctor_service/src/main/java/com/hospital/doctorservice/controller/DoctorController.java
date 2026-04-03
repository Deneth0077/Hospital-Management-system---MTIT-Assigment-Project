package com.hospital.doctorservice.controller;

import com.hospital.doctorservice.model.Doctor;
import com.hospital.doctorservice.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
@Tag(name = "Doctor Service", description = "APIs for managing hospital doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // ─────────────────────────────────────────────
    // GET /api/doctors  — List all or search
    // ─────────────────────────────────────────────
    @Operation(
        summary = "Get all doctors",
        description = "Returns all doctors. Optionally filter by 'status' or search by 'query' (name/specialty)."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of doctors returned successfully")
    })
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(
        @Parameter(description = "Filter by status: Active, On-Duty, On-Leave")
        @RequestParam(required = false) String status,
        @Parameter(description = "Search by name or specialty")
        @RequestParam(required = false) String query
    ) {
        if (query != null && !query.isBlank()) {
            return ResponseEntity.ok(doctorService.searchDoctors(query));
        }
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(doctorService.getDoctorsByStatus(status));
        }
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // ─────────────────────────────────────────────
    // GET /api/doctors/{id}
    // ─────────────────────────────────────────────
    @Operation(summary = "Get doctor by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Doctor found"),
        @ApiResponse(responseCode = "404", description = "Doctor not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
        @Parameter(description = "Doctor ID", required = true)
        @PathVariable String id
    ) {
        return doctorService.getDoctorById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ─────────────────────────────────────────────
    // POST /api/doctors  — Create new doctor
    // ─────────────────────────────────────────────
    @Operation(summary = "Create a new doctor")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Doctor created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(
        @Valid @RequestBody Doctor doctor
    ) {
        Doctor created = doctorService.createDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─────────────────────────────────────────────
    // PUT /api/doctors/{id}  — Full update
    // ─────────────────────────────────────────────
    @Operation(summary = "Update an existing doctor")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Doctor updated successfully"),
        @ApiResponse(responseCode = "404", description = "Doctor not found", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
        @Parameter(description = "Doctor ID", required = true)
        @PathVariable String id,
        @Valid @RequestBody Doctor doctorDetails
    ) {
        return doctorService.updateDoctor(id, doctorDetails)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ─────────────────────────────────────────────
    // PATCH /api/doctors/{id}/status  — Update status only
    // ─────────────────────────────────────────────
    @Operation(summary = "Update doctor status only", description = "Patch just the status field: Active | On-Duty | On-Leave")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status updated"),
        @ApiResponse(responseCode = "404", description = "Doctor not found", content = @Content)
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<Doctor> updateStatus(
        @PathVariable String id,
        @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        return doctorService.getDoctorById(id).map(doctor -> {
            doctor.setStatus(newStatus);
            Doctor updated = doctorService.createDoctor(doctor); // save
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ─────────────────────────────────────────────
    // DELETE /api/doctors/{id}
    // ─────────────────────────────────────────────
    @Operation(summary = "Delete a doctor by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Doctor deleted"),
        @ApiResponse(responseCode = "404", description = "Doctor not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDoctor(
        @Parameter(description = "Doctor ID", required = true)
        @PathVariable String id
    ) {
        if (doctorService.deleteDoctor(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Doctor with ID " + id + " deleted successfully.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // ─────────────────────────────────────────────
    // GET /api/doctors/stats  — Summary stats for dashboard
    // ─────────────────────────────────────────────
    @Operation(summary = "Get doctor statistics", description = "Returns total count, on-duty count, and on-leave count")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", doctorService.countDoctors());
        stats.put("onDuty", doctorService.getDoctorsByStatus("On-Duty").size());
        stats.put("active", doctorService.getDoctorsByStatus("Active").size());
        stats.put("onLeave", doctorService.getDoctorsByStatus("On-Leave").size());
        return ResponseEntity.ok(stats);
    }
}