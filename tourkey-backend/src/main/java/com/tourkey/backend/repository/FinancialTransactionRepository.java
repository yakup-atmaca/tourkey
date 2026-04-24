package com.tourkey.backend.repository;

import com.tourkey.backend.entity.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {

    List<FinancialTransaction> findAllByCompanyIdOrderByTransactionDateDesc(Long companyId);

    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.company.id = :companyId AND ft.transactionDate BETWEEN :start AND :end")
    List<FinancialTransaction> findByCompanyAndDateRange(@Param("companyId") Long companyId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(ft.amount), 0) FROM FinancialTransaction ft WHERE ft.company.id = :companyId AND ft.transactionType = :type")
    java.math.BigDecimal sumByCompanyAndType(@Param("companyId") Long companyId, @Param("type") FinancialTransaction.TransactionType type);
}
