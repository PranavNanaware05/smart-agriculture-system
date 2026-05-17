package com.smartagriculture.repository;

import com.smartagriculture.entity.WeatherRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {}
