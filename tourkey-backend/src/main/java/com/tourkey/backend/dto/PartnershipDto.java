package com.tourkey.backend.dto;

import java.math.BigDecimal;

public record PartnershipDto(
    Long id,
    Long requesterCompanyId,
    String requesterCompanyName,
    Long recipientCompanyId,
    String recipientCompanyName,
    String status,
    Boolean isBidirectional,
    PricingPolicyDto pricingPolicy
) {}
