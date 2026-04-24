package com.tourkey.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "partnerships")
public class Partnership extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_company_id", nullable = false)
    private Company requesterCompany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_company_id", nullable = false)
    private Company recipientCompany;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PartnershipStatus status = PartnershipStatus.PENDING;

    @OneToOne(mappedBy = "partnership", cascade = CascadeType.ALL, orphanRemoval = true)
    private PricingPolicy pricingPolicy;

    @Column(name = "is_bidirectional", nullable = false)
    private Boolean isBidirectional = false;

    public enum PartnershipStatus {
        PENDING, ACTIVE, REJECTED, SUSPENDED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Company getRequesterCompany() { return requesterCompany; }
    public void setRequesterCompany(Company requesterCompany) { this.requesterCompany = requesterCompany; }

    public Company getRecipientCompany() { return recipientCompany; }
    public void setRecipientCompany(Company recipientCompany) { this.recipientCompany = recipientCompany; }

    public PartnershipStatus getStatus() { return status; }
    public void setStatus(PartnershipStatus status) { this.status = status; }

    public PricingPolicy getPricingPolicy() { return pricingPolicy; }
    public void setPricingPolicy(PricingPolicy pricingPolicy) { this.pricingPolicy = pricingPolicy; }

    public Boolean getIsBidirectional() { return isBidirectional; }
    public void setIsBidirectional(Boolean isBidirectional) { this.isBidirectional = isBidirectional; }
}
