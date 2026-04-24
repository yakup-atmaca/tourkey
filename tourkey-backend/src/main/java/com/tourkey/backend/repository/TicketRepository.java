package com.tourkey.backend.repository;

import com.tourkey.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllBySellerCompanyId(Long companyId);
    List<Ticket> findAllByOrganizerCompanyId(Long companyId);

    @Query("SELECT t FROM Ticket t WHERE t.sellerCompany.id = :companyId AND t.saleDate BETWEEN :start AND :end")
    List<Ticket> findSalesBySellerAndDateRange(@Param("companyId") Long companyId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT t FROM Ticket t WHERE t.organizerCompany.id = :companyId AND t.saleDate BETWEEN :start AND :end")
    List<Ticket> findSalesByOrganizerAndDateRange(@Param("companyId") Long companyId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.sellerCompany.id = :companyId AND t.status = 'CONFIRMED'")
    Long countConfirmedBySeller(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(t.grossTotal), 0) FROM Ticket t WHERE t.sellerCompany.id = :companyId AND t.status = 'CONFIRMED'")
    java.math.BigDecimal sumGrossBySeller(@Param("companyId") Long companyId);
}
