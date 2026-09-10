package dao;

import database.DBConnection;
import model.Diagnosis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * DiagnosisDAO - Clinical Assessment Persistence (1:1 with CaseHistory)
 */
public class DiagnosisDAO {

    public boolean addDiagnosis(Diagnosis diag, Connection conn) throws SQLException {
        String sql = "INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, diag.getCaseId());
            stmt.setString(2, diag.getDiagnosisText());
            stmt.setString(3, diag.getDoctorNotes());
            stmt.setDate(4, diag.getDiagnosisDate());
            return stmt.executeUpdate() > 0;
        }
    }

    public Diagnosis getDiagnosisByCaseId(int caseId) {
        String sql = "SELECT diagnosis_id, case_id, diagnosis_text, doctor_notes, diagnosis_date, created_at FROM diagnoses WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Diagnosis d = new Diagnosis();
                    d.setDiagnosisId(rs.getInt("diagnosis_id"));
                    d.setCaseId(rs.getInt("case_id"));
                    d.setDiagnosisText(rs.getString("diagnosis_text"));
                    d.setDoctorNotes(rs.getString("doctor_notes"));
                    d.setDiagnosisDate(rs.getDate("diagnosis_date"));
                    d.setCreatedAt(rs.getTimestamp("created_at"));
                    return d;
                }
            }
        } catch (SQLException e) {
            System.err.println("[DiagnosisDAO] getDiagnosisByCaseId error: " + e.getMessage());
        }
        return null;
    }
}
