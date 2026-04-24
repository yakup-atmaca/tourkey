package com.tourkey.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tickets")
public class Ticket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_company_id", nullable = false)
    private Company sellerCompany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_company_id", nullable = false)
    private Company organizerCompany;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_schedule_id", nullable = false)
    private TourSchedule tourSchedule;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "net_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal netTotal;

    @Column(name = "commission_amount", precision = 15, scale = 2)
    private BigDecimal commissionAmount;

    @Column(name = "gross_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossTotal;

    @Column(name = "currency", nullable = false)
    private String currency = "TRY";

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.CONFIRMED;

    @Column(name = "qr_code_data", length = 500)
    private String qrCodeData;

    @Column(name = "pickup_location")
    private String pickupLocation;

    @Column(name = "notes", length = 1000)
    private String notes;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Passenger> passengers = new ArrayList<>();

    public enum TicketStatus {
        CONFIRMED, CANCELLED, REFUNDED, USED
    }

    @PrePersist
    public void prePersist() {
        if (this.ticketNumber == null) {
            this.ticketNumber = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.saleDate == null) {
            this.saleDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public Company getSellerCompany() { return sellerCompany; }
    public void setSellerCompany(Company sellerCompany) { this.sellerCompany = sellerCompany; }

    public Company getOrganizerCompany() { return organizerCompany; }
    public void setOrganizerCompany(Company organizerCompany) { this.organizerCompany = organizerCompany; }

    public TourSchedule getTourSchedule() { return tourSchedule; }
    public void setTourSchedule(TourSchedule tourSchedule) { this.tourSchedule = tourSchedule; }

    public LocalDateTime getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDateTime saleDate) { this.saleDate = saleDate; }

    public BigDecimal getNetTotal() { return netTotal; }
    public void setNetTotal(BigDecimal netTotal) { this.netTotal = netTotal; }

    public BigDecimal getCommissionAmount() { return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount) { this.commissionAmount = commissionAmount; }

    public BigDecimal getGrossTotal() { return grossTotal; }
    public void setGrossTotal(BigDecimal grossTotal) { this.grossTotal = grossTotal; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<Passenger> getPassengers() { return passengers; }
    public void setPassengers(List<Passenger> passengers) { this.passengers = passengers; }
}
