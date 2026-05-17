package com.smartagriculture.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "irrigation_events")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Irrigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private IrrigationStatus irrigationStatus;

    @Column(precision = 10, scale = 2)
    private BigDecimal waterLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private MotorState motorState;

    @Column(nullable = false, updatable = false)
    private Instant irrigationDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @PrePersist
    void onCreate() {
        if (irrigationDate == null) {
            irrigationDate = Instant.now();
        }
    }
}
