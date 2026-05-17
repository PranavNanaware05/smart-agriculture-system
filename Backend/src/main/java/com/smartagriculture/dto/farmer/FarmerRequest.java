package com.smartagriculture.dto.farmer;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmerRequest {

    /** Required when an ADMIN creates a farmer for another user account. Ignored for FARMER self-service. */
    private Long userId;

    @NotBlank
    @Size(max = 160)
    private String farmerName;

    @NotBlank
    @Size(max = 120)
    private String village;

    @NotBlank
    @Size(max = 120)
    private String district;

    @NotBlank
    @Size(max = 120)
    private String state;

    @NotNull
    @DecimalMin(value = "0.01", message = "landArea must be greater than zero")
    private BigDecimal landArea;

    @NotBlank
    @Size(max = 80)
    private String soilType;
}
