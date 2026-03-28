package com.hospital.doctorservice.config;

import com.hospital.doctorservice.model.Doctor;
import com.hospital.doctorservice.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(DoctorRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    new Doctor(null,
                        "Dr. Sarah Adams",
                        "Cardiologist",
                        "Active",
                        124,
                        4.8,
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100",
                        "Cardiology Unit",
                        "+94 77 111 2222",
                        "08:00 AM - 04:00 PM"
                    ),
                    new Doctor(null,
                        "Dr. James Wilson",
                        "Neurologist",
                        "On-Duty",
                        86,
                        4.6,
                        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100",
                        "Neurology Unit",
                        "+94 77 333 4444",
                        "08:00 AM - 04:00 PM"
                    ),
                    new Doctor(null,
                        "Dr. Elena Martinez",
                        "Pediatrician",
                        "Active",
                        210,
                        4.9,
                        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100",
                        "Pediatric Unit",
                        "+94 77 555 6666",
                        "10:00 AM - 06:00 PM"
                    ),
                    new Doctor(null,
                        "Dr. Robert Chen",
                        "Orthopedic",
                        "On-Leave",
                        45,
                        4.5,
                        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100",
                        "Orthopedic Unit",
                        "+94 77 777 8888",
                        "09:00 AM - 05:00 PM"
                    )
                ));
                System.out.println("✅ Doctor Service: Seeded 4 doctors into the database.");
            }
        };
    }
}