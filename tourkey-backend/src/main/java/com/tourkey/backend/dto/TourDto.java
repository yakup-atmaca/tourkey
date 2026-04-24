package com.tourkey.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record TourDto(
    Long id,
    String name,
    String description,
    Long organizerCompanyId,
    String organizerCompanyName,
    BigDecimal basePrice,
    BigDecimal adultPrice,
    BigDecimal childPrice,
    BigDecimal babyPrice,
    BigDecimal guestPrice,
    String currency,
    Double startLat,
    Double startLng,
    Double endLat,
    Double endLng,
    Boolean isActive,
    List<RouteStopDto> routeStops,
    List<TourScheduleDto> schedules
) {}
