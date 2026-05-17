package com.smartagriculture.dto.irrigation;

import com.smartagriculture.entity.IrrigationStatus;
import com.smartagriculture.entity.MotorState;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class IrrigationResponse {
    Long id;
    Long farmerId;
    IrrigationStatus irrigationStatus;
    BigDecimal waterLevel;
    MotorState motorState;
    Instant irrigationDate;
}
