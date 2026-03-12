package com.hospital.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Long id;
    private UserDTO user;
    private String specialization;
    private String bio;
    private String qualification;
    private double consultationFee;
    private DepartmentDTO department;
    private double averageRating;
}
