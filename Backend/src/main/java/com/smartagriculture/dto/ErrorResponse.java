package com.smartagriculture.dto;

import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Singular;
import lombok.Value;

@Value
@Builder
public class ErrorResponse {
    Instant timestamp;
    int status;
    String error;
    String message;
    String path;

    @Singular("violation")
    List<FieldViolation> fieldErrors;

    @Value
    @Builder
    public static class FieldViolation {
        String field;
        String message;
    }
}
