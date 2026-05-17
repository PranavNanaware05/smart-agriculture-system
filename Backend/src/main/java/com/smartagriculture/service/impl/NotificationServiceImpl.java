package com.smartagriculture.service.impl;

import com.smartagriculture.dto.notification.IrrigationAlertRequest;
import com.smartagriculture.dto.notification.LowSoilMoistureAlertRequest;
import com.smartagriculture.dto.notification.NotificationRequest;
import com.smartagriculture.dto.notification.NotificationResponse;
import com.smartagriculture.dto.notification.WeatherAlertRequest;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.Notification;
import com.smartagriculture.entity.NotificationType;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.BadRequestException;
import com.smartagriculture.repository.NotificationRepository;
import com.smartagriculture.service.NotificationService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    private static final long DUPLICATE_NOTIFICATION_WINDOW_SECONDS = 600;

    @Override
    @Transactional
    public NotificationResponse send(NotificationRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        String title = request.getTitle().trim();
        String message = request.getMessage().trim();

        return notificationRepository
                .findTopByFarmerIdAndNotificationTypeAndTitleAndMessageOrderByCreatedAtDesc(
                        farmer.getId(), request.getNotificationType(), title, message)
                .filter(this::isDuplicateWithinWindow)
                .map(NotificationServiceImpl::map)
                .orElseGet(() -> {
                    Notification n = Notification.builder()
                            .title(title)
                            .message(message)
                            .notificationType(request.getNotificationType())
                            .farmer(farmer)
                            .build();
                    notificationRepository.save(n);
                    return map(n);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listForFarmer(Long farmerId) {
        User user = securityUtils.currentUser();
        accessHelper.requireAccessibleFarmer(user, farmerId);
        return notificationRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream()
                .map(NotificationServiceImpl::map)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse lowSoilMoistureAlert(LowSoilMoistureAlertRequest request) {
        if (request.getSoilMoisture().compareTo(request.getThreshold()) >= 0) {
            throw new BadRequestException("Soil moisture is not below the configured threshold");
        }
        return send(NotificationRequest.builder()
                .farmerId(request.getFarmerId())
                .title("Low soil moisture")
                .message(String.format(
                        "Soil moisture %.2f%% is below threshold %.2f%%",
                        request.getSoilMoisture(), request.getThreshold()))
                .notificationType(NotificationType.LOW_SOIL_MOISTURE)
                .build());
    }

    @Override
    @Transactional
    public NotificationResponse weatherAlert(WeatherAlertRequest request) {
        return send(NotificationRequest.builder()
                .farmerId(request.getFarmerId())
                .title("Weather alert")
                .message(request.getMessage().trim())
                .notificationType(NotificationType.WEATHER_ALERT)
                .build());
    }

    @Override
    @Transactional
    public NotificationResponse irrigationAlert(IrrigationAlertRequest request) {
        return send(NotificationRequest.builder()
                .farmerId(request.getFarmerId())
                .title("Irrigation alert")
                .message(request.getMessage().trim())
                .notificationType(NotificationType.IRRIGATION_ALERT)
                .build());
    }

    private boolean isDuplicateWithinWindow(Notification notification) {
        return notification.getCreatedAt().isAfter(Instant.now().minusSeconds(DUPLICATE_NOTIFICATION_WINDOW_SECONDS));
    }

    private static NotificationResponse map(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .farmerId(n.getFarmer().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .notificationType(n.getNotificationType())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
