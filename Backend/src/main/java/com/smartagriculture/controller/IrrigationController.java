package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.irrigation.IrrigationControlRequest;
import com.smartagriculture.dto.irrigation.IrrigationResponse;
import com.smartagriculture.service.IrrigationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_V1 + "/irrigation")
@Tag(name = "Irrigation")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class IrrigationController {

    private final IrrigationService irrigationService;

    @PostMapping("/farmers/{farmerId}/start")
    @Operation(summary = "Start irrigation")
    public ResponseEntity<IrrigationResponse> start(
            @PathVariable Long farmerId, @RequestBody(required = false) IrrigationControlRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(irrigationService.start(farmerId, request));
    }

    @PostMapping("/farmers/{farmerId}/stop")
    @Operation(summary = "Stop irrigation")
    public ResponseEntity<IrrigationResponse> stop(
            @PathVariable Long farmerId, @RequestBody(required = false) IrrigationControlRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(irrigationService.stop(farmerId, request));
    }

    @GetMapping("/farmers/{farmerId}/history")
    @Operation(summary = "Irrigation history")
    public ResponseEntity<List<IrrigationResponse>> history(@PathVariable Long farmerId) {
        return ResponseEntity.ok(irrigationService.history(farmerId));
    }
}
