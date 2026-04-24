package com.tourkey.backend.controller;

import com.tourkey.backend.dto.DashboardStatsDto;
import com.tourkey.backend.service.DashboardService;
import com.tourkey.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> stats(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(dashboardService.getStats(user.getCompanyId()));
    }
}
