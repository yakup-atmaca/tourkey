package com.tourkey.backend.dto;

public record CompanyDto(
    Long id,
    String name,
    String logoUrl,
    String taxOffice,
    String taxNumber,
    String address,
    String phone,
    String email,
    String subscriptionStatus,
    Boolean isActive,
    Boolean isAdmin
) {}
