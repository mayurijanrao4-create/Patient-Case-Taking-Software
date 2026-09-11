package dao;

import database.DBConnection;
import model.FollowUp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * FollowUpDAO - Patient Follow-Up Review Scheduling (1:N with CaseHistory)
 */
public class FollowUpDAO {

    public boolean addFollowUp(FollowUp followUp, Connection conn) throws SQLException {
        String sql = "INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, followUp.getCaseId());
            stmt.setDate(2, followUp.getFollowupDate());
            stmt.setString(3, followUp.getNotes());
            stmt.setString(4, followUp.getStatus());
            return stmt.executeUpdate() > 0;
        }
    }

    public List<FollowUp> getFollowUpsByCaseId(int caseId) {
        List<FollowUp> list = new ArrayList<>();
        String sql = "SELECT followup_id, case_id, followup_date, notes, status, created_at FROM follow_ups WHERE case_id = ? ORDER BY followup_date ASC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    FollowUp f = new FollowUp();
                    f.setFollowupId(rs.getInt("followup_id"));
                    f.setCaseId(rs.getInt("case_id"));
                    f.setFollowupDate(rs.getDate("followup_date"));
                    f.setNotes(rs.getString("notes"));
                    f.setStatus(rs.getString("status"));
                    f.setCreatedAt(rs.getTimestamp("created_at"));
                    list.add(f);
                }
            }
        } catch (SQLException e) {
            System.err.println("[FollowUpDAO] getFollowUpsByCaseId error: " + e.getMessage());
        }
        return list;
    }

    public List<FollowUp> getScheduledFollowUps() {
        List<FollowUp> list = new ArrayList<>();
        String sql = "SELECT followup_id, case_id, followup_date, notes, status, created_at FROM follow_ups WHERE status = 'Scheduled' ORDER BY followup_date ASC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                FollowUp f = new FollowUp();
                f.setFollowupId(rs.getInt("followup_id"));
                f.setCaseId(rs.getInt("case_id"));
                f.setFollowupDate(rs.getDate("followup_date"));
                f.setNotes(rs.getString("notes"));
                f.setStatus(rs.getString("status"));
                f.setCreatedAt(rs.getTimestamp("created_at"));
                list.add(f);
            }
        } catch (SQLException e) {
            System.err.println("[FollowUpDAO] getScheduledFollowUps error: " + e.getMessage());
        }
        return list;
    }
}
