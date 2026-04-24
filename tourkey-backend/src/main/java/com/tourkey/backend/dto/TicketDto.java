package com.tourkey.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record TicketDto(
    Long id,
    String ticketNumber,
    Long sellerCompanyId,
    String sellerCompanyName,
    Long organizerCompanyId,
    String organizerCompanyName,
    Long tourScheduleId,
    String tourName,
    LocalDateTime scheduleDate,
    LocalDateTime saleDate,
    BigDecimal netTotal,
    BigDecimal commissionAmount,
    BigDecimal grossTotal,
    String currency,
    String status,
    String qrCodeData,
    String pickupLocation,
    String notes,
    List<PassengerDto> passengers
) {}
