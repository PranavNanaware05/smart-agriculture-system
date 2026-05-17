package com.smartagriculture.dto.notification;

import com.smartagriculture.entity.NotificationType;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class NotificationResponse {
    Long id;
    Long farmerId;
    String title;
    String message;
    NotificationType notificationType;
    Instant createdAt;
}
