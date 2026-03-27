package com.hospital.ward.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicationStartupListener {

    private final MongoTemplate mongoTemplate;

    @org.springframework.beans.factory.annotation.Value("${spring.data.mongodb.uri:NOT_FOUND}")
    private String mongoUri;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("WARD MANAGEMENT MICROSERVICE STARTUP STATUS");
        System.out.println("=".repeat(60));
        System.out.println("MONGO URI CONFIGURED AS: " + mongoUri);

        try {
            // Check MongoDB Connection
            String dbName = mongoTemplate.getDb().getName();
            System.out.println("[SUCCESS] Database Connection: Estalished");
            System.out.println("[INFO] Connected to Database: " + dbName);
        } catch (Exception e) {
            System.err.println("[FAILURE] Database Connection: Failed!");
            System.err.println("[ERROR] Details: " + e.getMessage());
        }

        System.out.println("\n[INFO] Documentation URL: http://localhost:8080/swagger-ui.html");
        System.out.println("=".repeat(60) + "\n");
    }
}
