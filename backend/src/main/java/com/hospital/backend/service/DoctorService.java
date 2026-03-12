package com.hospital.backend.service;

import com.hospital.backend.dto.*;
import com.hospital.backend.entity.*;
import com.hospital.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> searchDoctors(String query) {
        return doctorRepository.searchDoctors(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToDTO(doctor);
    }

    @Transactional
    public DoctorDTO addDoctor(RegisterRequest request, Long departmentId, String specialization, String qualification, String bio, double fee) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.DOCTOR)
                .build();

        user = userRepository.save(user);

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Doctor doctor = Doctor.builder()
                .user(user)
                .department(department)
                .specialization(specialization)
                .bio(bio)
                .qualification(qualification)
                .consultationFee(fee)
                .averageRating(0.0)
                .build();

        return convertToDTO(doctorRepository.save(doctor));
    }

    public void removeDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // Availability Management
    public List<DoctorAvailabilityDTO> getDoctorAvailability(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return availabilityRepository.findByDoctorAndAvailableDateGreaterThanEqual(doctor, date).stream()
                .map(this::convertToAvailabilityDTO)
                .collect(Collectors.toList());
    }

    public DoctorAvailabilityDTO addAvailability(DoctorAvailabilityDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DoctorAvailability availability = DoctorAvailability.builder()
                .doctor(doctor)
                .availableDate(dto.getAvailableDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .isBooked(false)
                .build();

        return convertToAvailabilityDTO(availabilityRepository.save(availability));
    }

    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
    
    // Reviews
    public List<ReviewDTO> getDoctorReviews(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return reviewRepository.findByDoctorOrderByCreatedAtDesc(doctor).stream()
                .map(this::convertToReviewDTO)
                .collect(Collectors.toList());
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .user(convertToUserDTO(doctor.getUser()))
                .specialization(doctor.getSpecialization())
                .bio(doctor.getBio())
                .qualification(doctor.getQualification())
                .consultationFee(doctor.getConsultationFee())
                .averageRating(doctor.getAverageRating())
                .department(DepartmentDTO.builder()
                        .id(doctor.getDepartment().getId())
                        .name(doctor.getDepartment().getName())
                        .build())
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

    private DoctorAvailabilityDTO convertToAvailabilityDTO(DoctorAvailability a) {
        return DoctorAvailabilityDTO.builder()
                .id(a.getId())
                .doctorId(a.getDoctor().getId())
                .availableDate(a.getAvailableDate())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .isBooked(a.isBooked())
                .build();
    }
    
    private ReviewDTO convertToReviewDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .patient(convertToUserDTO(r.getPatient()))
                .doctorId(r.getDoctor().getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
