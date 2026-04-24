package com.tourkey.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateTicketRequest(
    Long tourScheduleId,
    String pickupLocation,
    String notes,
    java.util.List<PassengerRequest> passengers
) {}
