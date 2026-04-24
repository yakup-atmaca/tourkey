package com.tourkey.backend.repository;

import com.tourkey.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
    List<Company> findAllByIsActiveTrue();
    List<Company> findAllByIsAdminFalseAndIsActiveTrue();
}
