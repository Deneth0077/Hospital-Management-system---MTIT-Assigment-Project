package com.hospital.ward.service;

import com.hospital.ward.dto.ScheduleDTO;
import com.hospital.ward.exception.ResourceNotFoundException;
import com.hospital.ward.model.Schedule;
import com.hospital.ward.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleDTO.Response createSchedule(ScheduleDTO.Request request) {
        Schedule schedule = Schedule.builder()
                .patientId(request.getPatientId())
                .treatment(request.getTreatment())
                .time(request.getTime())
                .status(request.getStatus())
                .build();
        Schedule savedSchedule = scheduleRepository.save(schedule);
        return mapToResponse(savedSchedule);
    }

    public List<ScheduleDTO.Response> getSchedulesByPatient(String patientId) {
        return scheduleRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ScheduleDTO.Response updateSchedule(String id, ScheduleDTO.Request request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        
        schedule.setPatientId(request.getPatientId());
        schedule.setTreatment(request.getTreatment());
        schedule.setTime(request.getTime());
        schedule.setStatus(request.getStatus());
        
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return mapToResponse(updatedSchedule);
    }

    public void deleteSchedule(String id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    private ScheduleDTO.Response mapToResponse(Schedule schedule) {
        return ScheduleDTO.Response.builder()
                .id(schedule.getId())
                .patientId(schedule.getPatientId())
                .treatment(schedule.getTreatment())
                .time(schedule.getTime())
                .status(schedule.getStatus())
                .build();
    }
}
