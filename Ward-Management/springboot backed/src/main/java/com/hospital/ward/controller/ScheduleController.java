package com.hospital.ward.controller;

import com.hospital.ward.dto.ScheduleDTO;
import com.hospital.ward.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedule Management", description = "Endpoints for managing patient treatment schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ScheduleDTO.Response> createSchedule(@Valid @RequestBody ScheduleDTO.Request request) {
        return new ResponseEntity<>(scheduleService.createSchedule(request), HttpStatus.CREATED);
    }

    @GetMapping("/{patientId}")
    @Operation(summary = "Get schedules by patient ID")
    public ResponseEntity<List<ScheduleDTO.Response>> getSchedulesByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByPatient(patientId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update schedule by ID")
    public ResponseEntity<ScheduleDTO.Response> updateSchedule(@PathVariable String id, @Valid @RequestBody ScheduleDTO.Request request) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete schedule by ID")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
