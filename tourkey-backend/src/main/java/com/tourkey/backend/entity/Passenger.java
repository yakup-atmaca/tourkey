package com.tourkey.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
public class Passenger extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "passport_no")
    private String passportNo;

    @Column(name = "phone")
    private String phone;

    @Column(name = "passenger_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PassengerType passengerType = PassengerType.ADULT;

    @Column(name = "gender", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender = Gender.MALE;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "seat_number")
    private String seatNumber;

    public enum PassengerType {
        ADULT, CHILD, BABY, GUEST
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassportNo() { return passportNo; }
    public void setPassportNo(String passportNo) { this.passportNo = passportNo; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public PassengerType getPassengerType() { return passengerType; }
    public void setPassengerType(PassengerType passengerType) { this.passengerType = passengerType; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}
