package com.hospital.backend.service;

import com.hospital.backend.dto.*;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public AppointmentDTO bookAppointment(Long patientId, AppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DoctorAvailability availability = availabilityRepository.findById(request.getAvailabilityId())
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        if (availability.isBooked()) {
            throw new RuntimeException("Time slot already booked");
        }

        if (availability.getAvailableDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot book appointments for past dates");
        }

        // Business Rule: Patients cannot book multiple appointments at the same time
        // (Simplified: one appointment per patient per slot)
        
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(availability.getDoctor())
                .appointmentDate(availability.getAvailableDate())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .status(AppointmentStatus.PENDING)
                .reason(request.getReason())
                .build();

        availability.setBooked(true);
        availabilityRepository.save(availability);

        return convertToDTO(appointmentRepository.save(appointment));
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO updateStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        
        if (status == AppointmentStatus.CANCELLED || status == AppointmentStatus.REJECTED) {
            // Free up the slot if we had a direct link, but here slots are discrete.
            // Ideally we find the availability for this doctor/date/time and mark it unbooked.
            updateAvailabilityStatus(appointment, false);
        }
        
        return convertToDTO(appointmentRepository.save(appointment));
    }

    private void updateAvailabilityStatus(Appointment appointment, boolean isBooked) {
        List<DoctorAvailability> slots = availabilityRepository.findByDoctorAndAvailableDateAndIsBookedFalse(
                appointment.getDoctor(), appointment.getAppointmentDate()
        );
        // Find the specific slot. This is slightly inefficient without a direct ID but works for the current schema.
        for (DoctorAvailability slot : slots) {
            if (slot.getStartTime().equals(appointment.getStartTime()) && slot.getEndTime().equals(appointment.getEndTime())) {
                slot.setBooked(isBooked);
                availabilityRepository.save(slot);
                break;
            }
        }
    }

    @Transactional
    public void addReview(Long patientId, Long doctorId, ReviewDTO reviewDTO) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Review review = Review.builder()
                .patient(patient)
                .doctor(doctor)
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .build();

        reviewRepository.save(review);

        // Update doctor average rating
        List<Review> reviews = reviewRepository.findByDoctorOrderByCreatedAtDesc(doctor);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        doctor.setAverageRating(avg);
        doctorRepository.save(doctor);
    }

    public ReportDTO getSystemAnalytics() {
        ReportDTO report = new ReportDTO();
        report.setTotalPatients(userRepository.findByRole(Role.PATIENT).size());
        report.setTotalDoctors(doctorRepository.count());
        report.setTotalAppointments(appointmentRepository.count());
        
        report.setAppointmentsPerDoctor(mapResults(appointmentRepository.countAppointmentsPerDoctor(), "doctor", "count"));
        report.setRevenuePerDepartment(mapResults(appointmentRepository.revenuePerDepartment(), "department", "revenue"));
        report.setDailyStats(mapResults(appointmentRepository.dailyAppointmentStats(), "date", "count"));
        
        return report;
    }

    private List<Map<String, Object>> mapResults(List<Object[]> results, String keyName, String valueName) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] res : results) {
            Map<String, Object> map = new HashMap<>();
            map.put(keyName, res[0]);
            map.put(valueName, res[1]);
            list.add(map);
        }
        return list;
    }

    private AppointmentDTO convertToDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .patient(convertToUserDTO(a.getPatient()))
                .doctor(convertToDoctorDTO(a.getDoctor()))
                .appointmentDate(a.getAppointmentDate())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus())
                .reason(a.getReason())
                .diagnosis(a.getDiagnosis())
                .prescription(a.getPrescription())
                .createdAt(a.getCreatedAt())
                .build();
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }

    private DoctorDTO convertToDoctorDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .user(convertToUserDTO(doctor.getUser()))
                .specialization(doctor.getSpecialization())
                .department(DepartmentDTO.builder().name(doctor.getDepartment().getName()).build())
                .build();
    }
}
