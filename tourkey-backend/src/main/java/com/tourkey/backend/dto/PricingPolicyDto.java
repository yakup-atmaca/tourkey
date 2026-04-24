package com.tourkey.backend.dto;

import java.math.BigDecimal;

public record PricingPolicyDto(
    Long id,
    String policyType,
    BigDecimal commissionRate,
    BigDecimal fixedMarkup,
    String currency
) {}
