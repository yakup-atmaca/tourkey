package com.tourkey.backend.dto;

public record PassengerDto(
    Long id,
    String fullName,
    String passportNo,
    String phone,
    String passengerType,
    String gender,
    String countryCode,
    String seatNumber
) {}
