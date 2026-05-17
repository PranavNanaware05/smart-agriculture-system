package com.smartagriculture.service;

import com.smartagriculture.dto.farmer.FarmerRequest;
import com.smartagriculture.dto.farmer.FarmerResponse;
import java.util.List;

public interface FarmerService {

    FarmerResponse create(FarmerRequest request);

    FarmerResponse update(Long id, FarmerRequest request);

    void delete(Long id);

    FarmerResponse getById(Long id);

    List<FarmerResponse> findAll();
}
