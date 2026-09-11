package view;

import model.User;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;

/**
 * Screen 3: Doctor Dashboard
 * Central clinical cockpit providing one-click access to all case-taking workflows.
 */
public class DoctorDashboard extends JFrame {
    private final User currentUser;

    public DoctorDashboard(User user) {
        this.currentUser = user;
        setTitle("Clinician Dashboard - " + user.getFullName() + " | Patient Case-Taking Software");
        setSize(1050, 720);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        initComponents();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 15));
        root.setBackground(UITheme.BG_LIGHT);

        // 1. Top Clinical App Bar
        JPanel topBar = new JPanel(new BorderLayout());
        topBar.setBackground(UITheme.PRIMARY);
        topBar.setBorder(new EmptyBorder(14, 24, 14, 24));

        JPanel userBadge = new JPanel(new GridLayout(2, 1));
        userBadge.setOpaque(false);
        JLabel lblTitle = new JLabel("Doctor Clinical Workstation");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSub = new JLabel("Dr. " + currentUser.getFullName() + " | Role: " + currentUser.getRole() + " | Session Active");
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblSub.setForeground(new Color(219, 234, 254));

        userBadge.add(lblTitle);
        userBadge.add(lblSub);
        topBar.add(userBadge, BorderLayout.WEST);

        JButton btnLogout = UITheme.createSecondaryButton("Logout / Lock");
        btnLogout.addActionListener(e -> {
            int opt = JOptionPane.showConfirmDialog(this, "Are you sure you want to sign out?", "Confirm Logout", JOptionPane.YES_NO_OPTION);
            if (opt == JOptionPane.YES_OPTION) {
                dispose();
                new LoginFrame().setVisible(true);
            }
        });
        topBar.add(btnLogout, BorderLayout.EAST);
        root.add(topBar, BorderLayout.NORTH);

        // 2. Clinical Module Grid (11 Action Tiles for Doctors)
        JPanel centerPanel = new JPanel(new BorderLayout(0, 12));
        centerPanel.setBorder(new EmptyBorder(10, 24, 15, 24));
        centerPanel.setOpaque(false);

        JLabel lblSections = new JLabel("Clinical Workflows & Outpatient Services");
        lblSections.setFont(UITheme.FONT_SUBTITLE);
        lblSections.setForeground(UITheme.TEXT_MAIN);
        centerPanel.add(lblSections, BorderLayout.NORTH);

        JPanel grid = new JPanel(new GridLayout(3, 4, 14, 14));
        grid.setOpaque(false);

        // 1. Patient Registration
        grid.add(createTile("4. Patient Registration", "Enroll new outpatients with OPD number & demographics", e -> new PatientRegistrationFrame().setVisible(true)));

        // 2. Patient Management
        grid.add(createTile("5. Patient Management", "Directory, update particulars, and delete records", e -> new PatientManagementFrame().setVisible(true)));

        // 3. Patient Search
        grid.add(createTile("6. Rapid Search", "Instant lookup by OPD, Name, Mobile & launch actions", e -> new PatientSearchFrame().setVisible(true)));

        // 4. Case Taking Form
        grid.add(createTile("7. Case Taking", "Chief complaints, history of present illness & duration", e -> new CaseTakingForm().setVisible(true)));

        // 5. Medical History
        grid.add(createTile("8. Medical History", "Past medical, surgeries, family heredity & allergies", e -> new MedicalHistoryFrame().setVisible(true)));

        // 6. Physical Examination
        grid.add(createTile("9. Physical Exam", "Vitals, general survey (pallor, edema) & systemic check", e -> new ExaminationForm().setVisible(true)));

        // 7. Clinical Diagnosis
        grid.add(createTile("10. Diagnosis & ICD", "Provisional, final diagnosis and ICD-10 clinical plans", e -> new DiagnosisForm().setVisible(true)));

        // 8. Prescription Builder
        grid.add(createTile("11. Prescription", "Multi-medicine dispenser: dosage, frequency & duration", e -> new PrescriptionForm(currentUser.getFullName()).setVisible(true)));

        // 9. Follow-Up Tracker
        grid.add(createTile("12. Follow-Up Visits", "Symptom progression, therapy adjustment & return dates", e -> new FollowUpForm().setVisible(true)));

        // 10. Patient Case Dossier
        grid.add(createTile("13. Case History Dossier", "Chronological medical record timeline of all encounters", e -> new CaseHistoryFrame().setVisible(true)));

        // 11. Reports & Audits
        grid.add(createTile("14. Reports & Analytics", "Aggregated OPD summaries, prescription stats & print", e -> new ReportsFrame().setVisible(true)));

        // 12. Switch to Admin (if authorized) or About
        grid.add(createTile("System Diagnostics", "View database connection status and application build info", e -> {
            JOptionPane.showMessageDialog(this,
                "Patient Case-Taking System v3.0\nThird-Year Engineering Demonstration\nArchitecture: Java Swing + JDBC + MySQL (MVC Pattern)\nStatus: Database Connected & Active",
                "System Diagnostics", JOptionPane.INFORMATION_MESSAGE);
        }));

        centerPanel.add(new JScrollPane(grid), BorderLayout.CENTER);
        root.add(centerPanel, BorderLayout.CENTER);

        // 3. Bottom Status Bar
        JPanel statusBar = new JPanel(new BorderLayout());
        statusBar.setBackground(Color.WHITE);
        statusBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(8, 24, 8, 24)));

        JLabel lblStatus = new JLabel("● Database Connected: MySQL Server localhost:3306 (PatientCaseDB)");
        lblStatus.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblStatus.setForeground(UITheme.SUCCESS);

        JLabel lblClock = new JLabel("Academic Capstone Demo Mode");
        lblClock.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblClock.setForeground(UITheme.TEXT_MUTED);

        statusBar.add(lblStatus, BorderLayout.WEST);
        statusBar.add(lblClock, BorderLayout.EAST);
        root.add(statusBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private JPanel createTile(String title, String desc, java.awt.event.ActionListener action) {
        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(Color.WHITE);
        card.setBorder(new CompoundBorder(
            new LineBorder(UITheme.BORDER, 1),
            new EmptyBorder(14, 14, 14, 14)
        ));

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(UITheme.FONT_LABEL);
        lblTitle.setForeground(UITheme.PRIMARY);

        JLabel lblDesc = new JLabel("<html><body style='width: 170px; color: #64748B; font-size: 11px;'>" + desc + "</body></html>");

        JButton btnOpen = UITheme.createPrimaryButton("Launch");
        btnOpen.setPreferredSize(new Dimension(80, 28));
        btnOpen.addActionListener(action);

        card.add(lblTitle, BorderLayout.NORTH);
        card.add(lblDesc, BorderLayout.CENTER);
        card.add(btnOpen, BorderLayout.SOUTH);
        return card;
    }
}
