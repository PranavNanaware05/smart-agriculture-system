package com.smartagriculture.service.impl;

import com.smartagriculture.dto.notification.NotificationRequest;
import com.smartagriculture.dto.sensor.SensorDataRequest;
import com.smartagriculture.dto.sensor.SensorDataResponse;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.NotificationType;
import com.smartagriculture.entity.SensorData;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.SensorDataRepository;
import com.smartagriculture.service.NotificationService;
import com.smartagriculture.service.SensorDataService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SensorDataServiceImpl implements SensorDataService {

    private final SensorDataRepository sensorDataRepository;
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    @Override
    @Transactional
    public SensorDataResponse add(SensorDataRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        SensorData row = SensorData.builder()
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .soilMoisture(request.getSoilMoisture())
                .farmer(farmer)
                .build();
        sensorDataRepository.save(row);
        createSensorNotifications(row);
        return map(row);
    }

    private void createSensorNotifications(SensorData data) {
        if (data.getSoilMoisture().compareTo(BigDecimal.valueOf(30)) < 0) {
            notificationService.send(NotificationRequest.builder()
                    .farmerId(data.getFarmer().getId())
                    .notificationType(NotificationType.LOW_SOIL_MOISTURE)
                    .title("Low Soil Moisture")
                    .message("Low Soil Moisture - Irrigation required.")
                    .build());
        }

        if (data.getTemperature().compareTo(BigDecimal.valueOf(40)) > 0) {
            notificationService.send(NotificationRequest.builder()
                    .farmerId(data.getFarmer().getId())
                    .notificationType(NotificationType.HIGH_TEMPERATURE_ALERT)
                    .title("High Temperature Alert")
                    .message("High Temperature Alert.")
                    .build());
        }

        if (data.getHumidity().compareTo(BigDecimal.valueOf(20)) < 0) {
            notificationService.send(NotificationRequest.builder()
                    .farmerId(data.getFarmer().getId())
                    .notificationType(NotificationType.LOW_HUMIDITY_ALERT)
                    .title("Low Humidity Alert")
                    .message("Low Humidity Alert.")
                    .build());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public SensorDataResponse getLatest(Long farmerId) {
        User user = securityUtils.currentUser();
        accessHelper.requireAccessibleFarmer(user, farmerId);
        SensorData row = sensorDataRepository
                .findTopByFarmerIdOrderByRecordedAtDesc(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("No sensor data for this farmer"));
        return map(row);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SensorDataResponse> findAllForFarmer(Long farmerId) {
        User user = securityUtils.currentUser();
        accessHelper.requireAccessibleFarmer(user, farmerId);
        return sensorDataRepository.findByFarmerIdOrderByRecordedAtDesc(farmerId).stream()
                .map(SensorDataServiceImpl::map)
                .toList();
    }

    private static SensorDataResponse map(SensorData s) {
        return SensorDataResponse.builder()
                .id(s.getId())
                .farmerId(s.getFarmer().getId())
                .temperature(s.getTemperature())
                .humidity(s.getHumidity())
                .soilMoisture(s.getSoilMoisture())
                .recordedAt(s.getRecordedAt())
                .build();
    }
}
