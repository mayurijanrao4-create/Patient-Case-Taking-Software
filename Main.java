import database.DBConnection;
import view.LoginFrame;

import javax.swing.*;
import java.sql.Connection;

/**
 * Main Class - Application Entry Point
 * Academic Project: Patient Case-Taking Software
 */
public class Main {

    public static void main(String[] args) {
        // Set Native System Look and Feel for modern desktop styling
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            System.out.println("Using default Swing Look & Feel.");
        }

        // Run GUI on Swing Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            System.out.println("Starting Patient Case-Taking Software...");
            Connection conn = DBConnection.getConnection();
            if (conn != null) {
                System.out.println("[Main] MySQL Database connection verified.");
            } else {
                System.out.println("[Main] Warning: Could not connect to MySQL PatientCaseDB at startup. Check port 3306 and password.");
            }

            // Launch Login Interface
            new LoginFrame().setVisible(true);
        });
    }
}

