package com.hospital.backend.controller;

import com.hospital.backend.dto.AppointmentDTO;
import com.hospital.backend.dto.DoctorAvailabilityDTO;
import com.hospital.backend.entity.AppointmentStatus;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import com.hospital.backend.entity.User;
import com.hospital.backend.entity.Doctor;

@RestController
@RequestMapping("/api/doctor")
// @CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private com.hospital.backend.repository.DoctorRepository doctorRepository;
    
    @Autowired
    private com.hospital.backend.repository.UserRepository userRepository;

    @PostMapping("/availability")
    public ResponseEntity<DoctorAvailabilityDTO> addAvailability(@RequestBody DoctorAvailabilityDTO dto) {
        // Ensure doctorId is correct if coming from user ID
        if (dto.getDoctorId() != null) {
            User user = userRepository.findById(dto.getDoctorId()).orElse(null);
            if (user != null) {
                Doctor doc = doctorRepository.findByUser(user).orElse(null);
                if (doc != null) dto.setDoctorId(doc.getId());
            }
        }
        return ResponseEntity.ok(doctorService.addAvailability(dto));
    }

    @GetMapping("/{userId}/appointments")
    public ResponseEntity<List<AppointmentDTO>> getAppointments(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Doctor doc = doctorRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Doctor not found"));
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doc.getId()));
    }

    @DeleteMapping("/availability/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        doctorService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/availability")
    public ResponseEntity<List<DoctorAvailabilityDTO>> getMyAvailability(@RequestParam Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Doctor doc = doctorRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Doctor not found"));
        return ResponseEntity.ok(doctorService.getDoctorAvailability(doc.getId(), java.time.LocalDate.of(2000, 1, 1)));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentDTO> updateStatus(
            @PathVariable Long id, 
            @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}
