package com.hospital.ward.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI wardManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ward Management Microservice API")
                        .description("API Documentation for the Hospital Ward Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Hospital Admin")
                                .email("admin@hospital.com")));
    }
}
