package com.hospital.doctorservice.repository;

import com.hospital.doctorservice.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    // Find doctors by status (e.g., "Active", "On-Duty", "On-Leave")
    List<Doctor> findByStatus(String status);

    // Find doctors by specialty (case-insensitive)
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);

    // Find doctors by name (case-insensitive search)
    List<Doctor> findByNameContainingIgnoreCase(String name);
}