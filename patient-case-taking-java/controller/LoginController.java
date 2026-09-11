package controller;

import dao.UserDAO;
import model.User;
import view.AdminDashboard;
import view.DoctorDashboard;

import javax.swing.JFrame;
import javax.swing.JOptionPane;

/**
 * LoginController - Handles staff authentication and role-based dashboard routing
 */
public class LoginController {

    private final UserDAO userDAO;

    public LoginController() {
        this.userDAO = new UserDAO();
    }

    public boolean handleLogin(String username, String password, JFrame currentFrame) {
        if (username == null || username.trim().isEmpty()) {
            JOptionPane.showMessageDialog(currentFrame, "Please enter your username.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }
        if (password == null || password.trim().isEmpty()) {
            JOptionPane.showMessageDialog(currentFrame, "Please enter your password.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return false;
        }

        User user = userDAO.authenticate(username.trim(), password.trim());
        if (user != null) {
            JOptionPane.showMessageDialog(currentFrame, "Welcome, " + user.getFullName() + " (" + user.getRole() + ")", "Login Successful", JOptionPane.INFORMATION_MESSAGE);
            currentFrame.dispose();

            if ("Admin".equalsIgnoreCase(user.getRole())) {
                new AdminDashboard(user).setVisible(true);
            } else {
                new DoctorDashboard(user).setVisible(true);
            }
            return true;
        } else {
            JOptionPane.showMessageDialog(currentFrame, "Invalid Username or Password!", "Authentication Failed", JOptionPane.ERROR_MESSAGE);
            return false;
        }
    }
}
