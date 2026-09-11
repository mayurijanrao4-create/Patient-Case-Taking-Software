package view;

import dao.PatientDAO;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 6: Patient Search & Clinical Dispatch
 * Allows doctor to rapidly look up outpatients and initiate clinical workflows directly.
 */
public class PatientSearchFrame extends JFrame {
    private JTextField txtSearchQuery;
    private JButton btnSearch;
    private JButton btnClearSearch;

    private JTable tblResults;
    private DefaultTableModel modelResults;

    private JButton btnStartCase;
    private JButton btnRecordExam;
    private JButton btnWriteRx;
    private JButton btnViewHistory;
    private JButton btnBack;

    private final PatientDAO patientDAO = new PatientDAO();

    public PatientSearchFrame() {
        setTitle("Patient Search & Workflow Portal");
        setSize(950, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        performSearch("");
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Rapid Patient Search", "Locate outpatient records by OPD Number, Name, or Mobile Phone"), BorderLayout.NORTH);

        // Center Content
        JPanel center = new JPanel(new BorderLayout(0, 10));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

        // Search Control Bar
        JPanel searchBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        searchBox.setBackground(Color.WHITE);
        searchBox.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(5, 10, 5, 10)));

        JLabel lbl = new JLabel("Enter Keyword:");
        lbl.setFont(UITheme.FONT_LABEL);
        txtSearchQuery = new JTextField(25);
        txtSearchQuery.setFont(UITheme.FONT_BODY);

        btnSearch = UITheme.createPrimaryButton("Search Directory");
        btnSearch.addActionListener(e -> performSearch(txtSearchQuery.getText().trim()));

        btnClearSearch = UITheme.createSecondaryButton("Clear");
        btnClearSearch.addActionListener(e -> {
            txtSearchQuery.setText("");
            performSearch("");
        });

        searchBox.add(lbl);
        searchBox.add(txtSearchQuery);
        searchBox.add(btnSearch);
        searchBox.add(btnClearSearch);
        center.add(searchBox, BorderLayout.NORTH);

        // Results Table
        modelResults = new DefaultTableModel(new String[]{
            "ID", "OPD #", "Patient Full Name", "Age", "Gender", "Contact Mobile", "Blood Group", "Address"
        }, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        tblResults = new JTable(modelResults);
        UITheme.styleTable(tblResults);
        center.add(new JScrollPane(tblResults), BorderLayout.CENTER);

        // Quick Clinical Action Bar
        JPanel quickActions = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 8));
        quickActions.setBackground(new Color(241, 245, 249));
        quickActions.setBorder(new LineBorder(UITheme.BORDER, 1));

        JLabel lblActions = new JLabel("Clinical Actions for Selected Patient:");
        lblActions.setFont(UITheme.FONT_LABEL);
        quickActions.add(lblActions);

        btnStartCase = UITheme.createPrimaryButton("1. Case Taking");
        btnStartCase.addActionListener(e -> new CaseTakingForm().setVisible(true));

        btnRecordExam = UITheme.createPrimaryButton("2. Examination");
        btnRecordExam.addActionListener(e -> new ExaminationForm().setVisible(true));

        btnWriteRx = UITheme.createPrimaryButton("3. Prescription");
        btnWriteRx.addActionListener(e -> new PrescriptionForm("Dr. Attending").setVisible(true));

        btnViewHistory = UITheme.createSecondaryButton("View Full Dossier");
        btnViewHistory.addActionListener(e -> new CaseHistoryFrame().setVisible(true));

        quickActions.add(btnStartCase);
        quickActions.add(btnRecordExam);
        quickActions.add(btnWriteRx);
        quickActions.add(btnViewHistory);
        center.add(quickActions, BorderLayout.SOUTH);

        root.add(center, BorderLayout.CENTER);

        // Bottom Navigation Bar
        JPanel bottomBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 12));
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(4, 10, 4, 10)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());
        bottomBar.add(btnBack);

        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void performSearch(String keyword) {
        modelResults.setRowCount(0);
        try {
            List<Patient> list = keyword.isEmpty() ? patientDAO.getAllPatients() : patientDAO.searchPatients(keyword);
            for (Patient p : list) {
                modelResults.addRow(new Object[]{
                    p.getPatientId(),
                    p.getOpdNumber(),
                    p.getFullName(),
                    p.getAge(),
                    p.getGender(),
                    p.getContactNumber(),
                    p.getBloodGroup(),
                    p.getAddress()
                });
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Search error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
