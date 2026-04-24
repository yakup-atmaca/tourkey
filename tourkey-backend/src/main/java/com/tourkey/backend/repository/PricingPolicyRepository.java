package com.tourkey.backend.repository;

import com.tourkey.backend.entity.PricingPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PricingPolicyRepository extends JpaRepository<PricingPolicy, Long> {
    Optional<PricingPolicy> findByPartnershipId(Long partnershipId);
}
