package com.smartagriculture.service.impl;

import com.smartagriculture.dto.irrigation.IrrigationControlRequest;
import com.smartagriculture.dto.irrigation.IrrigationResponse;
import com.smartagriculture.dto.notification.NotificationRequest;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.Irrigation;
import com.smartagriculture.entity.IrrigationStatus;
import com.smartagriculture.entity.MotorState;
import com.smartagriculture.entity.NotificationType;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.BadRequestException;
import com.smartagriculture.repository.IrrigationRepository;
import com.smartagriculture.service.IrrigationService;
import com.smartagriculture.service.NotificationService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IrrigationServiceImpl implements IrrigationService {

    private final IrrigationRepository irrigationRepository;
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;
    private final FarmerAccessHelper accessHelper;

    @Override
    @Transactional
    public IrrigationResponse start(Long farmerId, IrrigationControlRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, farmerId);
        boolean running = irrigationRepository
                .findTopByFarmerIdAndIrrigationStatusOrderByIrrigationDateDesc(farmerId, IrrigationStatus.RUNNING)
                .isPresent();
        if (running) {
            throw new BadRequestException("Irrigation is already running for this farmer");
        }
        BigDecimal water = request != null ? request.getWaterLevel() : null;
        Irrigation row = Irrigation.builder()
                .irrigationStatus(IrrigationStatus.RUNNING)
                .motorState(MotorState.ON)
                .waterLevel(water)
                .farmer(farmer)
                .build();
        irrigationRepository.save(row);
        notificationService.send(NotificationRequest.builder()
                .farmerId(farmerId)
                .notificationType(NotificationType.IRRIGATION_ALERT)
                .title("Irrigation started")
                .message("Irrigation started.")
                .build());
        return map(row);
    }

    @Override
    @Transactional
    public IrrigationResponse stop(Long farmerId, IrrigationControlRequest request) {
        User user = securityUtils.currentUser();
        Farmer farmer = accessHelper.requireAccessibleFarmer(user, farmerId);
        Irrigation row = irrigationRepository
                .findTopByFarmerIdAndIrrigationStatusOrderByIrrigationDateDesc(farmerId, IrrigationStatus.RUNNING)
                .orElseThrow(() -> new BadRequestException("No active irrigation session for this farmer"));
        BigDecimal water = request != null ? request.getWaterLevel() : null;
        if (water != null) {
            row.setWaterLevel(water);
        }
        row.setIrrigationStatus(IrrigationStatus.STOPPED);
        row.setMotorState(MotorState.OFF);
        irrigationRepository.save(row);
        notificationService.send(NotificationRequest.builder()
                .farmerId(farmerId)
                .notificationType(NotificationType.IRRIGATION_ALERT)
                .title("Irrigation stopped")
                .message("Irrigation stopped.")
                .build());
        return map(row);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IrrigationResponse> history(Long farmerId) {
        User user = securityUtils.currentUser();
        accessHelper.requireAccessibleFarmer(user, farmerId);
        return irrigationRepository.findByFarmerIdOrderByIrrigationDateDesc(farmerId).stream()
                .map(IrrigationServiceImpl::map)
                .toList();
    }

    private static IrrigationResponse map(Irrigation i) {
        return IrrigationResponse.builder()
                .id(i.getId())
                .farmerId(i.getFarmer().getId())
                .irrigationStatus(i.getIrrigationStatus())
                .waterLevel(i.getWaterLevel())
                .motorState(i.getMotorState())
                .irrigationDate(i.getIrrigationDate())
                .build();
    }
}
