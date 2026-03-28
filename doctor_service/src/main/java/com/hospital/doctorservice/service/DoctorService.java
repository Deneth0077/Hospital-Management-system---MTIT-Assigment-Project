package com.hospital.doctorservice.service;

import com.hospital.doctorservice.model.Doctor;
import com.hospital.doctorservice.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // Get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get doctor by ID
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // Get doctors by status
    public List<Doctor> getDoctorsByStatus(String status) {
        return doctorRepository.findByStatus(status);
    }

    // Search by name or specialty
    public List<Doctor> searchDoctors(String query) {
        List<Doctor> byName = doctorRepository.findByNameContainingIgnoreCase(query);
        List<Doctor> bySpecialty = doctorRepository.findBySpecialtyContainingIgnoreCase(query);

        // Merge results without duplicates
        bySpecialty.forEach(d -> {
            if (byName.stream().noneMatch(n -> n.getId().equals(d.getId()))) {
                byName.add(d);
            }
        });
        return byName;
    }

    // Create a new doctor
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Update an existing doctor
    public Optional<Doctor> updateDoctor(Long id, Doctor doctorDetails) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setName(doctorDetails.getName());
            doctor.setSpecialty(doctorDetails.getSpecialty());
            doctor.setStatus(doctorDetails.getStatus());
            doctor.setPatients(doctorDetails.getPatients());
            doctor.setRating(doctorDetails.getRating());
            doctor.setImg(doctorDetails.getImg());
            doctor.setDutySector(doctorDetails.getDutySector());
            doctor.setContactInfo(doctorDetails.getContactInfo());
            doctor.setShiftTime(doctorDetails.getShiftTime());
            return doctorRepository.save(doctor);
        });
    }

    // Delete a doctor
    public boolean deleteDoctor(Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Count all doctors
    public long countDoctors() {
        return doctorRepository.count();
    }
}