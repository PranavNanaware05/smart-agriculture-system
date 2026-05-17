package com.smartagriculture.repository;

import com.smartagriculture.entity.Irrigation;
import com.smartagriculture.entity.IrrigationStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IrrigationRepository extends JpaRepository<Irrigation, Long> {

    Optional<Irrigation> findTopByFarmerIdOrderByIrrigationDateDesc(Long farmerId);

    Optional<Irrigation> findTopByFarmerIdAndIrrigationStatusOrderByIrrigationDateDesc(
            Long farmerId, IrrigationStatus status);

    List<Irrigation> findByFarmerIdOrderByIrrigationDateDesc(Long farmerId);
}
