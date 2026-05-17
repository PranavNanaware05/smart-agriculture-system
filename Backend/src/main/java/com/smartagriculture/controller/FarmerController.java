package com.smartagriculture.controller;

import com.smartagriculture.constants.ApiPaths;
import com.smartagriculture.dto.farmer.FarmerRequest;
import com.smartagriculture.dto.farmer.FarmerResponse;
import com.smartagriculture.service.FarmerService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_V1 + "/farmers")
@Tag(name = "Farmers")
@SecurityRequirement(name = "bearer-jwt")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;

    @PostMapping
    @Operation(summary = "Create farmer profile (FARMER: self; ADMIN: requires userId)")
    public ResponseEntity<FarmerResponse> create(@Valid @RequestBody FarmerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(farmerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update farmer")
    public ResponseEntity<FarmerResponse> update(@PathVariable Long id, @Valid @RequestBody FarmerRequest request) {
        return ResponseEntity.ok(farmerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete farmer")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        farmerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get farmer by id")
    public ResponseEntity<FarmerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(farmerService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all farmers (ADMIN only)")
    public ResponseEntity<List<FarmerResponse>> listAll() {
        return ResponseEntity.ok(farmerService.findAll());
    }
}
