package com.hospital.ward.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "staff")
public class Staff {
    @Id
    private String id;

    @NotBlank(message = "Staff name is required")
    private String name;

    @NotBlank(message = "Role is required")
    private String role; // doctor, nurse

    @NotBlank(message = "Ward ID is required")
    private String wardId;

    @NotBlank(message = "Shift is required")
    private String shift; // morning, night

    @Builder.Default
    private List<String> assignedPatients = new ArrayList<>();
}
