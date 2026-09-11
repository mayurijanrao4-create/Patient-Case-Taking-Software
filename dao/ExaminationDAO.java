package dao;

import database.DBConnection;
import model.Examination;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * ExaminationDAO - Physical Examination & Vitals (1:1 with CaseHistory)
 */
public class ExaminationDAO {

    public boolean addExamination(Examination exam, Connection conn) throws SQLException {
        String sql = "INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, exam.getCaseId());
            stmt.setFloat(2, exam.getTemperature());
            stmt.setString(3, exam.getBloodPressure());
            stmt.setInt(4, exam.getPulseRate());
            stmt.setFloat(5, exam.getWeight());
            stmt.setFloat(6, exam.getHeight());
            stmt.setString(7, exam.getObservation());
            return stmt.executeUpdate() > 0;
        }
    }

    public Examination getExaminationByCaseId(int caseId) {
        String sql = "SELECT exam_id, case_id, temperature, blood_pressure, pulse_rate, weight, height, observation, created_at FROM examinations WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Examination exam = new Examination();
                    exam.setExamId(rs.getInt("exam_id"));
                    exam.setCaseId(rs.getInt("case_id"));
                    exam.setTemperature(rs.getFloat("temperature"));
                    exam.setBloodPressure(rs.getString("blood_pressure"));
                    exam.setPulseRate(rs.getInt("pulse_rate"));
                    exam.setWeight(rs.getFloat("weight"));
                    exam.setHeight(rs.getFloat("height"));
                    exam.setObservation(rs.getString("observation"));
                    exam.setCreatedAt(rs.getTimestamp("created_at"));
                    return exam;
                }
            }
        } catch (SQLException e) {
            System.err.println("[ExaminationDAO] getExaminationByCaseId error: " + e.getMessage());
        }
        return null;
    }
}
