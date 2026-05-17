package com.smartagriculture.dto.farmer;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FarmerResponse {
    Long id;
    Long userId;
    String farmerName;
    String village;
    String district;
    String state;
    BigDecimal landArea;
    String soilType;
}
