package com.smartagriculture.service.impl;

import com.smartagriculture.dto.crop.CropRequest;
import com.smartagriculture.dto.crop.CropResponse;
import com.smartagriculture.entity.Crop;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.CropRepository;
import com.smartagriculture.service.CropService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    @Override
    @Transactional
    public CropResponse create(CropRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        Crop crop = Crop.builder()
                .cropName(request.getCropName().trim())
                .cropType(request.getCropType().trim())
                .sowingDate(request.getSowingDate())
                .harvestingDate(request.getHarvestingDate())
                .cropStatus(request.getCropStatus())
                .farmer(farmer)
                .build();
        cropRepository.save(crop);
        return map(crop);
    }

    @Override
    @Transactional
    public CropResponse update(Long id, CropRequest request) {
        User user = securityUtils.currentUser();
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Crop not found"));
        accessHelper.requireAccessibleFarmer(user, crop.getFarmer().getId());
        accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, request.getFarmerId());
        crop.setFarmer(farmer);
        crop.setCropName(request.getCropName().trim());
        crop.setCropType(request.getCropType().trim());
        crop.setSowingDate(request.getSowingDate());
        crop.setHarvestingDate(request.getHarvestingDate());
        crop.setCropStatus(request.getCropStatus());
        return map(crop);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = securityUtils.currentUser();
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Crop not found"));
        accessHelper.requireAccessibleFarmer(user, crop.getFarmer().getId());
        cropRepository.delete(crop);
    }

    @Override
    @Transactional(readOnly = true)
    public CropResponse getById(Long id) {
        User user = securityUtils.currentUser();
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Crop not found"));
        accessHelper.requireAccessibleFarmer(user, crop.getFarmer().getId());
        return map(crop);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CropResponse> findByFarmer(Long farmerId) {
        User user = securityUtils.currentUser();
        accessHelper.requireAccessibleFarmer(user, farmerId);
        return cropRepository.findByFarmerIdOrderBySowingDateDesc(farmerId).stream().map(CropServiceImpl::map).toList();
    }

    private static CropResponse map(Crop c) {
        return CropResponse.builder()
                .id(c.getId())
                .farmerId(c.getFarmer().getId())
                .cropName(c.getCropName())
                .cropType(c.getCropType())
                .sowingDate(c.getSowingDate())
                .harvestingDate(c.getHarvestingDate())
                .cropStatus(c.getCropStatus())
                .build();
    }
}
