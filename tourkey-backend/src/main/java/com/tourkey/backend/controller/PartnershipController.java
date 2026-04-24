package com.tourkey.backend.controller;

import com.tourkey.backend.dto.PartnershipDto;
import com.tourkey.backend.dto.PricingPolicyDto;
import com.tourkey.backend.service.PartnershipService;
import com.tourkey.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partnerships")
public class PartnershipController {

    private final PartnershipService partnershipService;

    public PartnershipController(PartnershipService partnershipService) {
        this.partnershipService = partnershipService;
    }

    @PostMapping("/request")
    public ResponseEntity<PartnershipDto> request(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam Long recipientCompanyId,
            @RequestBody PricingPolicyDto policy,
            @RequestParam(required = false, defaultValue = "false") Boolean isBidirectional) {
        return ResponseEntity.ok(partnershipService.requestPartnership(user.getCompanyId(), recipientCompanyId, policy, isBidirectional));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<PartnershipDto> approve(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id) {
        return ResponseEntity.ok(partnershipService.approvePartnership(id, user.getCompanyId()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<PartnershipDto>> active(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(partnershipService.getActivePartnerships(user.getCompanyId()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PartnershipDto>> pending(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(partnershipService.getPendingRequests(user.getCompanyId()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<PartnershipDto>> sent(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(partnershipService.getSentRequests(user.getCompanyId()));
    }
}
