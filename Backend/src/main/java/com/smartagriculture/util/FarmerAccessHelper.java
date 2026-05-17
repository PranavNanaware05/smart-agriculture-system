package com.smartagriculture.util;

import com.smartagriculture.entity.Farmer;
import com.smartagriculture.entity.Role;
import com.smartagriculture.entity.User;
import com.smartagriculture.exception.ForbiddenException;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class FarmerAccessHelper {

    private final FarmerRepository farmerRepository;

    @Transactional(readOnly = true)
    public Farmer requireFarmerForUser(User user) {
        return farmerRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for this user"));
    }

    /** Ensures the caller may act on the given farmer id (ADMIN any; FARMER only own). */
    @Transactional(readOnly = true)
    public Farmer requireAccessibleFarmer(User user, Long farmerId) {
        Farmer farmer = farmerRepository
                .findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        if (user.getRole() == Role.ADMIN) {
            return farmer;
        }
        if (user.getRole() == Role.FARMER) {
            if (!farmer.getUser().getId().equals(user.getId())) {
                throw new ForbiddenException("You can only access your own farmer account");
            }
            return farmer;
        }
        throw new ForbiddenException();
    }
}
