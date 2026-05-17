package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.crop.CropRequest;
import com.smartagriculture.dto.crop.CropResponse;
import com.smartagriculture.service.CropService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_V1 + "/crops")
@Tag(name = "Crops")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @PostMapping
    @Operation(summary = "Add crop")
    public ResponseEntity<CropResponse> create(@Valid @RequestBody CropRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cropService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update crop")
    public ResponseEntity<CropResponse> update(@PathVariable Long id, @Valid @RequestBody CropRequest request) {
        return ResponseEntity.ok(cropService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete crop")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cropService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get crop by id")
    public ResponseEntity<CropResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getById(id));
    }

    @GetMapping
    @Operation(summary = "Get all crops for a farmer")
    public ResponseEntity<List<CropResponse>> listByFarmer(@RequestParam Long farmerId) {
        return ResponseEntity.ok(cropService.findByFarmer(farmerId));
    }
}
