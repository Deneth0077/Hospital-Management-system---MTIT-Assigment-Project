package com.hospital.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class PatientDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Schema(example = "John Doe")
        @NotBlank(message = "Patient name is required")
        private String name;

        @Schema(example = "COVID-19")
        @NotBlank(message = "Disease is required")
        private String disease;

        @Schema(example = "critical")
        @NotBlank(message = "Severity is required")
        private String severity;

        @Schema(example = "641fcb2d8e4f5a... ")
        private String wardId;

        @Schema(example = "752fdb3e9f5g6b... ")
        private String bedId;

        @Schema(example = "934hdc2f... ")
        private String doctorId;

        @Schema(example = "admitted", allowableValues = {"admitted", "discharged"})
        private String status;

        @Schema(example = "[\"Blood Test\", \"X-Ray\"]")
        private java.util.List<String> checkups;

        @Schema(example = "2024-03-28T12:00:00")
        private java.time.LocalDateTime admissionDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        @Schema(example = "863gdc4f... ")
        private String id;
        @Schema(example = "John Doe")
        private String name;
        @Schema(example = "COVID-19")
        private String disease;
        @Schema(example = "critical")
        private String severity;
        @Schema(example = "641fcb2d8e4f5a... ")
        private String wardId;
        @Schema(example = "752fdb3e9f5g6b... ")
        private String bedId;
        @Schema(example = "934hdc2f... ")
        private String doctorId;
        @Schema(example = "125fbc7e... ")
        private String nurseId;
        @Schema(example = "admitted")
        private String status;

        @Schema(example = "[\"Blood Test\", \"X-Ray\"]")
        private java.util.List<String> checkups;

        @Schema(example = "2024-03-28T12:00:00")
        private java.time.LocalDateTime admissionDate;

        @Schema(example = "2024-03-31T10:00:00")
        private java.time.LocalDateTime dischargeDate;
    }
}
