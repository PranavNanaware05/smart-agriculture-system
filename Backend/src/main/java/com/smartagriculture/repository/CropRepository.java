package com.smartagriculture.repository;

import com.smartagriculture.entity.Crop;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByFarmerIdOrderBySowingDateDesc(Long farmerId);
}
