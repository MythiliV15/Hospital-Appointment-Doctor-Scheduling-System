package com.hospital.backend.controller;

import com.hospital.backend.dto.DoctorDTO;
import com.hospital.backend.dto.RegisterRequest;
import com.hospital.backend.dto.ReportDTO;
import com.hospital.backend.entity.AppointmentStatus;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/doctors")
    public ResponseEntity<DoctorDTO> addDoctor(
            @RequestBody RegisterRequest request,
            @RequestParam Long departmentId,
            @RequestParam String specialization,
            @RequestParam String qualification,
            @RequestParam(required = false) String bio,
            @RequestParam double fee) {
        return ResponseEntity.ok(doctorService.addDoctor(request, departmentId, specialization, qualification, bio, fee));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> removeDoctor(@PathVariable Long id) {
        doctorService.removeDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<ReportDTO> getAnalytics() {
        return ResponseEntity.ok(appointmentService.getSystemAnalytics());
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
        return ResponseEntity.ok().build();
    }
}
