package com.smartagriculture.service.impl;

import com.smartagriculture.dto.farmer.FarmerRequest;
import com.smartagriculture.dto.farmer.FarmerResponse;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.Role;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.BadRequestException;
import com.smartagriculture.exception.ConflictException;
import com.smartagriculture.exception.ForbiddenException;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.FarmerRepository;
import com.smartagriculture.repository.UserRepository;
import com.smartagriculture.service.FarmerService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerServiceImpl implements FarmerService {

    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    @Override
    @Transactional
    public FarmerResponse create(FarmerRequest request) {
        User actor = securityUtils.currentUser();
        Long targetUserId = resolveTargetUserId(actor, request.getUserId());
        User user = userRepository.findById(targetUserId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != Role.FARMER) {
            throw new BadRequestException("Farmer profile can only be linked to users with role FARMER");
        }
        if (farmerRepository.existsByUserId(targetUserId)) {
            throw new ConflictException("Farmer profile already exists for this user");
        }
        Farmer farmer = Farmer.builder()
                .farmerName(request.getFarmerName().trim())
                .village(request.getVillage().trim())
                .district(request.getDistrict().trim())
                .state(request.getState().trim())
                .landArea(request.getLandArea())
                .soilType(request.getSoilType().trim())
                .user(user)
                .build();
        farmerRepository.save(farmer);
        return map(farmer);
    }

    private Long resolveTargetUserId(User actor, Long userIdFromRequest) {
        if (actor.getRole() == Role.ADMIN) {
            if (userIdFromRequest == null) {
                throw new BadRequestException("userId is required when an administrator creates a farmer");
            }
            return userIdFromRequest;
        }
        return actor.getId();
    }

    @Override
    @Transactional
    public FarmerResponse update(Long id, FarmerRequest request) {
        User actor = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(actor, id);
        farmer.setFarmerName(request.getFarmerName().trim());
        farmer.setVillage(request.getVillage().trim());
        farmer.setDistrict(request.getDistrict().trim());
        farmer.setState(request.getState().trim());
        farmer.setLandArea(request.getLandArea());
        farmer.setSoilType(request.getSoilType().trim());
        return map(farmer);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User actor = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(actor, id);
        farmerRepository.delete(farmer);
    }

    @Override
    @Transactional(readOnly = true)
    public FarmerResponse getById(Long id) {
        User actor = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(actor, id);
        return map(farmer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FarmerResponse> findAll() {
        User actor = securityUtils.currentUser();
        if (actor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only administrators can list all farmers");
        }
        return farmerRepository.findAll().stream().map(FarmerServiceImpl::map).toList();
    }

    private static FarmerResponse map(Farmer f) {
        return FarmerResponse.builder()
                .id(f.getId())
                .userId(f.getUser().getId())
                .farmerName(f.getFarmerName())
                .village(f.getVillage())
                .district(f.getDistrict())
                .state(f.getState())
                .landArea(f.getLandArea())
                .soilType(f.getSoilType())
                .build();
    }
}
