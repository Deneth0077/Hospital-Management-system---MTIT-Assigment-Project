package com.hospital.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ScheduleDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Schema(example = "863gdc4f... ")
        @NotBlank(message = "Patient ID is required")
        private String patientId;

        @Schema(example = "General physical examination and blood test")
        @NotBlank(message = "Treatment description is required")
        private String treatment;

        @Schema(example = "2026-03-26T10:00:00")
        private LocalDateTime time;

        @Schema(example = "pending")
        @NotBlank(message = "Status is required")
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        @Schema(example = "452fbc3d... ")
        private String id;
        @Schema(example = "863gdc4f... ")
        private String patientId;
        @Schema(example = "General physical examination and blood test")
        private String treatment;
        @Schema(example = "2026-03-26T10:00:00")
        private LocalDateTime time;
        @Schema(example = "pending")
        private String status;
    }
}
