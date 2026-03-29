package com.hospital.ward.service;

import com.hospital.ward.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final RestTemplate restTemplate;

    @Value("${NOTIFICATION_SERVICE_URL:http://localhost:5001/api/notifications/notify}")
    private String notificationServiceUrl;

    public void sendNotification(String type, String recipient, String message) {
        try {
            NotificationRequest request = NotificationRequest.builder()
                    .type(type)
                    .recipient(recipient)
                    .message(message)
                    .sender("Ward-Management-Service")
                    .build();

            log.info("Sending notification to {}: {}", notificationServiceUrl, request);
            restTemplate.postForLocation(notificationServiceUrl, request);
            log.info("Notification sent successfully");
        } catch (Exception e) {
            log.error("Failed to send notification to {}: {}", notificationServiceUrl, e.getMessage());
        }
    }
}
