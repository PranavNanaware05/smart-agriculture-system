package com.smartagriculture.dto.crop;

import com.smartagriculture.entity.CropStatus;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CropResponse {
    Long id;
    Long farmerId;
    String cropName;
    String cropType;
    LocalDate sowingDate;
    LocalDate harvestingDate;
    CropStatus cropStatus;
}
