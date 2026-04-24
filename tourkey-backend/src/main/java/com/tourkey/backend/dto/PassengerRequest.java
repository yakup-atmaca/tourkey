package com.tourkey.backend.dto;

public record PassengerRequest(
    String fullName,
    String passportNo,
    String phone,
    String passengerType,
    String gender,
    String countryCode,
    String seatNumber
) {}
