package com.smartagriculture.service;

import com.smartagriculture.dto.notification.IrrigationAlertRequest;
import com.smartagriculture.dto.notification.LowSoilMoistureAlertRequest;
import com.smartagriculture.dto.notification.NotificationRequest;
import com.smartagriculture.dto.notification.NotificationResponse;
import com.smartagriculture.dto.notification.WeatherAlertRequest;
import java.util.List;

public interface NotificationService {

    NotificationResponse send(NotificationRequest request);

    List<NotificationResponse> listForFarmer(Long farmerId);

    NotificationResponse lowSoilMoistureAlert(LowSoilMoistureAlertRequest request);

    NotificationResponse weatherAlert(WeatherAlertRequest request);

    NotificationResponse irrigationAlert(IrrigationAlertRequest request);
}
