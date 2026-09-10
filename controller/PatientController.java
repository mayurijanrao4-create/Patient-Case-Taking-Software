package controller;

import dao.PatientDAO;
import model.Patient;

import javax.swing.JOptionPane;
import java.awt.Component;
import java.util.List;

/**
 * PatientController - Validates and coordinates Patient CRUD operations
 */
public class PatientController {

    private final PatientDAO patientDAO;

    public PatientController() {
        this.patientDAO = new PatientDAO();
    }

    public boolean registerPatient(Patient patient, Component parent) {
        if (!validatePatient(patient, parent)) return false;

        if (patientDAO.existsById(patient.getPatientId())) {
            JOptionPane.showMessageDialog(parent, "Patient ID '" + patient.getPatientId() + "' already exists! Please use a unique ID.", "Duplicate ID Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }

        boolean success = patientDAO.addPatient(patient);
        if (success) {
            JOptionPane.showMessageDialog(parent, "Patient registered successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(parent, "Database error: Failed to register patient.", "Error", JOptionPane.ERROR_MESSAGE);
        }
        return success;
    }

    public boolean updatePatient(Patient patient, Component parent) {
        if (!validatePatient(patient, parent)) return false;

        boolean success = patientDAO.updatePatient(patient);
        if (success) {
            JOptionPane.showMessageDialog(parent, "Patient details updated successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(parent, "Failed to update patient record.", "Error", JOptionPane.ERROR_MESSAGE);
        }
        return success;
    }

    public boolean deletePatient(String patientId, Component parent) {
        int confirm = JOptionPane.showConfirmDialog(parent,
                "Are you sure you want to delete patient " + patientId + "?\nAll associated case histories, examinations, prescriptions, and follow-ups will be permanently deleted!",
                "Confirm Deletion", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            boolean success = patientDAO.deletePatient(patientId);
            if (success) {
                JOptionPane.showMessageDialog(parent, "Patient record deleted.", "Deleted", JOptionPane.INFORMATION_MESSAGE);
                return true;
            } else {
                JOptionPane.showMessageDialog(parent, "Failed to delete patient.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
        return false;
    }

    public List<Patient> getAllPatients() {
        return patientDAO.getAllPatients();
    }

    public List<Patient> searchPatients(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllPatients();
        }
        return patientDAO.searchPatients(keyword.trim());
    }

    public Patient getPatient(String patientId) {
        return patientDAO.getPatientById(patientId);
    }

    private boolean validatePatient(Patient p, Component parent) {
        if (p.getPatientId() == null || p.getPatientId().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Patient ID is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (p.getName() == null || p.getName().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Patient Full Name is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (p.getAge() <= 0 || p.getAge() > 125) {
            JOptionPane.showMessageDialog(parent, "Please enter a valid age between 1 and 125.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (p.getMobile() == null || !p.getMobile().trim().matches("^[0-9]{10}$")) {
            JOptionPane.showMessageDialog(parent, "Please enter a valid 10-digit mobile number.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (p.getAddress() == null || p.getAddress().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Address is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        return true;
    }
}
