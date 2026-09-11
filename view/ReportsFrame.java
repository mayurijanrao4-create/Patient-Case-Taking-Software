package view;

import database.DBConnection;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Screen 14: Reports & Clinical Audit Analytics
 * Displays aggregated patient case statistics, prescription audits, and export capabilities.
 */
public class ReportsFrame extends JFrame {
    private JTable tblReports;
    private DefaultTableModel modelReports;
    private JLabel lblTotalPatients;
    private JLabel lblTotalRx;
    private JLabel lblTotalVisits;

    private JButton btnBack;
    private JButton btnPrint;
    private JButton btnRefresh;

    public ReportsFrame() {
        setTitle("Clinical Audit & Healthcare Activity Reports");
        setSize(1000, 680);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadReportData();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Clinical Audit & Activity Reports", "Summary of outpatient encounters, disease trends, prescription loads, and hospital audit trail"), BorderLayout.NORTH);

        // Center Content
        JPanel center = new JPanel(new BorderLayout(0, 12));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

        // Top KPI Stat Cards
        JPanel pnlStats = new JPanel(new GridLayout(1, 3, 14, 14));
        pnlStats.setOpaque(false);

        lblTotalPatients = new JLabel("0", JLabel.CENTER);
        lblTotalPatients.setFont(new Font("Segoe UI", Font.BOLD, 24));
        lblTotalPatients.setForeground(UITheme.PRIMARY);

        lblTotalRx = new JLabel("0", JLabel.CENTER);
        lblTotalRx.setFont(new Font("Segoe UI", Font.BOLD, 24));
        lblTotalRx.setForeground(UITheme.SUCCESS);

        lblTotalVisits = new JLabel("0", JLabel.CENTER);
        lblTotalVisits.setFont(new Font("Segoe UI", Font.BOLD, 24));
        lblTotalVisits.setForeground(UITheme.WARNING);

        pnlStats.add(createKpiCard("Registered Outpatients", lblTotalPatients));
        pnlStats.add(createKpiCard("Prescriptions Issued", lblTotalRx));
        pnlStats.add(createKpiCard("Follow-Up Reviews", lblTotalVisits));
        center.add(pnlStats, BorderLayout.NORTH);

        // Report Table
        modelReports = new DefaultTableModel(new String[]{
            "OPD Number", "Patient Name", "Gender", "Prescribing Doctor", "Prescription Date", "Drugs Count", "Clinical Advice"
        }, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };
        tblReports = new JTable(modelReports);
        UITheme.styleTable(tblReports);

        JScrollPane scroll = new JScrollPane(tblReports);
        scroll.setBorder(new LineBorder(UITheme.BORDER, 1));
        center.add(scroll, BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);

        // Bottom Navigation & Actions
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        btnRefresh = UITheme.createSecondaryButton("Refresh Analytics");
        btnRefresh.addActionListener(e -> loadReportData());

        btnPrint = UITheme.createPrimaryButton("Print / Export Report");
        btnPrint.addActionListener(e -> {
            try {
                tblReports.print();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Print error: " + ex.getMessage());
            }
        });

        rightActions.add(btnRefresh);
        rightActions.add(btnPrint);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private JPanel createKpiCard(String title, JLabel lblValue) {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBackground(Color.WHITE);
        p.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 16, 12, 16)));

        JLabel lblTitle = new JLabel(title, JLabel.CENTER);
        lblTitle.setFont(UITheme.FONT_LABEL);
        lblTitle.setForeground(UITheme.TEXT_MUTED);

        p.add(lblTitle, BorderLayout.NORTH);
        p.add(lblValue, BorderLayout.CENTER);
        return p;
    }

    private void loadReportData() {
        modelReports.setRowCount(0);
        String sql = "SELECT p.opd_number, p.full_name, p.gender, pr.doctor_name, " +
                     "pr.prescribed_at, COUNT(pm.medicine_id) AS med_count, pr.advice " +
                     "FROM patients p " +
                     "JOIN prescriptions pr ON p.patient_id = pr.patient_id " +
                     "LEFT JOIN prescription_medicines pm ON pr.prescription_id = pm.prescription_id " +
                     "GROUP BY pr.prescription_id " +
                     "ORDER BY pr.prescribed_at DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            int rxCount = 0;
            while (rs.next()) {
                rxCount++;
                modelReports.addRow(new Object[]{
                    rs.getString("opd_number"),
                    rs.getString("full_name"),
                    rs.getString("gender"),
                    rs.getString("doctor_name"),
                    rs.getTimestamp("prescribed_at"),
                    rs.getInt("med_count"),
                    rs.getString("advice")
                });
            }
            lblTotalRx.setText(String.valueOf(rxCount));

            // Load counts
            try (Statement st2 = conn.createStatement();
                 ResultSet rs2 = st2.executeQuery("SELECT COUNT(*) FROM patients")) {
                if (rs2.next()) lblTotalPatients.setText(String.valueOf(rs2.getInt(1)));
            }

            try (Statement st3 = conn.createStatement();
                 ResultSet rs3 = st3.executeQuery("SELECT COUNT(*) FROM follow_ups")) {
                if (rs3.next()) lblTotalVisits.setText(String.valueOf(rs3.getInt(1)));
            }

        } catch (Exception ex) {
            // Display empty or fallback gracefully
        }
    }
}
