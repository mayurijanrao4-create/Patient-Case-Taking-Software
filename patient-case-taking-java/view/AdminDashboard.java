package view;

import dao.UserDAO;
import model.User;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 2: Admin Dashboard
 * System administration panel for user access control, security audits, and global healthcare records.
 */
public class AdminDashboard extends JFrame {
    private final User currentUser;
    private final UserDAO userDAO = new UserDAO();

    public AdminDashboard(User user) {
        this.currentUser = user;
        setTitle("System Administration & User Management - " + user.getFullName());
        setSize(980, 650);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        initComponents();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 15));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        JPanel topBar = new JPanel(new BorderLayout());
        topBar.setBackground(UITheme.PRIMARY);
        topBar.setBorder(new EmptyBorder(14, 24, 14, 24));

        JPanel badge = new JPanel(new GridLayout(2, 1));
        badge.setOpaque(false);
        JLabel lblTitle = new JLabel("Hospital System Administration");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSub = new JLabel("Administrator: " + currentUser.getFullName() + " | Full Access Mode");
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSub.setForeground(new Color(219, 234, 254));

        badge.add(lblTitle);
        badge.add(lblSub);
        topBar.add(badge, BorderLayout.WEST);

        JButton btnLogout = UITheme.createSecondaryButton("Sign Out");
        btnLogout.addActionListener(e -> {
            dispose();
            new LoginFrame().setVisible(true);
        });
        topBar.add(btnLogout, BorderLayout.EAST);
        root.add(topBar, BorderLayout.NORTH);

        // Center Tabs & Tables
        JPanel centerPanel = new JPanel(new BorderLayout(0, 12));
        centerPanel.setBorder(new EmptyBorder(10, 24, 10, 24));
        centerPanel.setOpaque(false);

        // Quick Navigation Tiles
        JPanel quickTiles = new JPanel(new GridLayout(1, 3, 14, 14));
        quickTiles.setOpaque(false);

        quickTiles.add(createTile("Patient Directory", "Open master outpatient demographic register", e -> new PatientManagementFrame().setVisible(true)));
        quickTiles.add(createTile("Case History Archives", "Audit comprehensive patient medical dossiers", e -> new CaseHistoryFrame().setVisible(true)));
        quickTiles.add(createTile("System Activity Reports", "View department KPIs and prescription summaries", e -> new ReportsFrame().setVisible(true)));
        centerPanel.add(quickTiles, BorderLayout.NORTH);

        // User Accounts Table Card
        JPanel cardUsers = new JPanel(new BorderLayout(0, 10));
        cardUsers.setBackground(Color.WHITE);
        cardUsers.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 16, 12, 16)));

        JPanel userHeader = new JPanel(new BorderLayout());
        userHeader.setOpaque(false);
        JLabel lblUsers = new JLabel("Authorized System Users (Doctors & Administrators)");
        lblUsers.setFont(UITheme.FONT_SUBTITLE);
        lblUsers.setForeground(UITheme.PRIMARY);

        JButton btnCreateUser = UITheme.createSuccessButton("+ Add New Clinician / Admin");
        userHeader.add(lblUsers, BorderLayout.WEST);
        userHeader.add(btnCreateUser, BorderLayout.EAST);
        cardUsers.add(userHeader, BorderLayout.NORTH);

        DefaultTableModel userModel = new DefaultTableModel(new String[]{"ID", "Username", "Full Name", "Designated Role", "Account Created"}, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };
        JTable tblUsers = new JTable(userModel);
        UITheme.styleTable(tblUsers);
        cardUsers.add(new JScrollPane(tblUsers), BorderLayout.CENTER);

        centerPanel.add(cardUsers, BorderLayout.CENTER);
        root.add(centerPanel, BorderLayout.CENTER);

        btnCreateUser.addActionListener(e -> showAddUserDialog(userModel));

        setContentPane(root);
        loadUsers(userModel);
    }

    private JPanel createTile(String title, String desc, java.awt.event.ActionListener action) {
        JPanel card = new JPanel(new BorderLayout(6, 6));
        card.setBackground(Color.WHITE);
        card.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 14, 12, 14)));

        JLabel t = new JLabel(title);
        t.setFont(UITheme.FONT_LABEL);
        t.setForeground(UITheme.PRIMARY);

        JLabel d = new JLabel("<html><body style='width: 170px; color: #64748B; font-size: 11px;'>" + desc + "</body></html>");
        JButton b = UITheme.createPrimaryButton("Open");
        b.addActionListener(action);

        card.add(t, BorderLayout.NORTH);
        card.add(d, BorderLayout.CENTER);
        card.add(b, BorderLayout.SOUTH);
        return card;
    }

    private void loadUsers(DefaultTableModel model) {
        try {
            model.setRowCount(0);
            List<User> list = userDAO.getAllUsers();
            for (User u : list) {
                model.addRow(new Object[]{u.getUserId(), u.getUsername(), u.getFullName(), u.getRole(), u.getCreatedAt()});
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Failed to load users: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void showAddUserDialog(DefaultTableModel model) {
        JTextField txtU = new JTextField();
        JPasswordField txtP = new JPasswordField();
        JTextField txtN = new JTextField();
        JComboBox<String> cmbR = new JComboBox<>(new String[]{"DOCTOR", "ADMIN"});

        Object[] msg = {
            "Username:", txtU,
            "Password:", txtP,
            "Full Name:", txtN,
            "Designated Role:", cmbR
        };

        int opt = JOptionPane.showConfirmDialog(this, msg, "Create System User Account", JOptionPane.OK_CANCEL_OPTION);
        if (opt == JOptionPane.OK_OPTION) {
            String u = txtU.getText().trim();
            String p = new String(txtP.getPassword()).trim();
            String n = txtN.getText().trim();
            String r = (String) cmbR.getSelectedItem();

            if (u.isEmpty() || p.isEmpty() || n.isEmpty()) {
                JOptionPane.showMessageDialog(this, "All fields are mandatory.", "Validation Error", JOptionPane.WARNING_MESSAGE);
                return;
            }

            try {
                User newUser = new User(0, u, p, n, r, null);
                if (userDAO.createUser(newUser)) {
                    JOptionPane.showMessageDialog(this, "User created successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                    loadUsers(model);
                }
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
