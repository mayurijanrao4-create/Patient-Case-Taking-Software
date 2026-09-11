package view;

import controller.LoginController;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;

/**
 * Screen 1: Login Screen
 * Hospital credential authentication with role dispatch (Doctor / Administrator).
 */
public class LoginFrame extends JFrame {
    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private JComboBox<String> cmbRole;
    private JButton btnLogin;
    private JButton btnReset;

    public LoginFrame() {
        setTitle("Hospital Case-Taking System - Clinician Authentication");
        setSize(480, 420);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setResizable(false);

        initComponents();
        new LoginController(this);
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 0));
        root.setBackground(UITheme.BG_LIGHT);

        // Medical Blue Header Banner
        JPanel headerPanel = new JPanel(new GridLayout(2, 1, 0, 4));
        headerPanel.setBackground(UITheme.PRIMARY);
        headerPanel.setBorder(new EmptyBorder(22, 25, 22, 25));

        JLabel lblTitle = new JLabel("Patient Case-Taking Software", JLabel.CENTER);
        lblTitle.setFont(UITheme.FONT_APP_TITLE);
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSubtitle = new JLabel("Secure Hospital Clinical Information & Anamnesis System", JLabel.CENTER);
        lblSubtitle.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSubtitle.setForeground(new Color(219, 234, 254));

        headerPanel.add(lblTitle);
        headerPanel.add(lblSubtitle);
        root.add(headerPanel, BorderLayout.NORTH);

        // Center Login Card
        JPanel centerWrapper = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 20));
        centerWrapper.setOpaque(false);

        JPanel card = UITheme.createCard();
        card.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 10, 8, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        txtUsername = new JTextField("doctor", 16);
        txtUsername.setFont(UITheme.FONT_BODY);

        txtPassword = new JPasswordField("doctor123", 16);
        txtPassword.setFont(UITheme.FONT_BODY);

        cmbRole = new JComboBox<>(new String[]{"DOCTOR", "ADMIN"});
        cmbRole.setFont(UITheme.FONT_BODY);

        gbc.gridx = 0; gbc.gridy = 0;
        card.add(new JLabel("Username:"), gbc);
        gbc.gridx = 1;
        card.add(txtUsername, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        card.add(new JLabel("Password:"), gbc);
        gbc.gridx = 1;
        card.add(txtPassword, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        card.add(new JLabel("User Role:"), gbc);
        gbc.gridx = 1;
        card.add(cmbRole, gbc);

        // Action Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 14, 10));
        buttonPanel.setOpaque(false);

        btnLogin = UITheme.createPrimaryButton("Sign In to Portal");
        btnReset = UITheme.createSecondaryButton("Clear Fields");

        buttonPanel.add(btnLogin);
        buttonPanel.add(btnReset);

        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 2;
        card.add(buttonPanel, gbc);

        centerWrapper.add(card);
        root.add(centerWrapper, BorderLayout.CENTER);

        // Footer
        JLabel lblFooter = new JLabel("Default: doctor / doctor123 | admin / admin123", JLabel.CENTER);
        lblFooter.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lblFooter.setForeground(UITheme.TEXT_MUTED);
        lblFooter.setBorder(new EmptyBorder(0, 0, 15, 0));
        root.add(lblFooter, BorderLayout.SOUTH);

        setContentPane(root);
    }

    public String getUsername() { return txtUsername.getText().trim(); }
    public String getPassword() { return new String(txtPassword.getPassword()); }
    public String getSelectedRole() { return (String) cmbRole.getSelectedItem(); }
    public JButton getBtnLogin() { return btnLogin; }
    public JButton getBtnReset() { return btnReset; }

    public void clearFields() {
        txtUsername.setText("");
        txtPassword.setText("");
        cmbRole.setSelectedIndex(0);
        txtUsername.requestFocus();
    }
}
