package com.smartagriculture.dto.sensor;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SensorDataResponse {
    Long id;
    Long farmerId;
    BigDecimal temperature;
    BigDecimal humidity;
    BigDecimal soilMoisture;
    Instant recordedAt;
}
