package dao;

import database.DBConnection;
import model.Prescription;
import model.PrescriptionMedicine;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * PrescriptionDAO - Master-Detail Prescription Data Access (Prescription 1:N Medicines)
 */
public class PrescriptionDAO {

    public boolean addPrescriptionWithMedicines(Prescription presc, Connection conn) throws SQLException {
        String prescSql = "INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES (?, ?, ?)";
        int prescriptionId = -1;

        try (PreparedStatement stmt = conn.prepareStatement(prescSql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, presc.getCaseId());
            stmt.setDate(2, presc.getPrescriptionDate());
            stmt.setString(3, presc.getDoctorNotes());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    prescriptionId = rs.getInt(1);
                    presc.setPrescriptionId(prescriptionId);
                }
            }
        }

        if (prescriptionId == -1) return false;

        String itemSql = "INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement itemStmt = conn.prepareStatement(itemSql)) {
            for (PrescriptionMedicine item : presc.getMedicines()) {
                itemStmt.setInt(1, prescriptionId);
                itemStmt.setString(2, item.getMedicineName());
                itemStmt.setString(3, item.getDosage());
                itemStmt.setString(4, item.getFrequency());
                itemStmt.setString(5, item.getDuration());
                itemStmt.setString(6, item.getInstructions());
                itemStmt.addBatch();
            }
            itemStmt.executeBatch();
        }
        return true;
    }

    public Prescription getPrescriptionByCaseId(int caseId) {
        String sql = "SELECT prescription_id, case_id, prescription_date, doctor_notes, created_at FROM prescriptions WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Prescription p = new Prescription();
                    int prescId = rs.getInt("prescription_id");
                    p.setPrescriptionId(prescId);
                    p.setCaseId(rs.getInt("case_id"));
                    p.setPrescriptionDate(rs.getDate("prescription_date"));
                    p.setDoctorNotes(rs.getString("doctor_notes"));
                    p.setCreatedAt(rs.getTimestamp("created_at"));
                    p.setMedicines(getMedicinesByPrescriptionId(prescId, conn));
                    return p;
                }
            }
        } catch (SQLException e) {
            System.err.println("[PrescriptionDAO] getPrescriptionByCaseId error: " + e.getMessage());
        }
        return null;
    }

    public List<PrescriptionMedicine> getMedicinesByPrescriptionId(int prescriptionId, Connection conn) {
        List<PrescriptionMedicine> list = new ArrayList<>();
        String sql = "SELECT item_id, prescription_id, medicine_name, dosage, frequency, duration, instructions FROM prescription_medicines WHERE prescription_id = ? ORDER BY item_id ASC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, prescriptionId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    PrescriptionMedicine m = new PrescriptionMedicine();
                    m.setItemId(rs.getInt("item_id"));
                    m.setPrescriptionId(rs.getInt("prescription_id"));
                    m.setMedicineName(rs.getString("medicine_name"));
                    m.setDosage(rs.getString("dosage"));
                    m.setFrequency(rs.getString("frequency"));
                    m.setDuration(rs.getString("duration"));
                    m.setInstructions(rs.getString("instructions"));
                    list.add(m);
                }
            }
        } catch (SQLException e) {
            System.err.println("[PrescriptionDAO] getMedicinesByPrescriptionId error: " + e.getMessage());
        }
        return list;
    }
}
