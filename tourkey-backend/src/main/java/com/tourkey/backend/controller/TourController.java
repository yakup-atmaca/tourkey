package com.tourkey.backend.controller;

import com.tourkey.backend.dto.TourDto;
import com.tourkey.backend.service.TourService;
import com.tourkey.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @PostMapping
    public ResponseEntity<TourDto> create(@AuthenticationPrincipal CustomUserDetails user, @RequestBody TourDto dto) {
        return ResponseEntity.ok(tourService.createTour(user.getCompanyId(), dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TourDto>> myTours(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(tourService.getCompanyTours(user.getCompanyId()));
    }

    @GetMapping("/marketplace")
    public ResponseEntity<List<TourDto>> marketplace(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(tourService.getAvailableToursForSale(user.getCompanyId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTour(id));
    }
}
