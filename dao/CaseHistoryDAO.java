package dao;

import database.DBConnection;
import model.CaseHistory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * CaseHistoryDAO - Consultation Encounter Data Access (1:N Patient-to-Case)
 */
public class CaseHistoryDAO {

    public int addCaseHistory(CaseHistory ch, Connection conn) throws SQLException {
        String sql = "INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, ch.getPatientId());
            stmt.setInt(2, ch.getDoctorId());
            stmt.setDate(3, ch.getVisitDate());
            stmt.setString(4, ch.getChiefComplaint());
            stmt.setString(5, ch.getSymptoms());
            stmt.setString(6, ch.getDuration());
            stmt.setString(7, ch.getPastHistory());
            stmt.setString(8, ch.getAllergy());
            stmt.setString(9, ch.getFamilyHistory());
            stmt.setString(10, ch.getCurrentMedication());

            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return -1;
    }

    public List<CaseHistory> getCasesByPatientId(String patientId) {
        List<CaseHistory> list = new ArrayList<>();
        String sql = "SELECT case_id, patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication, created_at " +
                     "FROM case_history WHERE patient_id = ? ORDER BY visit_date DESC, case_id DESC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    CaseHistory ch = new CaseHistory();
                    ch.setCaseId(rs.getInt("case_id"));
                    ch.setPatientId(rs.getString("patient_id"));
                    ch.setDoctorId(rs.getInt("doctor_id"));
                    ch.setVisitDate(rs.getDate("visit_date"));
                    ch.setChiefComplaint(rs.getString("chief_complaint"));
                    ch.setSymptoms(rs.getString("symptoms"));
                    ch.setDuration(rs.getString("duration"));
                    ch.setPastHistory(rs.getString("past_history"));
                    ch.setAllergy(rs.getString("allergy"));
                    ch.setFamilyHistory(rs.getString("family_history"));
                    ch.setCurrentMedication(rs.getString("current_medication"));
                    ch.setCreatedAt(rs.getTimestamp("created_at"));
                    list.add(ch);
                }
            }
        } catch (SQLException e) {
            System.err.println("[CaseHistoryDAO] getCasesByPatientId error: " + e.getMessage());
        }
        return list;
    }
}
