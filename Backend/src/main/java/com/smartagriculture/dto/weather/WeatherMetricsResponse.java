package com.smartagriculture.dto.weather;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class WeatherMetricsResponse {
    BigDecimal temperatureC;
    BigDecimal humidityPercent;
}
