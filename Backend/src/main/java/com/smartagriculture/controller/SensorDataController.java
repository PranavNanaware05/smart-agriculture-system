package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.sensor.SensorDataRequest;
import com.smartagriculture.dto.sensor.SensorDataResponse;
import com.smartagriculture.service.SensorDataService;
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
@RequestMapping(ApiPaths.API_V1 + "/sensor-data")
@Tag(name = "Sensor data")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class SensorDataController {

    private final SensorDataService sensorDataService;

    @PostMapping
    @Operation(summary = "Add sensor reading")
    public ResponseEntity<SensorDataResponse> add(@Valid @RequestBody SensorDataRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sensorDataService.add(request));
    }

    @GetMapping("/latest")
    @Operation(summary = "Latest sensor reading for farmer")
    public ResponseEntity<SensorDataResponse> latest(@RequestParam Long farmerId) {
        return ResponseEntity.ok(sensorDataService.getLatest(farmerId));
    }

    @GetMapping
    @Operation(summary = "All sensor readings for farmer")
    public ResponseEntity<List<SensorDataResponse>> list(@RequestParam Long farmerId) {
        return ResponseEntity.ok(sensorDataService.findAllForFarmer(farmerId));
    }
}
