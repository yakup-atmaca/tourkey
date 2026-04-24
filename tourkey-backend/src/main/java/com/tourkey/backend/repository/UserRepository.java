package com.tourkey.backend.repository;

import com.tourkey.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findAllByCompanyId(Long companyId);
    List<User> findAllByCompanyIdAndIsActiveTrue(Long companyId);
    boolean existsByUsername(String username);
}
