package com.smartagriculture.service;

import com.smartagriculture.dto.weather.WeatherCurrentResponse;
import com.smartagriculture.dto.weather.WeatherHumidityResponse;
import com.smartagriculture.dto.weather.WeatherMetricsResponse;
import com.smartagriculture.dto.weather.WeatherRecordResponse;
import com.smartagriculture.dto.weather.WeatherSaveRequest;
import com.smartagriculture.dto.weather.WeatherTemperatureResponse;
import java.math.BigDecimal;

public interface WeatherService {

    WeatherCurrentResponse getCurrentWeather(BigDecimal latitude, BigDecimal longitude);

    WeatherTemperatureResponse getTemperature(BigDecimal latitude, BigDecimal longitude);

    WeatherHumidityResponse getHumidity(BigDecimal latitude, BigDecimal longitude);

    WeatherMetricsResponse getTemperatureHumidity(BigDecimal latitude, BigDecimal longitude);

    WeatherRecordResponse save(WeatherSaveRequest request);
}
