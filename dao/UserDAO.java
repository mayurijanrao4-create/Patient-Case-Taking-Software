package dao;

import database.DBConnection;
import model.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * UserDAO - Data Access Object for User Authentication and Management
 */
public class UserDAO {

    public User authenticate(String username, String password) {
        String sql = "SELECT user_id, username, password, full_name, role, email, specialization, phone " +
                     "FROM users WHERE username = ? AND password = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setUserId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setPassword(rs.getString("password"));
                    user.setFullName(rs.getString("full_name"));
                    user.setRole(rs.getString("role"));
                    user.setEmail(rs.getString("email"));
                    user.setSpecialization(rs.getString("specialization"));
                    user.setPhone(rs.getString("phone"));
                    return user;
                }
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] Authenticate error: " + e.getMessage());
        }
        return null;
    }

    public List<User> getAllDoctors() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT user_id, username, full_name, role, email, specialization, phone FROM users WHERE role = 'Doctor' ORDER BY full_name";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                User u = new User();
                u.setUserId(rs.getInt("user_id"));
                u.setUsername(rs.getString("username"));
                u.setFullName(rs.getString("full_name"));
                u.setRole(rs.getString("role"));
                u.setEmail(rs.getString("email"));
                u.setSpecialization(rs.getString("specialization"));
                u.setPhone(rs.getString("phone"));
                list.add(u);
            }
        } catch (SQLException e) {
            System.err.println("[UserDAO] getAllDoctors error: " + e.getMessage());
        }
        return list;
    }
}
