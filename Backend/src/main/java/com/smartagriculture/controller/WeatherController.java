package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.weather.WeatherCurrentResponse;
import com.smartagriculture.dto.weather.WeatherHumidityResponse;
import com.smartagriculture.dto.weather.WeatherMetricsResponse;
import com.smartagriculture.dto.weather.WeatherRecordResponse;
import com.smartagriculture.dto.weather.WeatherSaveRequest;
import com.smartagriculture.dto.weather.WeatherTemperatureResponse;
import com.smartagriculture.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
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
@RequestMapping(ApiPaths.API_V1 + "/weather")
@Tag(name = "Weather")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/current")
    @Operation(summary = "Fetch current weather (Open-Meteo)")
    public ResponseEntity<WeatherCurrentResponse> current(
            @RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude) {
        return ResponseEntity.ok(weatherService.getCurrentWeather(latitude, longitude));
    }

    @GetMapping("/temperature")
    @Operation(summary = "Fetch temperature")
    public ResponseEntity<WeatherTemperatureResponse> temperature(
            @RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude) {
        return ResponseEntity.ok(weatherService.getTemperature(latitude, longitude));
    }

    @GetMapping("/humidity")
    @Operation(summary = "Fetch humidity")
    public ResponseEntity<WeatherHumidityResponse> humidity(
            @RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude) {
        return ResponseEntity.ok(weatherService.getHumidity(latitude, longitude));
    }

    @GetMapping("/metrics")
    @Operation(summary = "Fetch temperature and humidity together")
    public ResponseEntity<WeatherMetricsResponse> metrics(
            @RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude) {
        return ResponseEntity.ok(weatherService.getTemperatureHumidity(latitude, longitude));
    }

    @PostMapping("/save")
    @Operation(summary = "Fetch current weather and persist snapshot")
    public ResponseEntity<WeatherRecordResponse> save(@Valid @RequestBody WeatherSaveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(weatherService.save(request));
    }
}
