package com.hospital.backend.controller;

import com.hospital.backend.dto.*;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
// @CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/doctors/search")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam String query) {
        return ResponseEntity.ok(doctorService.searchDoctors(query));
    }

    @GetMapping("/doctors/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    public ResponseEntity<DoctorDTO> getDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<List<DoctorAvailabilityDTO>> getAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(doctorService.getDoctorAvailability(id, date));
    }

    @PostMapping("/appointments/book/{patientId}")
    public ResponseEntity<AppointmentDTO> bookAppointment(
            @PathVariable Long patientId,
            @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(patientId, request));
    }

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentDTO>> getAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @PostMapping("/{patientId}/doctors/{doctorId}/review")
    public ResponseEntity<Void> addReview(
            @PathVariable Long patientId,
            @PathVariable Long doctorId,
            @RequestBody ReviewDTO reviewDTO) {
        appointmentService.addReview(patientId, doctorId, reviewDTO);
        return ResponseEntity.ok().build();
    }
}
