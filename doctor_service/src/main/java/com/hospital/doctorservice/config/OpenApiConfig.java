package com.hospital.doctorservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI doctorServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Doctor Service API")
                .description("Microservice for managing hospital doctors — part of the Hospital Management System (HMS).")
                .version("v1.0.0")
                .contact(new Contact()
                    .name("HMS Team — Doctor Service")
                    .email("hms-dev@hospital.lk")
                )
            )
            .servers(List.of(
                new Server().url("http://localhost:8081").description("Direct — Doctor Service"),
                new Server().url("http://localhost:8000").description("Via API Gateway")
            ));
    }
}