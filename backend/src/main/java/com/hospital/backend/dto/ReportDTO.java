package com.hospital.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private List<Map<String, Object>> appointmentsPerDoctor;
    private List<Map<String, Object>> revenuePerDepartment;
    private List<Map<String, Object>> dailyStats;
}
