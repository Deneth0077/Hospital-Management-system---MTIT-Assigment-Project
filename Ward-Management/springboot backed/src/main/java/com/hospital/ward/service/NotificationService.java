package com.hospital.ward.service;

import com.hospital.ward.dto.NotificationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Slf4j
@Service
public class NotificationService {

    private final RestTemplate restTemplate;
    private final String notificationUrl;

    public NotificationService(@Value("${notification.service.url:http://notification-service:5001/api/notifications}") String notificationUrl) {
        this.restTemplate = new RestTemplate();
        this.notificationUrl = notificationUrl;
    }

    public void sendNotification(String type, String patientId, String message) {
        try {
            NotificationDTO notification = NotificationDTO.builder()
                    .type(type)
                    .patientId(patientId)
                    .message(message)
                    .timestamp(LocalDateTime.now())
                    .build();

            log.info("Preparing to send notification to {}: {}", notificationUrl, notification);
            
            // In a real microservices environment, this would call the actual Node.js notification service
            // restTemplate.postForObject(notificationUrl, notification, String.class);
            
            log.info("✅ Notification event logged successfully for patient: {}", patientId);
        } catch (Exception e) {
            log.error("❌ Failed to send notification for patient {}: {}", patientId, e.getMessage());
        }
    }
}
