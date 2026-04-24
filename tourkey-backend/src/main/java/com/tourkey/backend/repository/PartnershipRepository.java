package com.tourkey.backend.repository;

import com.tourkey.backend.entity.Partnership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnershipRepository extends JpaRepository<Partnership, Long> {

    @Query("SELECT p FROM Partnership p WHERE (p.requesterCompany.id = :companyId OR p.recipientCompany.id = :companyId) AND p.status = 'ACTIVE'")
    List<Partnership> findActivePartnershipsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Partnership p WHERE p.recipientCompany.id = :companyId AND p.status = 'PENDING'")
    List<Partnership> findPendingRequestsForCompany(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Partnership p WHERE p.requesterCompany.id = :companyId AND p.status = 'PENDING'")
    List<Partnership> findSentRequestsByCompany(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Partnership p WHERE ((p.requesterCompany.id = :c1 AND p.recipientCompany.id = :c2) OR (p.requesterCompany.id = :c2 AND p.recipientCompany.id = :c1)) AND p.status = 'ACTIVE'")
    Optional<Partnership> findActiveBetween(@Param("c1") Long c1, @Param("c2") Long c2);
}
