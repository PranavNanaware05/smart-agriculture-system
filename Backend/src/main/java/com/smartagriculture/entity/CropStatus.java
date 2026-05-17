package com.smartagriculture.entity;

/** Lifecycle state for a crop field. */
public enum CropStatus {
    PLANNED,
    SOWING,
    GROWING,
    READY_TO_HARVEST,
    HARVESTED,
    FAILED
}
