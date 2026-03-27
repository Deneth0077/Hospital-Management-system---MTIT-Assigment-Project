package com.hospital.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class StaffDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Schema(example = "Dr. Smith")
        @NotBlank(message = "Staff name is required")
        private String name;

        @Schema(example = "doctor")
        @NotBlank(message = "Role is required")
        private String role;

        @Schema(example = "641fcb2d8e4f5a... ")
        @NotBlank(message = "Ward ID is required")
        private String wardId;

        @Schema(example = "morning")
        @NotBlank(message = "Shift is required")
        private String shift;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        @Schema(example = "934hdc2f... ")
        private String id;
        @Schema(example = "Dr. Smith")
        private String name;
        @Schema(example = "doctor")
        private String role;
        @Schema(example = "641fcb2d8e4f5a... ")
        private String wardId;
        @Schema(example = "morning")
        private String shift;
        @Schema(example = "[\"863gdc4f... \"]")
        private List<String> assignedPatients;
    }
}
