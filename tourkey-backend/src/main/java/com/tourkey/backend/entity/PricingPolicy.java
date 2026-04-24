package com.tourkey.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pricing_policies")
public class PricingPolicy extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partnership_id", nullable = false)
    private Partnership partnership;

    @Column(name = "policy_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PolicyType policyType;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate; // e.g., 15.00 = %15

    @Column(name = "fixed_markup", precision = 15, scale = 2)
    private BigDecimal fixedMarkup;

    @Column(name = "currency", nullable = false)
    private String currency = "TRY";

    public enum PolicyType {
        COMMISSION_PERCENTAGE, FIXED_MARKUP
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Partnership getPartnership() { return partnership; }
    public void setPartnership(Partnership partnership) { this.partnership = partnership; }

    public PolicyType getPolicyType() { return policyType; }
    public void setPolicyType(PolicyType policyType) { this.policyType = policyType; }

    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }

    public BigDecimal getFixedMarkup() { return fixedMarkup; }
    public void setFixedMarkup(BigDecimal fixedMarkup) { this.fixedMarkup = fixedMarkup; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
