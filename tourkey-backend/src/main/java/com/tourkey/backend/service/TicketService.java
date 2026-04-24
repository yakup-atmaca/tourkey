package com.tourkey.backend.service;

import com.tourkey.backend.dto.*;
import com.tourkey.backend.entity.*;
import com.tourkey.backend.repository.*;
import com.tourkey.backend.util.QrCodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TourScheduleRepository tourScheduleRepository;
    private final CompanyRepository companyRepository;
    private final PartnershipRepository partnershipRepository;
    private final FinancialTransactionRepository financialTransactionRepository;
    private final QrCodeGenerator qrCodeGenerator;

    public TicketService(TicketRepository ticketRepository, TourScheduleRepository tourScheduleRepository,
                         CompanyRepository companyRepository, PartnershipRepository partnershipRepository,
                         FinancialTransactionRepository financialTransactionRepository,
                         QrCodeGenerator qrCodeGenerator) {
        this.ticketRepository = ticketRepository;
        this.tourScheduleRepository = tourScheduleRepository;
        this.companyRepository = companyRepository;
        this.partnershipRepository = partnershipRepository;
        this.financialTransactionRepository = financialTransactionRepository;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    @Transactional
    public TicketDto createTicket(Long sellerCompanyId, CreateTicketRequest request) {
        TourSchedule schedule = tourScheduleRepository.findById(request.tourScheduleId()).orElseThrow();
        Tour tour = schedule.getTour();
        Company organizer = tour.getOrganizerCompany();
        Company seller = companyRepository.findById(sellerCompanyId).orElseThrow();

        // Calculate net price from passengers
        BigDecimal netTotal = calculateNetTotal(tour, request.passengers());

        // Dynamic pricing engine
        BigDecimal commission = BigDecimal.ZERO;
        if (!organizer.getId().equals(sellerCompanyId)) {
            var partnershipOpt = partnershipRepository.findActiveBetween(sellerCompanyId, organizer.getId());
            if (partnershipOpt.isPresent()) {
                Partnership p = partnershipOpt.get();
                if (p.getPricingPolicy() != null) {
                    PricingPolicy pp = p.getPricingPolicy();
                    switch (pp.getPolicyType()) {
                        case COMMISSION_PERCENTAGE -> {
                            if (pp.getCommissionRate() != null) {
                                commission = netTotal.multiply(pp.getCommissionRate()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                            }
                        }
                        case FIXED_MARKUP -> {
                            if (pp.getFixedMarkup() != null) {
                                commission = pp.getFixedMarkup().multiply(BigDecimal.valueOf(request.passengers().size()));
                            }
                        }
                    }
                }
            }
        }

        BigDecimal grossTotal = netTotal.add(commission);

        Ticket ticket = new Ticket();
        ticket.setSellerCompany(seller);
        ticket.setOrganizerCompany(organizer);
        ticket.setTourSchedule(schedule);
        ticket.setNetTotal(netTotal);
        ticket.setCommissionAmount(commission);
        ticket.setGrossTotal(grossTotal);
        ticket.setCurrency(tour.getCurrency());
        ticket.setStatus(Ticket.TicketStatus.CONFIRMED);
        ticket.setPickupLocation(request.pickupLocation());
        ticket.setNotes(request.notes());
        ticket.setTenantId(sellerCompanyId);

        List<Passenger> passengers = new ArrayList<>();
        for (PassengerRequest pr : request.passengers()) {
            Passenger p = new Passenger();
            p.setFullName(pr.fullName());
            p.setPassportNo(pr.passportNo());
            p.setPhone(pr.phone());
            p.setPassengerType(Passenger.PassengerType.valueOf(pr.passengerType()));
            p.setGender(Passenger.Gender.valueOf(pr.gender()));
            p.setCountryCode(pr.countryCode());
            p.setSeatNumber(pr.seatNumber());
            p.setTicket(ticket);
            p.setTenantId(sellerCompanyId);
            passengers.add(p);
        }
        ticket.setPassengers(passengers);

        // Update sold seats
        schedule.setSoldSeats(schedule.getSoldSeats() + passengers.size());

        Ticket saved = ticketRepository.save(ticket);

        // Generate QR Code
        String qrData = "TOURKEY:" + saved.getTicketNumber() + ":" + saved.getId() + ":" + tour.getName();
        String qrBase64 = qrCodeGenerator.generateBase64QrCode(qrData, 200, 200);
        saved.setQrCodeData(qrBase64);
        saved = ticketRepository.save(saved);

        // Financial transactions
        if (!organizer.getId().equals(sellerCompanyId)) {
            // Seller records gross sale
            FinancialTransaction ftSeller = new FinancialTransaction();
            ftSeller.setCompany(seller);
            ftSeller.setCounterpartyCompany(organizer);
            ftSeller.setTicket(saved);
            ftSeller.setTransactionType(FinancialTransaction.TransactionType.SALE);
            ftSeller.setAmount(grossTotal);
            ftSeller.setCurrency(tour.getCurrency());
            ftSeller.setDescription("Bilet satisi: " + saved.getTicketNumber());
            ftSeller.setTenantId(sellerCompanyId);
            financialTransactionRepository.save(ftSeller);

            // Organizer records net sale
            FinancialTransaction ftOrg = new FinancialTransaction();
            ftOrg.setCompany(organizer);
            ftOrg.setCounterpartyCompany(seller);
            ftOrg.setTicket(saved);
            ftOrg.setTransactionType(FinancialTransaction.TransactionType.SALE);
            ftOrg.setAmount(netTotal);
            ftOrg.setCurrency(tour.getCurrency());
            ftOrg.setDescription("Partner satisi: " + saved.getTicketNumber());
            ftOrg.setTenantId(organizer.getId());
            financialTransactionRepository.save(ftOrg);

            // Organizer records commission expense
            if (commission.compareTo(BigDecimal.ZERO) > 0) {
                FinancialTransaction ftComm = new FinancialTransaction();
                ftComm.setCompany(organizer);
                ftComm.setCounterpartyCompany(seller);
                ftComm.setTicket(saved);
                ftComm.setTransactionType(FinancialTransaction.TransactionType.COMMISSION);
                ftComm.setAmount(commission.negate());
                ftComm.setCurrency(tour.getCurrency());
                ftComm.setDescription("Komisyon: " + saved.getTicketNumber());
                ftComm.setTenantId(organizer.getId());
                financialTransactionRepository.save(ftComm);
            }
        } else {
            // Own sale
            FinancialTransaction ft = new FinancialTransaction();
            ft.setCompany(seller);
            ft.setTicket(saved);
            ft.setTransactionType(FinancialTransaction.TransactionType.SALE);
            ft.setAmount(grossTotal);
            ft.setCurrency(tour.getCurrency());
            ft.setDescription("Direkt satis: " + saved.getTicketNumber());
            ft.setTenantId(sellerCompanyId);
            financialTransactionRepository.save(ft);
        }

        return toDto(saved);
    }

    private BigDecimal calculateNetTotal(Tour tour, List<PassengerRequest> passengers) {
        BigDecimal total = BigDecimal.ZERO;
        for (PassengerRequest p : passengers) {
            BigDecimal price = switch (Passenger.PassengerType.valueOf(p.passengerType())) {
                case ADULT -> tour.getAdultPrice() != null ? tour.getAdultPrice() : tour.getBasePrice();
                case CHILD -> tour.getChildPrice() != null ? tour.getChildPrice() : tour.getBasePrice();
                case BABY -> tour.getBabyPrice() != null ? tour.getBabyPrice() : BigDecimal.ZERO;
                case GUEST -> tour.getGuestPrice() != null ? tour.getGuestPrice() : tour.getBasePrice();
            };
            total = total.add(price != null ? price : BigDecimal.ZERO);
        }
        return total;
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getTicketsBySeller(Long companyId) {
        return ticketRepository.findAllBySellerCompanyId(companyId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getTicketsByOrganizer(Long companyId) {
        return ticketRepository.findAllByOrganizerCompanyId(companyId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TicketDto getTicket(Long ticketId) {
        return ticketRepository.findById(ticketId).map(this::toDto).orElseThrow();
    }

    private TicketDto toDto(Ticket t) {
        return new TicketDto(
                t.getId(), t.getTicketNumber(),
                t.getSellerCompany().getId(), t.getSellerCompany().getName(),
                t.getOrganizerCompany().getId(), t.getOrganizerCompany().getName(),
                t.getTourSchedule().getId(),
                t.getTourSchedule().getTour().getName(),
                t.getTourSchedule().getScheduleDate().atTime(t.getTourSchedule().getDepartureTime() != null ? t.getTourSchedule().getDepartureTime() : java.time.LocalTime.MIDNIGHT),
                t.getSaleDate(),
                t.getNetTotal(), t.getCommissionAmount(), t.getGrossTotal(),
                t.getCurrency(), t.getStatus().name(),
                t.getQrCodeData(), t.getPickupLocation(), t.getNotes(),
                t.getPassengers().stream().map(p -> new PassengerDto(
                        p.getId(), p.getFullName(), p.getPassportNo(), p.getPhone(),
                        p.getPassengerType().name(), p.getGender().name(),
                        p.getCountryCode(), p.getSeatNumber()
                )).toList()
        );
    }
}
