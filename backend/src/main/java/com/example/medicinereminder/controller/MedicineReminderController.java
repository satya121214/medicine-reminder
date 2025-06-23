package com.example.medicinereminder.controller;

import com.example.medicinereminder.model.MedicineReminder;
import com.example.medicinereminder.repository.MedicineReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineReminderController {

    @Autowired
    private MedicineReminderRepository repository;

    @GetMapping
    public List<MedicineReminder> getAllReminders() {
        return repository.findAll();
    }

    @PostMapping
    public MedicineReminder createReminder(@RequestBody MedicineReminder reminder) {
        return repository.save(reminder);
    }

    @DeleteMapping("/{id}")
    public void deleteReminder(@PathVariable Long id) {
        repository.deleteById(id);
    }
@PutMapping("/{id}")
public MedicineReminder updateReminder(@PathVariable Long id, @RequestBody MedicineReminder updatedReminder) {
    return repository.findById(id)
            .map(reminder -> {
                reminder.setMedicineName(updatedReminder.getMedicineName());
                reminder.setDosageTime(updatedReminder.getDosageTime());
                reminder.setFrequency(updatedReminder.getFrequency());
                return repository.save(reminder);
            })
            .orElseThrow(() -> new RuntimeException("Reminder not found with id: " + id));
}


}
