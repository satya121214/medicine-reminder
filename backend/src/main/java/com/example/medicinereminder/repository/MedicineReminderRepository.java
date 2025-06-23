package com.example.medicinereminder.repository;

import com.example.medicinereminder.model.MedicineReminder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineReminderRepository extends JpaRepository<MedicineReminder, Long> {
}
