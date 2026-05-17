package com.smartagriculture.service;

import com.smartagriculture.dto.crop.CropRequest;
import com.smartagriculture.dto.crop.CropResponse;
import java.util.List;

public interface CropService {

    CropResponse create(CropRequest request);

    CropResponse update(Long id, CropRequest request);

    void delete(Long id);

    CropResponse getById(Long id);

    List<CropResponse> findByFarmer(Long farmerId);
}
