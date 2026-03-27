package com.hospital.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class WardDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Schema(example = "ICU")
        @NotBlank(message = "Ward name is required")
        private String name;

        @Schema(example = "20")
        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be positive")
        private Integer capacity;

        @Schema(example = "ICU")
        @NotBlank(message = "Ward type is required")
        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        @Schema(example = "641fcb2d8e4f5a... ")
        private String id;
        @Schema(example = "ICU")
        private String name;
        @Schema(example = "20")
        private Integer capacity;
        @Schema(example = "15")
        private Integer availableBeds;
        @Schema(example = "ICU")
        private String type;
    }
}
