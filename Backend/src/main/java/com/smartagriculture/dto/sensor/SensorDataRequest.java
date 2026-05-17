package com.smartagriculture.dto.sensor;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SensorDataRequest {

    @NotNull
    private Long farmerId;

    @NotNull
    @DecimalMin("-50.0")
    @DecimalMax("60.0")
    private BigDecimal temperature;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal humidity;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal soilMoisture;
}
