package com.smartagriculture.service.impl;

import com.smartagriculture.client.WeatherApiClient;
import com.smartagriculture.client.WeatherApiClient.CurrentWeatherPayload;
import com.smartagriculture.dto.weather.WeatherCurrentResponse;
import com.smartagriculture.dto.weather.WeatherHumidityResponse;
import com.smartagriculture.dto.weather.WeatherMetricsResponse;
import com.smartagriculture.dto.weather.WeatherRecordResponse;
import com.smartagriculture.dto.weather.WeatherSaveRequest;
import com.smartagriculture.dto.weather.WeatherTemperatureResponse;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.User;
import com.smartagriculture.entity.WeatherRecord;
import com.smartagriculture.repository.WeatherRecordRepository;
import com.smartagriculture.service.WeatherService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final WeatherApiClient weatherApiClient;
    private final WeatherRecordRepository weatherRecordRepository;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    @Override
    @Transactional(readOnly = true)
    public WeatherCurrentResponse getCurrentWeather(BigDecimal latitude, BigDecimal longitude) {
        CurrentWeatherPayload p = weatherApiClient.fetchCurrent(latitude, longitude);
        return toCurrent(p);
    }

    @Override
    @Transactional(readOnly = true)
    public WeatherTemperatureResponse getTemperature(BigDecimal latitude, BigDecimal longitude) {
        CurrentWeatherPayload p = weatherApiClient.fetchCurrent(latitude, longitude);
        return WeatherTemperatureResponse.builder().temperatureC(p.temperatureC()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public WeatherHumidityResponse getHumidity(BigDecimal latitude, BigDecimal longitude) {
        CurrentWeatherPayload p = weatherApiClient.fetchCurrent(latitude, longitude);
        return WeatherHumidityResponse.builder().humidityPercent(p.humidityPercent()).build();
    }

    @Override
    @Transactional(readOnly = true)
    public WeatherMetricsResponse getTemperatureHumidity(BigDecimal latitude, BigDecimal longitude) {
        CurrentWeatherPayload p = weatherApiClient.fetchCurrent(latitude, longitude);
        return WeatherMetricsResponse.builder()
                .temperatureC(p.temperatureC())
                .humidityPercent(p.humidityPercent())
                .build();
    }

    @Override
    @Transactional
    public WeatherRecordResponse save(WeatherSaveRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = null;
        if (request.getFarmerId() != null) {
            farmer = accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        }
        CurrentWeatherPayload p = weatherApiClient.fetchCurrent(request.getLatitude(), request.getLongitude());
        WeatherRecord rec = WeatherRecord.builder()
                .latitude(p.latitude())
                .longitude(p.longitude())
                .temperatureC(p.temperatureC())
                .humidityPercent(p.humidityPercent())
                .summary(p.summary())
                .rawJson(p.rawJson())
                .farmer(farmer)
                .build();
        weatherRecordRepository.save(rec);
        return mapRecord(rec);
    }

    private static WeatherCurrentResponse toCurrent(CurrentWeatherPayload p) {
        return WeatherCurrentResponse.builder()
                .latitude(p.latitude())
                .longitude(p.longitude())
                .temperatureC(p.temperatureC())
                .humidityPercent(p.humidityPercent())
                .summary(p.summary())
                .fetchedAt(p.fetchedAt())
                .build();
    }

    private static WeatherRecordResponse mapRecord(WeatherRecord r) {
        return WeatherRecordResponse.builder()
                .id(r.getId())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .temperatureC(r.getTemperatureC())
                .humidityPercent(r.getHumidityPercent())
                .summary(r.getSummary())
                .farmerId(r.getFarmer() != null ? r.getFarmer().getId() : null)
                .fetchedAt(r.getFetchedAt())
                .build();
    }
}
