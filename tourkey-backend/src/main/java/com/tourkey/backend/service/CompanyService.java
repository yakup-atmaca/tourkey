package com.tourkey.backend.service;

import com.tourkey.backend.dto.CompanyDto;
import com.tourkey.backend.entity.Company;
import com.tourkey.backend.repository.CompanyRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = new Company();
        company.setName(dto.name());
        company.setLogoUrl(dto.logoUrl());
        company.setTaxOffice(dto.taxOffice());
        company.setTaxNumber(dto.taxNumber());
        company.setAddress(dto.address());
        company.setPhone(dto.phone());
        company.setEmail(dto.email());
        company.setSubscriptionStatus(Company.SubscriptionStatus.valueOf(dto.subscriptionStatus()));
        company.setIsActive(dto.isActive() != null ? dto.isActive() : true);
        company.setIsAdmin(false);
        company.setTenantId(0L); // will be updated after creation with company id

        Company saved = companyRepository.save(company);
        saved.setTenantId(saved.getId());
        saved = companyRepository.save(saved);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> listAllCompanies() {
        return companyRepository.findAllByIsActiveTrue().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> listNonAdminCompanies() {
        return companyRepository.findAllByIsAdminFalseAndIsActiveTrue().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompany(Long id) {
        return companyRepository.findById(id).map(this::toDto).orElseThrow();
    }

    private CompanyDto toDto(Company c) {
        return new CompanyDto(
                c.getId(), c.getName(), c.getLogoUrl(), c.getTaxOffice(), c.getTaxNumber(),
                c.getAddress(), c.getPhone(), c.getEmail(),
                c.getSubscriptionStatus().name(), c.getIsActive(), c.getIsAdmin()
        );
    }
}
