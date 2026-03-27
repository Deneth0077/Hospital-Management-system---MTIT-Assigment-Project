package com.hospital.ward.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "patients")
public class Patient {
    @Id
    private String id;

    @NotBlank(message = "Patient name is required")
    private String name;

    @NotBlank(message = "Disease is required")
    private String disease;

    @NotBlank(message = "Severity is required")
    private String severity; // low, medium, critical

    private String wardId;
    private String bedId;
    private String doctorId;
    private String nurseId;

    @NotBlank(message = "Status is required")
    private String status; // admitted, discharged

    private java.util.List<String> checkups;
}
