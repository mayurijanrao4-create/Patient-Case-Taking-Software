package dao;

import database.DBConnection;
import model.Patient;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * PatientDAO - CRUD and Search Operations for Patient Demographics
 */
public class PatientDAO {

    public boolean addPatient(Patient patient) {
        String sql = "INSERT INTO patients (patient_id, name, age, gender, mobile, address, blood_group) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patient.getPatientId());
            stmt.setString(2, patient.getName());
            stmt.setInt(3, patient.getAge());
            stmt.setString(4, patient.getGender());
            stmt.setString(5, patient.getMobile());
            stmt.setString(6, patient.getAddress());
            stmt.setString(7, patient.getBloodGroup());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[PatientDAO] addPatient error: " + e.getMessage());
            return false;
        }
    }

    public boolean updatePatient(Patient patient) {
        String sql = "UPDATE patients SET name = ?, age = ?, gender = ?, mobile = ?, address = ?, blood_group = ? WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patient.getName());
            stmt.setInt(2, patient.getAge());
            stmt.setString(3, patient.getGender());
            stmt.setString(4, patient.getMobile());
            stmt.setString(5, patient.getAddress());
            stmt.setString(6, patient.getBloodGroup());
            stmt.setString(7, patient.getPatientId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[PatientDAO] updatePatient error: " + e.getMessage());
            return false;
        }
    }

    public boolean deletePatient(String patientId) {
        String sql = "DELETE FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[PatientDAO] deletePatient error: " + e.getMessage());
            return false;
        }
    }

    public Patient getPatientById(String patientId) {
        String sql = "SELECT patient_id, name, age, gender, mobile, address, blood_group, registered_date, created_at FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Patient p = new Patient();
                    p.setPatientId(rs.getString("patient_id"));
                    p.setName(rs.getString("name"));
                    p.setAge(rs.getInt("age"));
                    p.setGender(rs.getString("gender"));
                    p.setMobile(rs.getString("mobile"));
                    p.setAddress(rs.getString("address"));
                    p.setBloodGroup(rs.getString("blood_group"));
                    p.setRegisteredDate(rs.getDate("registered_date"));
                    p.setCreatedAt(rs.getTimestamp("created_at"));
                    return p;
                }
            }
        } catch (SQLException e) {
            System.err.println("[PatientDAO] getPatientById error: " + e.getMessage());
        }
        return null;
    }

    public List<Patient> getAllPatients() {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT patient_id, name, age, gender, mobile, address, blood_group, registered_date FROM patients ORDER BY name ASC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Patient p = new Patient();
                p.setPatientId(rs.getString("patient_id"));
                p.setName(rs.getString("name"));
                p.setAge(rs.getInt("age"));
                p.setGender(rs.getString("gender"));
                p.setMobile(rs.getString("mobile"));
                p.setAddress(rs.getString("address"));
                p.setBloodGroup(rs.getString("blood_group"));
                p.setRegisteredDate(rs.getDate("registered_date"));
                list.add(p);
            }
        } catch (SQLException e) {
            System.err.println("[PatientDAO] getAllPatients error: " + e.getMessage());
        }
        return list;
    }

    public List<Patient> searchPatients(String keyword) {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT patient_id, name, age, gender, mobile, address, blood_group, registered_date " +
                     "FROM patients WHERE patient_id LIKE ? OR name LIKE ? OR mobile LIKE ? ORDER BY name ASC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            String pattern = "%" + keyword + "%";
            stmt.setString(1, pattern);
            stmt.setString(2, pattern);
            stmt.setString(3, pattern);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Patient p = new Patient();
                    p.setPatientId(rs.getString("patient_id"));
                    p.setName(rs.getString("name"));
                    p.setAge(rs.getInt("age"));
                    p.setGender(rs.getString("gender"));
                    p.setMobile(rs.getString("mobile"));
                    p.setAddress(rs.getString("address"));
                    p.setBloodGroup(rs.getString("blood_group"));
                    p.setRegisteredDate(rs.getDate("registered_date"));
                    list.add(p);
                }
            }
        } catch (SQLException e) {
            System.err.println("[PatientDAO] searchPatients error: " + e.getMessage());
        }
        return list;
    }

    public boolean existsById(String patientId) {
        String sql = "SELECT 1 FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("[PatientDAO] existsById error: " + e.getMessage());
            return false;
        }
    }
}
