package com.tourkey.backend.service;

import com.tourkey.backend.dto.DashboardStatsDto;
import com.tourkey.backend.entity.Ticket;
import com.tourkey.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final PartnershipRepository partnershipRepository;

    public DashboardService(TicketRepository ticketRepository, PartnershipRepository partnershipRepository) {
        this.ticketRepository = ticketRepository;
        this.partnershipRepository = partnershipRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats(Long companyId) {
        Long totalSales = ticketRepository.countConfirmedBySeller(companyId);
        BigDecimal totalRevenue = ticketRepository.sumGrossBySeller(companyId);

        Long ownTourSales = ticketRepository.findAllBySellerCompanyId(companyId).stream()
                .filter(t -> t.getOrganizerCompany().getId().equals(companyId) && t.getStatus().name().equals("CONFIRMED"))
                .count();
        BigDecimal ownTourRevenue = ticketRepository.findAllBySellerCompanyId(companyId).stream()
                .filter(t -> t.getOrganizerCompany().getId().equals(companyId) && t.getStatus().name().equals("CONFIRMED"))
                .map(Ticket::getGrossTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Long partnerTourSales = totalSales - ownTourSales;
        BigDecimal partnerTourRevenue = totalRevenue.subtract(ownTourRevenue);

        Long pendingPartnerships = (long) partnershipRepository.findPendingRequestsForCompany(companyId).size();
        Long activePartnerships = (long) partnershipRepository.findActivePartnershipsByCompanyId(companyId).size();

        return new DashboardStatsDto(
                totalSales, totalRevenue,
                ownTourSales, ownTourRevenue,
                partnerTourSales, partnerTourRevenue,
                pendingPartnerships, activePartnerships
        );
    }
}
