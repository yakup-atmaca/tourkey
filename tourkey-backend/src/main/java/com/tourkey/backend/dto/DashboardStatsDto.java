package com.tourkey.backend.dto;

import java.math.BigDecimal;

public record DashboardStatsDto(
    Long totalSales,
    BigDecimal totalRevenue,
    Long ownTourSales,
    BigDecimal ownTourRevenue,
    Long partnerTourSales,
    BigDecimal partnerTourRevenue,
    Long pendingPartnerships,
    Long activePartnerships
) {}
