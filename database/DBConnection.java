package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;

/**
 * DBConnection - Database Connection Manager (JDBC)
 * Manages singleton Connection to MySQL database PatientCaseDB using JDBC.
 */
public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/PatientCaseDB?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password"; // Update with your local MySQL password

    private static Connection connection = null;

    private DBConnection() {}

    public static synchronized Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                System.out.println("[DBConnection] Connected to PatientCaseDB successfully.");
            }
        } catch (ClassNotFoundException e) {
            String errorMsg = "MySQL JDBC Driver not found in Classpath!\n"
                            + "Please add mysql-connector-j-8.x.jar to project Libraries.\n"
                            + "Error: " + e.getMessage();
            System.err.println(errorMsg);
            JOptionPane.showMessageDialog(null, errorMsg, "Database Driver Error", JOptionPane.ERROR_MESSAGE);
        } catch (SQLException e) {
            String errorMsg = "Cannot connect to MySQL database: PatientCaseDB\n"
                            + "Please check if MySQL Server is running on port 3306 and password is correct.\n"
                            + "Error: " + e.getMessage();
            System.err.println(errorMsg);
            JOptionPane.showMessageDialog(null, errorMsg, "Database Connection Error", JOptionPane.ERROR_MESSAGE);
        }
        return connection;
    }

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                connection = null;
                System.out.println("[DBConnection] Connection closed.");
            } catch (SQLException e) {
                System.err.println("[DBConnection] Error closing connection: " + e.getMessage());
            }
        }
    }
}
