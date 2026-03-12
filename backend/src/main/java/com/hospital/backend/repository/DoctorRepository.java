package com.hospital.backend.repository;

import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Department;
import com.hospital.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByDepartment(Department department);
    Optional<Doctor> findByUser(User user);
    
    @Query("SELECT d FROM Doctor d JOIN d.user u WHERE u.firstName LIKE %:query% OR u.lastName LIKE %:query% OR d.specialization LIKE %:query%")
    List<Doctor> searchDoctors(@Param("query") String query);
}
