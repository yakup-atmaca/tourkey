package com.tourkey.backend.service;

import com.tourkey.backend.dto.PartnershipDto;
import com.tourkey.backend.dto.PricingPolicyDto;
import com.tourkey.backend.entity.Company;
import com.tourkey.backend.entity.Partnership;
import com.tourkey.backend.entity.PricingPolicy;
import com.tourkey.backend.repository.CompanyRepository;
import com.tourkey.backend.repository.PartnershipRepository;
import com.tourkey.backend.repository.PricingPolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PartnershipService {

    private final PartnershipRepository partnershipRepository;
    private final PricingPolicyRepository pricingPolicyRepository;
    private final CompanyRepository companyRepository;

    public PartnershipService(PartnershipRepository partnershipRepository, PricingPolicyRepository pricingPolicyRepository, CompanyRepository companyRepository) {
        this.partnershipRepository = partnershipRepository;
        this.pricingPolicyRepository = pricingPolicyRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public PartnershipDto requestPartnership(Long requesterCompanyId, Long recipientCompanyId, PricingPolicyDto policyDto, Boolean isBidirectional) {
        Company requester = companyRepository.findById(requesterCompanyId).orElseThrow();
        Company recipient = companyRepository.findById(recipientCompanyId).orElseThrow();

        Partnership partnership = new Partnership();
        partnership.setRequesterCompany(requester);
        partnership.setRecipientCompany(recipient);
        partnership.setStatus(Partnership.PartnershipStatus.PENDING);
        partnership.setIsBidirectional(isBidirectional != null ? isBidirectional : false);
        partnership.setTenantId(requesterCompanyId);

        Partnership saved = partnershipRepository.save(partnership);

        PricingPolicy policy = new PricingPolicy();
        policy.setPartnership(saved);
        policy.setPolicyType(PricingPolicy.PolicyType.valueOf(policyDto.policyType()));
        if (policy.getPolicyType() == PricingPolicy.PolicyType.COMMISSION_PERCENTAGE) {
            policy.setCommissionRate(policyDto.commissionRate());
        } else {
            policy.setFixedMarkup(policyDto.fixedMarkup());
        }
        policy.setCurrency(policyDto.currency() != null ? policyDto.currency() : "TRY");
        policy.setTenantId(requesterCompanyId);
        pricingPolicyRepository.save(policy);

        return toDto(saved);
    }

    @Transactional
    public PartnershipDto approvePartnership(Long partnershipId, Long approverCompanyId) {
        Partnership partnership = partnershipRepository.findById(partnershipId).orElseThrow();
        if (!partnership.getRecipientCompany().getId().equals(approverCompanyId)) {
            throw new IllegalStateException("Only recipient can approve");
        }
        partnership.setStatus(Partnership.PartnershipStatus.ACTIVE);
        return toDto(partnershipRepository.save(partnership));
    }

    @Transactional(readOnly = true)
    public List<PartnershipDto> getActivePartnerships(Long companyId) {
        return partnershipRepository.findActivePartnershipsByCompanyId(companyId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PartnershipDto> getPendingRequests(Long companyId) {
        return partnershipRepository.findPendingRequestsForCompany(companyId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PartnershipDto> getSentRequests(Long companyId) {
        return partnershipRepository.findSentRequestsByCompany(companyId).stream().map(this::toDto).toList();
    }

    private PartnershipDto toDto(Partnership p) {
        PricingPolicyDto policyDto = null;
        if (p.getPricingPolicy() != null) {
            PricingPolicy pp = p.getPricingPolicy();
            policyDto = new PricingPolicyDto(pp.getId(), pp.getPolicyType().name(), pp.getCommissionRate(), pp.getFixedMarkup(), pp.getCurrency());
        }
        return new PartnershipDto(
                p.getId(),
                p.getRequesterCompany().getId(), p.getRequesterCompany().getName(),
                p.getRecipientCompany().getId(), p.getRecipientCompany().getName(),
                p.getStatus().name(),
                p.getIsBidirectional(),
                policyDto
        );
    }
}
