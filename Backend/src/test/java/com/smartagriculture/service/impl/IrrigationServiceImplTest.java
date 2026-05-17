package com.smartagriculture.service.impl;

import com.smartagriculture.dto.irrigation.IrrigationControlRequest;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.Irrigation;
import com.smartagriculture.entity.IrrigationStatus;
import com.smartagriculture.entity.MotorState;
import com.smartagriculture.entity.User;
import com.smartagriculture.repository.IrrigationRepository;
import com.smartagriculture.service.NotificationService;
import com.smartagriculture.util.FarmerAccessHelper;
import com.smartagriculture.util.SecurityUtils;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class IrrigationServiceImplTest {

    @Mock
    private IrrigationRepository irrigationRepository;

    @Mock
    private SecurityUtils securityUtils;

    @Mock
    private FarmerAccessHelper accessHelper;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private IrrigationServiceImpl irrigationService;

    @Captor
    private ArgumentCaptor<Irrigation> irrigationCaptor;

    @Test
    void stopShouldUpdateRunningIrrigationRecord() {
        User user = new User();
        Farmer farmer = new Farmer();
        farmer.setId(42L);

        Irrigation runningIrrigation = Irrigation.builder()
                .id(100L)
                .irrigationStatus(IrrigationStatus.RUNNING)
                .motorState(MotorState.ON)
                .waterLevel(BigDecimal.valueOf(123))
                .farmer(farmer)
                .irrigationDate(Instant.now())
                .build();

        given(securityUtils.currentUser()).willReturn(user);
        given(accessHelper.requireAccessibleFarmer(user, 42L)).willReturn(farmer);
        given(irrigationRepository.findTopByFarmerIdAndIrrigationStatusOrderByIrrigationDateDesc(
                42L, IrrigationStatus.RUNNING))
                .willReturn(Optional.of(runningIrrigation));

        IrrigationControlRequest request = new IrrigationControlRequest();
        request.setWaterLevel(BigDecimal.valueOf(200));

        irrigationService.stop(42L, request);

        verify(irrigationRepository).save(irrigationCaptor.capture());
        verify(notificationService).send(org.mockito.ArgumentMatchers.any());
        Irrigation saved = irrigationCaptor.getValue();

        assertThat(saved).isSameAs(runningIrrigation);
        assertThat(saved.getIrrigationStatus()).isEqualTo(IrrigationStatus.STOPPED);
        assertThat(saved.getMotorState()).isEqualTo(MotorState.OFF);
        assertThat(saved.getWaterLevel()).isEqualByComparingTo(BigDecimal.valueOf(200));
    }
}
