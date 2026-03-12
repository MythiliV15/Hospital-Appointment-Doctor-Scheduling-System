package com.hospital.backend.config;

import com.hospital.backend.entity.Role;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        Optional<User> existingAdmin = userRepository.findByEmail("admin@hospital.com");

        // If admin already exists, do nothing
        if (existingAdmin.isPresent()) {
            System.out.println("Admin user already exists.");
            return;
        }

        // Create admin user
        User admin = new User();
        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setEmail("admin@hospital.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPhoneNumber("1234567890");
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        System.out.println("=======================================");
        System.out.println("Default Admin User Created Successfully");
        System.out.println("Email: admin@hospital.com");
        System.out.println("Password: admin123");
        System.out.println("=======================================");
    }
}