package com.tourkey.backend.repository;

import com.tourkey.backend.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findAllByOrganizerCompanyIdAndIsActiveTrue(Long companyId);

    @Query("SELECT t FROM Tour t WHERE t.organizerCompany.id = :companyId AND t.isActive = true")
    List<Tour> findAvailableToursByOrganizer(@Param("companyId") Long companyId);
}
