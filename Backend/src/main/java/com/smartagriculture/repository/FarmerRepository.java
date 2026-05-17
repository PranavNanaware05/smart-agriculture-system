package com.smartagriculture.repository;

import com.smartagriculture.entity.Farmer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    Optional<Farmer> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
