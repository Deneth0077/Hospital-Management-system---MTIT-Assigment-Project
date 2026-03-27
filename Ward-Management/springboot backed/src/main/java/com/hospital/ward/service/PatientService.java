package com.hospital.ward.service;

import com.hospital.ward.dto.PatientDTO;
import com.hospital.ward.exception.BedNotAvailableException;
import com.hospital.ward.exception.ResourceNotFoundException;
import com.hospital.ward.exception.StaffNotAvailableException;
import com.hospital.ward.model.*;
import com.hospital.ward.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final WardRepository wardRepository;
    private final BedRepository bedRepository;
    private final StaffRepository staffRepository;
    private final ScheduleRepository scheduleRepository;

    @Transactional
    public PatientDTO.Response admitPatient(PatientDTO.Request request) {
        log.info("Starting admission flow for patient: {}", request.getName());

        // 1. Determine Ward
        Ward ward;
        String wardType;
        if (request.getWardId() != null && !request.getWardId().isEmpty()) {
            ward = wardRepository.findById(request.getWardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected ward not found"));
            wardType = ward.getType();
        } else {
            wardType = determineWardType(request.getSeverity(), request.getDisease());
            ward = wardRepository.findByType(wardType)
                    .orElseThrow(() -> new ResourceNotFoundException("Ward of type " + wardType + " not found"));
        }

        if (ward.getAvailableBeds() <= 0) {
            throw new BedNotAvailableException("No available beds in " + ward.getName());
        }

        // 2. Find Available Bed
        Bed bed;
        if (request.getBedId() != null && !request.getBedId().isEmpty()) {
            bed = bedRepository.findById(request.getBedId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected bed not found"));
            if (!"available".equalsIgnoreCase(bed.getStatus())) {
                throw new BedNotAvailableException("The selected bed is no longer available");
            }
        } else {
            bed = bedRepository.findFirstByWardIdAndStatus(ward.getId(), "available")
                    .orElseThrow(() -> new BedNotAvailableException("No available beds in " + ward.getName() + " (consistency error)"));
        }

        // 3. Find Doctor and Nurse
        Staff doctor;
        if (request.getDoctorId() != null && !request.getDoctorId().isEmpty()) {
            doctor = staffRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Selected doctor not found"));
        } else {
            doctor = staffRepository.findFirstByWardIdAndRole(ward.getId(), "doctor")
                    .orElseThrow(() -> new StaffNotAvailableException("No doctor available in " + ward.getName() + " ward"));
        }
        
        Staff nurse = staffRepository.findFirstByWardIdAndRole(ward.getId(), "nurse")
                .orElseThrow(() -> new StaffNotAvailableException("No nurse available in " + ward.getName() + " ward"));

        // 4. Update Ward & Bed
        ward.setAvailableBeds(ward.getAvailableBeds() - 1);
        wardRepository.save(ward);

        bed.setStatus("occupied");
        // patientId will be set after patient creation
        bedRepository.save(bed);

        // 5. Create Patient
        Patient patient = Patient.builder()
                .name(request.getName())
                .disease(request.getDisease())
                .severity(request.getSeverity())
                .wardId(ward.getId())
                .bedId(bed.getId())
                .doctorId(doctor.getId())
                .nurseId(nurse.getId())
                .status("admitted")
                .checkups(request.getCheckups() != null ? request.getCheckups() : new java.util.ArrayList<>())
                .build();
        Patient savedPatient = patientRepository.save(patient);

        // 6. Finalize Bed and Staff
        bed.setPatientId(savedPatient.getId());
        bedRepository.save(bed);

        doctor.getAssignedPatients().add(savedPatient.getId());
        staffRepository.save(doctor);

        nurse.getAssignedPatients().add(savedPatient.getId());
        staffRepository.save(nurse);

        // 7. Create Initial Treatment Schedule
        Schedule initialSchedule = Schedule.builder()
                .patientId(savedPatient.getId())
                .treatment("Initial diagnosis and admission")
                .time(LocalDateTime.now())
                .status("pending")
                .build();
        scheduleRepository.save(initialSchedule);

        log.info("Admission completed for patient: {}. Assigned to Ward: {}, Bed: {}", 
                 savedPatient.getName(), ward.getName(), bed.getBedNumber());

        return mapToResponse(savedPatient);
    }

    private String determineWardType(String severity, String disease) {
        if ("critical".equalsIgnoreCase(severity)) {
            return "ICU";
        } else if ("pregnancy".equalsIgnoreCase(disease)) {
            return "Maternity";
        } else {
            return "General";
        }
    }

    public List<PatientDTO.Response> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PatientDTO.Response getPatientById(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToResponse(patient);
    }

    public PatientDTO.Response updatePatient(String id, PatientDTO.Request request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patient.setName(request.getName());
        patient.setDisease(request.getDisease());
        patient.setSeverity(request.getSeverity());
        
        Patient updatedPatient = patientRepository.save(patient);
        return mapToResponse(updatedPatient);
    }

    public void deletePatient(String id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    private PatientDTO.Response mapToResponse(Patient patient) {
        return PatientDTO.Response.builder()
                .id(patient.getId())
                .name(patient.getName())
                .disease(patient.getDisease())
                .severity(patient.getSeverity())
                .wardId(patient.getWardId())
                .bedId(patient.getBedId())
                .doctorId(patient.getDoctorId())
                .nurseId(patient.getNurseId())
                .status(patient.getStatus())
                .checkups(patient.getCheckups())
                .build();
    }
}
