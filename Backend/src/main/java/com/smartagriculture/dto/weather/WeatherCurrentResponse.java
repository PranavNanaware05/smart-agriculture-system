package com.smartagriculture.dto.weather;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class WeatherCurrentResponse {
    BigDecimal latitude;
    BigDecimal longitude;
    BigDecimal temperatureC;
    BigDecimal humidityPercent;
    String summary;
    Instant fetchedAt;
}
