package com.tourkey.backend.config;

import com.tourkey.backend.entity.Company;
import com.tourkey.backend.entity.User;
import com.tourkey.backend.repository.CompanyRepository;
import com.tourkey.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(CompanyRepository companyRepository,
                                       UserRepository userRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Admin Company
                Company adminCompany = new Company();
                adminCompany.setName("TourKey Platform");
                adminCompany.setIsAdmin(true);
                adminCompany.setIsActive(true);
                adminCompany.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                adminCompany.setTenantId(1L);
                adminCompany = companyRepository.save(adminCompany);

                // Admin User
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

                // Demo companies
                Company comp1 = new Company();
                comp1.setName("Ayyildiz Tur");
                comp1.setIsAdmin(false);
                comp1.setIsActive(true);
                comp1.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                comp1.setTenantId(2L);
                comp1 = companyRepository.save(comp1);

                Company comp2 = new Company();
                comp2.setName("Gezen Tur");
                comp2.setIsAdmin(false);
                comp2.setIsActive(true);
                comp2.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
                comp2.setTenantId(3L);
                comp2 = companyRepository.save(comp2);

                // Demo users
                User user1 = new User();
                user1.setUsername("ayyildiz");
                user1.setPassword(passwordEncoder.encode("123456"));
                user1.setFullName("Ayyildiz Manager");
                user1.setCompany(comp1);
                user1.setRoles(Set.of(User.Role.ADMIN));
                user1.setIsActive(true);
                user1.setTenantId(2L);
                userRepository.save(user1);

                User user2 = new User();
                user2.setUsername("gezentur");
                user2.setPassword(passwordEncoder.encode("123456"));
                user2.setFullName("Gezen Tur Manager");
                user2.setCompany(comp2);
                user2.setRoles(Set.of(User.Role.ADMIN));
                user2.setIsActive(true);
                user2.setTenantId(3L);
                userRepository.save(user2);

                System.out.println("✅ Default data initialized!");
                System.out.println("   Admin: admin / admin123");
                System.out.println("   Ayyildiz: ayyildiz / 123456");
                System.out.println("   GezenTur: gezentur / 123456");
            }
        };
    }
}
