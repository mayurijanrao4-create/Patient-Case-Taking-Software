package controller;

import dao.CaseHistoryDAO;
import dao.DiagnosisDAO;
import dao.ExaminationDAO;
import dao.FollowUpDAO;
import dao.PrescriptionDAO;
import database.DBConnection;
import model.CaseHistory;
import model.Diagnosis;
import model.Examination;
import model.FollowUp;
import model.Prescription;

import javax.swing.JOptionPane;
import java.awt.Component;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * CaseController - Coordinates full case taking across 5 tables in an ACID JDBC Transaction
 */
public class CaseController {

    private final CaseHistoryDAO caseDAO;
    private final ExaminationDAO examDAO;
    private final DiagnosisDAO diagDAO;
    private final PrescriptionDAO prescDAO;
    private final FollowUpDAO followUpDAO;

    public CaseController() {
        this.caseDAO = new CaseHistoryDAO();
        this.examDAO = new ExaminationDAO();
        this.diagDAO = new DiagnosisDAO();
        this.prescDAO = new PrescriptionDAO();
        this.followUpDAO = new FollowUpDAO();
    }

    public boolean saveFullCase(CaseHistory caseHistory, Examination exam, Diagnosis diag, Prescription prescription, FollowUp followUp, Component parent) {
        // Validation
        if (caseHistory.getPatientId() == null || caseHistory.getPatientId().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Patient ID is missing!", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (caseHistory.getChiefComplaint() == null || caseHistory.getChiefComplaint().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Chief Complaint is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (diag.getDiagnosisText() == null || diag.getDiagnosisText().trim().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Clinical Diagnosis is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (prescription.getMedicines().isEmpty()) {
            JOptionPane.showMessageDialog(parent, "Please prescribe at least one medicine!", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }

        Connection conn = DBConnection.getConnection();
        if (conn == null) {
            JOptionPane.showMessageDialog(parent, "No database connection available.", "Database Error", JOptionPane.ERROR_MESSAGE);
            return false;
        }

        try {
            // Begin ACID Transaction
            conn.setAutoCommit(false);

            // 1. Insert Case History
            int caseId = caseDAO.addCaseHistory(caseHistory, conn);
            if (caseId <= 0) {
                conn.rollback();
                JOptionPane.showMessageDialog(parent, "Failed to insert Case History record.", "Error", JOptionPane.ERROR_MESSAGE);
                return false;
            }

            // 2. Insert Physical Examination (1:1)
            exam.setCaseId(caseId);
            examDAO.addExamination(exam, conn);

            // 3. Insert Diagnosis (1:1)
            diag.setCaseId(caseId);
            diagDAO.addDiagnosis(diag, conn);

            // 4. Insert Prescription & Medicines (1:1 & 1:N)
            prescription.setCaseId(caseId);
            prescDAO.addPrescriptionWithMedicines(prescription, conn);

            // 5. Insert Follow-up if scheduled (1:N)
            if (followUp != null && followUp.getFollowupDate() != null) {
                followUp.setCaseId(caseId);
                followUpDAO.addFollowUp(followUp, conn);
            }

            // Commit all changes atomically
            conn.commit();
            conn.setAutoCommit(true);

            JOptionPane.showMessageDialog(parent, "Complete Consultation Record saved successfully! Case ID: #" + caseId, "Case Saved", JOptionPane.INFORMATION_MESSAGE);
            return true;
        } catch (SQLException e) {
            try {
                conn.rollback();
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                System.err.println("[CaseController] Rollback failed: " + ex.getMessage());
            }
            JOptionPane.showMessageDialog(parent, "Transaction Error while saving case: " + e.getMessage(), "Database Transaction Failed", JOptionPane.ERROR_MESSAGE);
            return false;
        }
    }

    public List<CaseHistory> getPatientCases(String patientId) {
        return caseDAO.getCasesByPatientId(patientId);
    }

    public Examination getExamination(int caseId) {
        return examDAO.getExaminationByCaseId(caseId);
    }

    public Diagnosis getDiagnosis(int caseId) {
        return diagDAO.getDiagnosisByCaseId(caseId);
    }

    public Prescription getPrescription(int caseId) {
        return prescDAO.getPrescriptionByCaseId(caseId);
    }

    public List<FollowUp> getFollowUps(int caseId) {
        return followUpDAO.getFollowUpsByCaseId(caseId);
    }
}
