package com.smartagriculture.dto.crop;

import com.smartagriculture.entity.CropStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CropRequest {

    @NotNull
    private Long farmerId;

    @NotBlank
    @Size(max = 120)
    private String cropName;

    @NotBlank
    @Size(max = 80)
    private String cropType;

    @NotNull
    private LocalDate sowingDate;

    private LocalDate harvestingDate;

    @NotNull
    private CropStatus cropStatus;
}
