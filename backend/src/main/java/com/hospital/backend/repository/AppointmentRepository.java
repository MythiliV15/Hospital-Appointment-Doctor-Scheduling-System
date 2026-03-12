package com.hospital.backend.repository;

import com.hospital.backend.entity.Appointment;
import com.hospital.backend.entity.AppointmentStatus;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByAppointmentDateDesc(User patient);
    List<Appointment> findByDoctorOrderByAppointmentDateDesc(Doctor doctor);
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor")
    long countByDoctor(Doctor doctor);

    @Query("SELECT a.doctor.id as doctorId, COUNT(a) as count FROM Appointment a GROUP BY a.doctor.id")
    List<Object[]> countAppointmentsPerDoctor();

    @Query("SELECT a.doctor.department.name as deptName, SUM(a.doctor.consultationFee) as revenue FROM Appointment a WHERE a.status = 'COMPLETED' GROUP BY a.doctor.department.id")
    List<Object[]> revenuePerDepartment();

    @Query("SELECT a.appointmentDate as date, COUNT(a) as count FROM Appointment a GROUP BY a.appointmentDate")
    List<Object[]> dailyAppointmentStats();
}
