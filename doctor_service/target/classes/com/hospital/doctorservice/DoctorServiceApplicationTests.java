package com.hospital.doctorservice;

import com.hospital.doctorservice.model.Doctor;
import com.hospital.doctorservice.repository.DoctorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DoctorServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DoctorRepository doctorRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void getAllDoctors_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/doctors"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(0))));
    }

    @Test
    void getStats_ShouldReturnTotalCount() throws Exception {
        mockMvc.perform(get("/api/doctors/stats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").isNumber());
    }

    @Test
    void getDoctorById_NotFound_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/doctors/99999"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createDoctor_ShouldReturn201() throws Exception {
        String json = """
            {
              "name": "Dr. Test Doctor",
              "specialty": "General",
              "status": "Active",
              "patients": 10,
              "rating": 4.0,
              "img": "https://example.com/img.jpg",
              "dutySector": "General Ward",
              "contactInfo": "+94 77 000 0000",
              "shiftTime": "08:00 AM - 04:00 PM"
            }
            """;

        mockMvc.perform(post("/api/doctors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Dr. Test Doctor"))
            .andExpect(jsonPath("$.id").isNumber());
    }
}