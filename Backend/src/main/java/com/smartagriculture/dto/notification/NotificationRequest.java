package com.smartagriculture.dto.notification;

import com.smartagriculture.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRequest {

    @NotNull
    private Long farmerId;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String message;

    @NotNull
    private NotificationType notificationType;
}
