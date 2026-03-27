package com.hospital.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BedDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Schema(example = "641fcb2d8e4f5a... ")
        @NotBlank(message = "Ward ID is required")
        private String wardId;

        @Schema(example = "101")
        @NotNull(message = "Bed number is required")
        private Integer bedNumber;

        @Schema(example = "available")
        @NotBlank(message = "Bed status is required")
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        @Schema(example = "752fdb3e9f5g6b... ")
        private String id;
        @Schema(example = "641fcb2d8e4f5a... ")
        private String wardId;
        @Schema(example = "101")
        private Integer bedNumber;
        @Schema(example = "available")
        private String status;
        @Schema(example = "null")
        private String patientId;
    }
}
