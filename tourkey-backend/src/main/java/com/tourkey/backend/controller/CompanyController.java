package com.tourkey.backend.controller;

import com.tourkey.backend.dto.CompanyDto;
import com.tourkey.backend.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CompanyDto> create(@RequestBody CompanyDto dto) {
        return ResponseEntity.ok(companyService.createCompany(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<CompanyDto>> listAll() {
        return ResponseEntity.ok(companyService.listAllCompanies());
    }

    @GetMapping("/available")
    public ResponseEntity<List<CompanyDto>> listAvailable() {
        return ResponseEntity.ok(companyService.listNonAdminCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompany(id));
    }
}
