package com.tourkey.backend.dto;

import java.time.LocalDate;

public record TourScheduleDto(
    Long id,
    LocalDate scheduleDate,
    String departureTime,
    String status,
    Integer capacity,
    Integer soldSeats
) {}
