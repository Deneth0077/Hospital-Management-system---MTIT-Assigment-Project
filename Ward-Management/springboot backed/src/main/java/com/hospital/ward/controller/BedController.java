package com.hospital.ward.controller;

import com.hospital.ward.dto.BedDTO;
import com.hospital.ward.service.BedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@Tag(name = "Bed Management", description = "Endpoints for managing hospital beds")
public class BedController {

    private final BedService bedService;

    @PostMapping
    @Operation(summary = "Create a new bed")
    public ResponseEntity<BedDTO.Response> createBed(@Valid @RequestBody BedDTO.Request request) {
        return new ResponseEntity<>(bedService.createBed(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all beds")
    public ResponseEntity<List<BedDTO.Response>> getAllBeds() {
        return ResponseEntity.ok(bedService.getAllBeds());
    }

    @GetMapping("/by-ward/{wardId}")
    @Operation(summary = "Get beds by ward ID")
    public ResponseEntity<List<BedDTO.Response>> getBedsByWard(@PathVariable String wardId) {
        return ResponseEntity.ok(bedService.getBedsByWard(wardId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update bed by ID")
    public ResponseEntity<BedDTO.Response> updateBed(@PathVariable String id, @Valid @RequestBody BedDTO.Request request) {
        return ResponseEntity.ok(bedService.updateBed(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete bed by ID")
    public ResponseEntity<Void> deleteBed(@PathVariable String id) {
        bedService.deleteBed(id);
        return ResponseEntity.noContent().build();
    }
}
