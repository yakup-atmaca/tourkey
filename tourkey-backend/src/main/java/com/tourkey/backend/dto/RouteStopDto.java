package com.tourkey.backend.dto;

public record RouteStopDto(
    Long id,
    String name,
    Integer sequence,
    Double lat,
    Double lng,
    String arrivalTime,
    String departureTime,
    String stopType
) {}
