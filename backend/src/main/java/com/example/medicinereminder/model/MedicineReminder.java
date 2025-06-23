package com.example.medicinereminder.model;

import jakarta.persistence.*;

@Entity
public class MedicineReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;
    private String dosageTime;
    private String frequency;

    // Getters
    public Long getId() { return id; }
    public String getMedicineName() { return medicineName; }
    public String getDosageTime() { return dosageTime; }
    public String getFrequency() { return frequency; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public void setDosageTime(String dosageTime) { this.dosageTime = dosageTime; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
}
