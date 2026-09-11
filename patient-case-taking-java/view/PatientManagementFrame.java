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
 * Screen 5: Patient Management
 * Renders outpatient directory in a JTable with CRUD controls (Search, Update, Delete, View History).
 */
public class PatientManagementFrame extends JFrame {
    private JTextField txtSearch;
    private JButton btnSearch;
    private JButton btnReset;

    private JTable tablePatients;
    private DefaultTableModel tableModel;

    private JButton btnBack;
    private JButton btnRegisterNew;
    private JButton btnUpdate;
    private JButton btnDelete;
    private JButton btnViewHistory;

    private final PatientDAO patientDAO = new PatientDAO();

    public PatientManagementFrame() {
        setTitle("Patient Management & Directory - Medical Case-Taking");
        setSize(1000, 650);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients("");
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 10));
        root.setBackground(UITheme.BG_LIGHT);

        // 1. Header
        root.add(UITheme.createHeader("Patient Management Portal", "Search, modify, or audit registered outpatient master files"), BorderLayout.NORTH);

        // 2. Central Area (Search Filter + JTable)
        JPanel centerPanel = new JPanel(new BorderLayout(0, 10));
        centerPanel.setBorder(new EmptyBorder(10, 20, 10, 20));
        centerPanel.setOpaque(false);

        // Filter Bar
        JPanel searchBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        searchBar.setBackground(Color.WHITE);
        searchBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(8, 12, 8, 12)));

        JLabel lblSearch = new JLabel("Filter Records:");
        lblSearch.setFont(UITheme.FONT_LABEL);
        txtSearch = new JTextField(22);
        txtSearch.setToolTipText("Enter Patient Name, OPD Number, or Mobile Number");

        btnSearch = UITheme.createPrimaryButton("Search Records");
        btnSearch.addActionListener(e -> loadPatients(txtSearch.getText().trim()));

        btnReset = UITheme.createSecondaryButton("Reset Filter");
        btnReset.addActionListener(e -> {
            txtSearch.setText("");
            loadPatients("");
        });

        searchBar.add(lblSearch);
        searchBar.add(txtSearch);
        searchBar.add(btnSearch);
        searchBar.add(btnReset);
        centerPanel.add(searchBar, BorderLayout.NORTH);

        // JTable for Patients
        tableModel = new DefaultTableModel(new String[]{
            "ID", "OPD Number", "Patient Name", "Age", "Gender", "Contact Mobile", "Blood Group", "Registration Date"
        }, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        tablePatients = new JTable(tableModel);
        UITheme.styleTable(tablePatients);
        JScrollPane scrollPane = new JScrollPane(tablePatients);
        scrollPane.setBorder(new LineBorder(UITheme.BORDER, 1));
        centerPanel.add(scrollPane, BorderLayout.CENTER);

        root.add(centerPanel, BorderLayout.CENTER);

        // 3. Bottom Action Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel actionsRight = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        actionsRight.setOpaque(false);

        btnRegisterNew = UITheme.createSuccessButton("+ Register New Patient");
        btnRegisterNew.addActionListener(e -> new PatientRegistrationFrame().setVisible(true));

        btnUpdate = UITheme.createPrimaryButton("Update Selected");
        btnUpdate.addActionListener(e -> handleUpdate());

        btnDelete = UITheme.createDangerButton("Delete Selected");
        btnDelete.addActionListener(e -> handleDelete());

        btnViewHistory = UITheme.createSecondaryButton("View Full Medical Dossier");
        btnViewHistory.addActionListener(e -> handleViewDossier());

        actionsRight.add(btnRegisterNew);
        actionsRight.add(btnUpdate);
        actionsRight.add(btnDelete);
        actionsRight.add(btnViewHistory);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(actionsRight, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void loadPatients(String query) {
        tableModel.setRowCount(0);
        try {
            List<Patient> list = query.isEmpty() ? patientDAO.getAllPatients() : patientDAO.searchPatients(query);
            for (Patient p : list) {
                tableModel.addRow(new Object[]{
                    p.getPatientId(),
                    p.getOpdNumber(),
                    p.getFullName(),
                    p.getAge(),
                    p.getGender(),
                    p.getContactNumber(),
                    p.getBloodGroup(),
                    p.getRegistrationDate()
                });
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Failed to retrieve patients: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleUpdate() {
        int row = tablePatients.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Please highlight a patient record to update.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int patientId = (int) tableModel.getValueAt(row, 0);
        String name = (String) tableModel.getValueAt(row, 2);
        int age = (int) tableModel.getValueAt(row, 3);
        String contact = (String) tableModel.getValueAt(row, 5);

        JTextField txtName = new JTextField(name);
        JTextField txtAge = new JTextField(String.valueOf(age));
        JTextField txtMobile = new JTextField(contact);

        Object[] fields = {
            "Patient Full Name:", txtName,
            "Age:", txtAge,
            "Contact Mobile:", txtMobile
        };

        int opt = JOptionPane.showConfirmDialog(this, fields, "Edit Patient Particulars", JOptionPane.OK_CANCEL_OPTION);
        if (opt == JOptionPane.OK_OPTION) {
            try {
                Patient p = patientDAO.getPatientById(patientId);
                if (p != null) {
                    p.setFullName(txtName.getText().trim());
                    p.setAge(Integer.parseInt(txtAge.getText().trim()));
                    p.setContactNumber(txtMobile.getText().trim());
                    if (patientDAO.updatePatient(p)) {
                        JOptionPane.showMessageDialog(this, "Patient details updated.", "Success", JOptionPane.INFORMATION_MESSAGE);
                        loadPatients(txtSearch.getText().trim());
                    }
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Update error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void handleDelete() {
        int row = tablePatients.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Please select a patient to delete.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int patientId = (int) tableModel.getValueAt(row, 0);
        String name = (String) tableModel.getValueAt(row, 2);

        int confirm = JOptionPane.showConfirmDialog(this,
            "Are you sure you want to permanently delete record for: " + name + "?\nAll associated medical history and prescriptions will be cleared.",
            "Confirm Patient Record Deletion", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            try {
                if (patientDAO.deletePatient(patientId)) {
                    JOptionPane.showMessageDialog(this, "Patient record removed.", "Record Deleted", JOptionPane.INFORMATION_MESSAGE);
                    loadPatients(txtSearch.getText().trim());
                }
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(this, "Deletion failed: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void handleViewDossier() {
        new CaseHistoryFrame().setVisible(true);
    }
}
