package com.hospital.ward.controller;

import com.hospital.ward.dto.WardDTO;
import com.hospital.ward.service.WardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@Tag(name = "Ward Management", description = "Endpoints for managing hospital wards")
public class WardController {

    private final WardService wardService;

    @PostMapping
    @Operation(summary = "Create a new ward")
    public ResponseEntity<WardDTO.Response> createWard(@Valid @RequestBody WardDTO.Request request) {
        return new ResponseEntity<>(wardService.createWard(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all wards")
    public ResponseEntity<List<WardDTO.Response>> getAllWards() {
        return ResponseEntity.ok(wardService.getAllWards());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ward by ID")
    public ResponseEntity<WardDTO.Response> getWardById(@PathVariable String id) {
        return ResponseEntity.ok(wardService.getWardById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update ward by ID")
    public ResponseEntity<WardDTO.Response> updateWard(@PathVariable String id, @Valid @RequestBody WardDTO.Request request) {
        return ResponseEntity.ok(wardService.updateWard(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ward by ID")
    public ResponseEntity<Void> deleteWard(@PathVariable String id) {
        wardService.deleteWard(id);
        return ResponseEntity.noContent().build();
    }
}
