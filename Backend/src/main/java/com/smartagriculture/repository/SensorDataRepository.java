package com.smartagriculture.repository;

import com.smartagriculture.entity.SensorData;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

    Optional<SensorData> findTopByFarmerIdOrderByRecordedAtDesc(Long farmerId);

    List<SensorData> findByFarmerIdOrderByRecordedAtDesc(Long farmerId);
}
