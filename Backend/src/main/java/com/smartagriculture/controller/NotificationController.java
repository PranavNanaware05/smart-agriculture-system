package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.notification.IrrigationAlertRequest;
import com.smartagriculture.dto.notification.LowSoilMoistureAlertRequest;
import com.smartagriculture.dto.notification.NotificationRequest;
import com.smartagriculture.dto.notification.NotificationResponse;
import com.smartagriculture.dto.notification.WeatherAlertRequest;
import com.smartagriculture.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_V1 + "/notifications")
@Tag(name = "Notifications")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    @Operation(summary = "Send notification to a farmer")
    public ResponseEntity<NotificationResponse> send(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.send(request));
    }

    @GetMapping
    @Operation(summary = "List notifications for a farmer")
    public ResponseEntity<List<NotificationResponse>> list(@RequestParam Long farmerId) {
        return ResponseEntity.ok(notificationService.listForFarmer(farmerId));
    }

    @PostMapping("/alerts/low-soil-moisture")
    @Operation(summary = "Create low soil moisture alert when moisture is below threshold")
    public ResponseEntity<NotificationResponse> lowSoilMoisture(@Valid @RequestBody LowSoilMoistureAlertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.lowSoilMoistureAlert(request));
    }

    @PostMapping("/alerts/weather")
    @Operation(summary = "Create weather alert")
    public ResponseEntity<NotificationResponse> weatherAlert(@Valid @RequestBody WeatherAlertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.weatherAlert(request));
    }

    @PostMapping("/alerts/irrigation")
    @Operation(summary = "Create irrigation alert")
    public ResponseEntity<NotificationResponse> irrigationAlert(@Valid @RequestBody IrrigationAlertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.irrigationAlert(request));
    }
}
