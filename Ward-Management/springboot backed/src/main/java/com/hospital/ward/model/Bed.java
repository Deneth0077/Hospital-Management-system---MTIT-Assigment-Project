package com.hospital.ward.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "beds")
public class Bed {
    @Id
    private String id;

    @NotBlank(message = "Ward ID is required")
    private String wardId;

    @NotNull(message = "Bed number is required")
    private Integer bedNumber;

    @NotBlank(message = "Bed status is required")
    private String status; // available, occupied

    private String patientId;
}
