package com.hospital.doctorservice.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "doctors")
@Schema(description = "Doctor entity representing a hospital doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Auto-generated unique ID", example = "1")
    private Long id;

    @NotBlank(message = "Name is required")
    @Schema(description = "Full name of the doctor", example = "Dr. Sarah Adams")
    private String name;

    @NotBlank(message = "Specialty is required")
    @Schema(description = "Medical specialty", example = "Cardiologist")
    private String specialty;

    @NotBlank(message = "Status is required")
    @Schema(description = "Current status: Active, On-Duty, On-Leave", example = "Active")
    private String status;

    @Min(value = 0, message = "Patients count cannot be negative")
    @Schema(description = "Total number of patients treated", example = "124")
    private Integer patients;

    @DecimalMin(value = "0.0") @DecimalMax(value = "5.0")
    @Schema(description = "Doctor rating out of 5", example = "4.8")
    private Double rating;

    @Schema(description = "Profile image URL", example = "https://images.unsplash.com/...")
    private String img;

    @Schema(description = "Assigned duty sector/unit", example = "Cardiology Unit")
    private String dutySector;

    @Schema(description = "Contact phone number", example = "+94 77 111 2222")
    private String contactInfo;

    @Schema(description = "Shift working hours", example = "08:00 AM - 04:00 PM")
    private String shiftTime;

    // ---- Constructors ----

    public Doctor() {}

    public Doctor(Long id, String name, String specialty, String status,
                  Integer patients, Double rating, String img,
                  String dutySector, String contactInfo, String shiftTime) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.status = status;
        this.patients = patients;
        this.rating = rating;
        this.img = img;
        this.dutySector = dutySector;
        this.contactInfo = contactInfo;
        this.shiftTime = shiftTime;
    }

    // ---- Getters & Setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getPatients() { return patients; }
    public void setPatients(Integer patients) { this.patients = patients; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }

    public String getDutySector() { return dutySector; }
    public void setDutySector(String dutySector) { this.dutySector = dutySector; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getShiftTime() { return shiftTime; }
    public void setShiftTime(String shiftTime) { this.shiftTime = shiftTime; }
}