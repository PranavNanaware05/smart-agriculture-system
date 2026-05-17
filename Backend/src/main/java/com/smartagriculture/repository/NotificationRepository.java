package com.smartagriculture.repository;

import com.smartagriculture.entity.Notification;
import com.smartagriculture.entity.NotificationType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    Optional<Notification> findTopByFarmerIdAndNotificationTypeAndTitleAndMessageOrderByCreatedAtDesc(
            Long farmerId, NotificationType notificationType, String title, String message);
}
