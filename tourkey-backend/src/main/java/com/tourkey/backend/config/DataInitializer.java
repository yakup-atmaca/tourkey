package com.tourkey.backend.config;

import com.tourkey.backend.entity.*;
import com.tourkey.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            CompanyRepository companyRepository,
            UserRepository userRepository,
            TourRepository tourRepository,
            TourScheduleRepository tourScheduleRepository,
            PartnershipRepository partnershipRepository,
            PricingPolicyRepository pricingPolicyRepository,
            TicketRepository ticketRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            boolean dataAdded = false;
            Company adminCompany = null;
            Company ayyildiz = null;
            Company gezentur = null;

            if (companyRepository.count() == 0) {
                // ======= ADMIN =======
                adminCompany = new Company();
                adminCompany.setName("TourKey Platform");
                adminCompany.setIsAdmin(true);
                adminCompany.setIsActive(true);
                adminCompany.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                adminCompany.setTenantId(1L);
                adminCompany = companyRepository.save(adminCompany);

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Admin");
                admin.setEmail("admin@tourkey.com");
                admin.setCompany(adminCompany);
                admin.setRoles(Set.of(User.Role.SUPER_ADMIN));
                admin.setIsActive(true);
                admin.setTenantId(1L);
                userRepository.save(admin);

                // ======= FIRMA 1 - AYYILDIZ =======
                ayyildiz = new Company();
                ayyildiz.setName("Ayyildiz Tur");
                ayyildiz.setTaxOffice("Antalya VD");
                ayyildiz.setTaxNumber("1234567890");
                ayyildiz.setPhone("0242 123 45 67");
                ayyildiz.setEmail("info@ayyildiztur.com");
                ayyildiz.setAddress("Konyaalti, Antalya");
                ayyildiz.setIsAdmin(false);
                ayyildiz.setIsActive(true);
                ayyildiz.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                ayyildiz.setTenantId(2L);
                ayyildiz = companyRepository.save(ayyildiz);

                User user1 = new User();
                user1.setUsername("ayyildiz");
                user1.setPassword(passwordEncoder.encode("123456"));
                user1.setFullName("Ayyildiz Manager");
                user1.setCompany(ayyildiz);
                user1.setRoles(Set.of(User.Role.ADMIN));
                user1.setIsActive(true);
                user1.setTenantId(2L);
                userRepository.save(user1);

                // ======= FIRMA 2 - GEZEN TUR =======
                gezentur = new Company();
                gezentur.setName("Gezen Tur");
                gezentur.setTaxOffice("Alanya VD");
                gezentur.setTaxNumber("9876543210");
                gezentur.setPhone("0242 987 65 43");
                gezentur.setEmail("info@gezentur.com");
                gezentur.setAddress("Alanya, Antalya");
                gezentur.setIsAdmin(false);
                gezentur.setIsActive(true);
                gezentur.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                gezentur.setTenantId(3L);
                gezentur = companyRepository.save(gezentur);

                User user2 = new User();
                user2.setUsername("gezentur");
                user2.setPassword(passwordEncoder.encode("123456"));
                user2.setFullName("Gezen Tur Manager");
                user2.setCompany(gezentur);
                user2.setRoles(Set.of(User.Role.ADMIN));
                user2.setIsActive(true);
                user2.setTenantId(3L);
                userRepository.save(user2);

                // ======= TURLAR - AYYILDIZ =======
                Tour t1 = new Tour();
                t1.setName("Kapadokya Balon Turu");
                t1.setDescription("Peri bacalarinin ustunden gunes dogumu manzarasi");
                t1.setOrganizerCompany(ayyildiz);
                t1.setBasePrice(new BigDecimal("150.00"));
                t1.setAdultPrice(new BigDecimal("150.00"));
                t1.setChildPrice(new BigDecimal("100.00"));
                t1.setBabyPrice(new BigDecimal("0.00"));
                t1.setGuestPrice(new BigDecimal("175.00"));
                t1.setCurrency("EUR");
                t1.setStartLat(new BigDecimal("38.6431"));
                t1.setStartLng(new BigDecimal("34.8303"));
                t1.setEndLat(new BigDecimal("38.6431"));
                t1.setEndLng(new BigDecimal("34.8303"));
                t1.setIsActive(true);
                t1.setTenantId(2L);
                t1 = tourRepository.save(t1);

                Tour t2 = new Tour();
                t2.setName("Alanya Tekne Turu");
                t2.setDescription("Deniz, gunes, muzik ve eglence");
                t2.setOrganizerCompany(ayyildiz);
                t2.setBasePrice(new BigDecimal("450.00"));
                t2.setAdultPrice(new BigDecimal("450.00"));
                t2.setChildPrice(new BigDecimal("250.00"));
                t2.setBabyPrice(new BigDecimal("0.00"));
                t2.setGuestPrice(new BigDecimal("500.00"));
                t2.setCurrency("TRY");
                t2.setStartLat(new BigDecimal("36.5444"));
                t2.setStartLng(new BigDecimal("31.9954"));
                t2.setEndLat(new BigDecimal("36.5444"));
                t2.setEndLng(new BigDecimal("31.9954"));
                t2.setIsActive(true);
                t2.setTenantId(2L);
                t2 = tourRepository.save(t2);

                // ======= TURLAR - GEZEN TUR =======
                Tour t3 = new Tour();
                t3.setName("Pamukkale Travertenleri");
                t3.setDescription("Beyaz cennet, Hierapolis antik kenti");
                t3.setOrganizerCompany(gezentur);
                t3.setBasePrice(new BigDecimal("120.00"));
                t3.setAdultPrice(new BigDecimal("120.00"));
                t3.setChildPrice(new BigDecimal("80.00"));
                t3.setBabyPrice(new BigDecimal("0.00"));
                t3.setGuestPrice(new BigDecimal("140.00"));
                t3.setCurrency("EUR");
                t3.setStartLat(new BigDecimal("37.9231"));
                t3.setStartLng(new BigDecimal("29.1245"));
                t3.setEndLat(new BigDecimal("37.9231"));
                t3.setEndLng(new BigDecimal("29.1245"));
                t3.setIsActive(true);
                t3.setTenantId(3L);
                t3 = tourRepository.save(t3);

                // ======= TUR TARIHleri =======
                TourSchedule ts1 = new TourSchedule();
                ts1.setTour(t1);
                ts1.setScheduleDate(LocalDate.now().plusDays(3));
                ts1.setDepartureTime(LocalTime.of(5, 30));
                ts1.setStatus(TourSchedule.ScheduleStatus.OPEN);
                ts1.setCapacity(20);
                ts1.setSoldSeats(0);
                ts1.setTenantId(2L);
                tourScheduleRepository.save(ts1);

                TourSchedule ts2 = new TourSchedule();
                ts2.setTour(t2);
                ts2.setScheduleDate(LocalDate.now().plusDays(5));
                ts2.setDepartureTime(LocalTime.of(10, 0));
                ts2.setStatus(TourSchedule.ScheduleStatus.OPEN);
                ts2.setCapacity(50);
                ts2.setSoldSeats(0);
                ts2.setTenantId(2L);
                tourScheduleRepository.save(ts2);

                TourSchedule ts3 = new TourSchedule();
                ts3.setTour(t3);
                ts3.setScheduleDate(LocalDate.now().plusDays(7));
                ts3.setDepartureTime(LocalTime.of(8, 0));
                ts3.setStatus(TourSchedule.ScheduleStatus.OPEN);
                ts3.setCapacity(30);
                ts3.setSoldSeats(0);
                ts3.setTenantId(3L);
                tourScheduleRepository.save(ts3);

                // ======= ANLAŞMALAR =======
                Partnership p1 = new Partnership();
                p1.setRequesterCompany(ayyildiz);
                p1.setRecipientCompany(gezentur);
                p1.setStatus(Partnership.PartnershipStatus.ACTIVE);
                p1.setIsBidirectional(true);
                p1.setTenantId(2L);
                p1 = partnershipRepository.save(p1);

                PricingPolicy pp1 = new PricingPolicy();
                pp1.setPartnership(p1);
                pp1.setPolicyType(PricingPolicy.PolicyType.COMMISSION_PERCENTAGE);
                pp1.setCommissionRate(new BigDecimal("15.00"));
                pp1.setCurrency("EUR");
                pp1.setTenantId(2L);
                pricingPolicyRepository.save(pp1);

                // ======= BILETLER =======
                Ticket ticket1 = new Ticket();
                ticket1.setTicketNumber("TK-0001");
                ticket1.setSellerCompany(gezentur);
                ticket1.setOrganizerCompany(ayyildiz);
                ticket1.setTourSchedule(ts1);
                ticket1.setSaleDate(LocalDateTime.now());
                ticket1.setNetTotal(new BigDecimal("300.00"));
                ticket1.setCommissionAmount(new BigDecimal("45.00"));
                ticket1.setGrossTotal(new BigDecimal("345.00"));
                ticket1.setCurrency("EUR");
                ticket1.setStatus(Ticket.TicketStatus.CONFIRMED);
                ticket1.setPickupLocation("Otel Dedeman");
                ticket1.setNotes("2 yetiskin");
                ticket1.setTenantId(3L);
                ticket1 = ticketRepository.save(ticket1);

                Passenger pass1 = new Passenger();
                pass1.setFullName("Ahmet Yilmaz");
                pass1.setPassportNo("TR123456");
                pass1.setPhone("+90 532 111 22 33");
                pass1.setPassengerType(Passenger.PassengerType.ADULT);
                pass1.setGender(Passenger.Gender.MALE);
                pass1.setCountryCode("TR");
                pass1.setSeatNumber("A1");
                pass1.setTicket(ticket1);
                pass1.setTenantId(3L);
                // passengerRepository.save(pass1); // lazy hatası olabilir

                Ticket ticket2 = new Ticket();
                ticket2.setTicketNumber("TK-0002");
                ticket2.setSellerCompany(ayyildiz);
                ticket2.setOrganizerCompany(gezentur);
                ticket2.setTourSchedule(ts3);
                ticket2.setSaleDate(LocalDateTime.now().minusDays(1));
                ticket2.setNetTotal(new BigDecimal("240.00"));
                ticket2.setCommissionAmount(new BigDecimal("36.00"));
                ticket2.setGrossTotal(new BigDecimal("276.00"));
                ticket2.setCurrency("EUR");
                ticket2.setStatus(Ticket.TicketStatus.CONFIRMED);
                ticket2.setPickupLocation("Lara Hotel");
                ticket2.setNotes("Aile turu");
                ticket2.setTenantId(2L);
                ticketRepository.save(ticket2);

                System.out.println("✅ Demo data initialized!");
                System.out.println("   Admin: admin / admin123");
                System.out.println("   Ayyildiz: ayyildiz / 123456");
                System.out.println("   GezenTur: gezentur / 123456");
                System.out.println("   Turlar: " + tourRepository.count());
                System.out.println("   Tarihler: " + tourScheduleRepository.count());
                System.out.println("   Anlasmalar: " + partnershipRepository.count());
                System.out.println("   Biletler: " + ticketRepository.count());
            }
        };
    }
}
