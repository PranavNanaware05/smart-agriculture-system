package com.smartagriculture.dto.irrigation;

import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IrrigationControlRequest {

    /** Optional tank / line level when starting or stopping. */
    @DecimalMin("0.0")
    private BigDecimal waterLevel;
}