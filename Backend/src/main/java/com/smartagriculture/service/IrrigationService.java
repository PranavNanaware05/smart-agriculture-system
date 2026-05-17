package com.smartagriculture.service;

import com.smartagriculture.dto.irrigation.IrrigationControlRequest;
import com.smartagriculture.dto.irrigation.IrrigationResponse;
import java.util.List;

public interface IrrigationService {

    IrrigationResponse start(Long farmerId, IrrigationControlRequest request);

    IrrigationResponse stop(Long farmerId, IrrigationControlRequest request);

    List<IrrigationResponse> history(Long farmerId);
}
