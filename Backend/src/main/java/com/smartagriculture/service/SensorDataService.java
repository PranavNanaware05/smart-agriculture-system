package com.smartagriculture.service;

import com.smartagriculture.dto.sensor.SensorDataRequest;
import com.smartagriculture.dto.sensor.SensorDataResponse;
import java.util.List;

public interface SensorDataService {

    SensorDataResponse add(SensorDataRequest request);

    SensorDataResponse getLatest(Long farmerId);

    List<SensorDataResponse> findAllForFarmer(Long farmerId);
}
