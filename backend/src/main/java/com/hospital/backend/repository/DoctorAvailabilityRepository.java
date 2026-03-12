package com.hospital.backend.repository;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorAndAvailableDateGreaterThanEqual(Doctor doctor, LocalDate date);
    List<DoctorAvailability> findByDoctorAndAvailableDateAndIsBookedFalse(Doctor doctor, LocalDate date);
}
