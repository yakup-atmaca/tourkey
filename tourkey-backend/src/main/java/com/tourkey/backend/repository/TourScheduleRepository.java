package com.tourkey.backend.repository;

import com.tourkey.backend.entity.TourSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {
    List<TourSchedule> findAllByTourIdAndScheduleDateAfter(Long tourId, LocalDate date);
    List<TourSchedule> findAllByTourIdAndStatus(Long tourId, TourSchedule.ScheduleStatus status);
}
