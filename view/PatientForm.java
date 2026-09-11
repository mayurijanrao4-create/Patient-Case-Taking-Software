package view;

import controller.PatientController;
import model.Patient;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * PatientForm - Patient Registration, CRUD, Search and JTable Directory
 */
public class PatientForm extends JFrame {

    private JTextField txtId, txtName, txtAge, txtMobile, txtSearch;
    private JTextArea txtAddress;
    private JComboBox<String> cmbGender, cmbBlood;
    private JButton btnAdd, btnUpdate, btnDelete, btnClear, btnSearch;
    private JTable tblPatients;
    private DefaultTableModel tableModel;
    private final PatientController patientController;

    public PatientForm(String prefilledId, Component parent) {
        this.patientController = new PatientController();
        initComponents();
        loadPatientData();
    }

    private void initComponents() {
        setTitle("Patient Registration & Management System");
        setSize(980, 620);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        // Top Form Panel
        JPanel formContainer = new JPanel(new BorderLayout());
        formContainer.setBorder(BorderFactory.createTitledBorder("Patient Demographic Details"));

        JPanel inputGrid = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 8, 5, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Row 0
        gbc.gridx = 0; gbc.gridy = 0; inputGrid.add(new JLabel("Patient ID:*"), gbc);
        txtId = new JTextField(10);
        gbc.gridx = 1; gbc.gridy = 0; inputGrid.add(txtId, gbc);

        gbc.gridx = 2; gbc.gridy = 0; inputGrid.add(new JLabel("Full Name:*"), gbc);
        txtName = new JTextField(16);
        gbc.gridx = 3; gbc.gridy = 0; inputGrid.add(txtName, gbc);

        // Row 1
        gbc.gridx = 0; gbc.gridy = 1; inputGrid.add(new JLabel("Age:*"), gbc);
        txtAge = new JTextField(5);
        gbc.gridx = 1; gbc.gridy = 1; inputGrid.add(txtAge, gbc);

        gbc.gridx = 2; gbc.gridy = 1; inputGrid.add(new JLabel("Gender:*"), gbc);
        cmbGender = new JComboBox<>(new String[]{"Male", "Female", "Other"});
        gbc.gridx = 3; gbc.gridy = 1; inputGrid.add(cmbGender, gbc);

        // Row 2
        gbc.gridx = 0; gbc.gridy = 2; inputGrid.add(new JLabel("Mobile (10 digits):*"), gbc);
        txtMobile = new JTextField(12);
        gbc.gridx = 1; gbc.gridy = 2; inputGrid.add(txtMobile, gbc);

        gbc.gridx = 2; gbc.gridy = 2; inputGrid.add(new JLabel("Blood Group:*"), gbc);
        cmbBlood = new JComboBox<>(new String[]{"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"});
        gbc.gridx = 3; gbc.gridy = 2; inputGrid.add(cmbBlood, gbc);

        // Row 3
        gbc.gridx = 0; gbc.gridy = 3; inputGrid.add(new JLabel("Address:*"), gbc);
        txtAddress = new JTextArea(2, 20);
        txtAddress.setLineWrap(true);
        gbc.gridx = 1; gbc.gridy = 3; gbc.gridwidth = 3;
        inputGrid.add(new JScrollPane(txtAddress), gbc);

        formContainer.add(inputGrid, BorderLayout.CENTER);

        // Action Buttons
        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        btnAdd = new JButton("Add Patient");
        btnAdd.setBackground(new Color(16, 185, 129));
        btnAdd.setForeground(Color.WHITE);

        btnUpdate = new JButton("Update Patient");
        btnDelete = new JButton("Delete Patient");
        btnClear = new JButton("Clear Form");

        actionPanel.add(btnAdd);
        actionPanel.add(btnUpdate);
        actionPanel.add(btnDelete);
        actionPanel.add(btnClear);
        formContainer.add(actionPanel, BorderLayout.SOUTH);

        add(formContainer, BorderLayout.NORTH);

        // Table Panel with Live Search
        JPanel tableContainer = new JPanel(new BorderLayout(5, 5));
        tableContainer.setBorder(BorderFactory.createTitledBorder("Registered Outpatients Directory"));

        JPanel searchBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        searchBar.add(new JLabel("Search (ID / Name / Mobile):"));
        txtSearch = new JTextField(20);
        btnSearch = new JButton("Search");
        searchBar.add(txtSearch);
        searchBar.add(btnSearch);
        tableContainer.add(searchBar, BorderLayout.NORTH);

        String[] cols = {"Patient ID", "Name", "Age", "Gender", "Mobile", "Blood Group", "Address", "Registered Date"};
        tableModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int row, int column) { return false; }
        };
        tblPatients = new JTable(tableModel);
        tblPatients.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tableContainer.add(new JScrollPane(tblPatients), BorderLayout.CENTER);

        add(tableContainer, BorderLayout.CENTER);

        // Event Handlers
        btnAdd.addActionListener(e -> handleAddPatient());
        btnUpdate.addActionListener(e -> handleUpdatePatient());
        btnDelete.addActionListener(e -> handleDeletePatient());
        btnClear.addActionListener(e -> clearFields());
        btnSearch.addActionListener(e -> handleSearch());

        tblPatients.getSelectionModel().addListSelectionListener(e -> {
            int selectedRow = tblPatients.getSelectedRow();
            if (selectedRow >= 0) {
                txtId.setText((String) tableModel.getValueAt(selectedRow, 0));
                txtName.setText((String) tableModel.getValueAt(selectedRow, 1));
                txtAge.setText(String.valueOf(tableModel.getValueAt(selectedRow, 2)));
                cmbGender.setSelectedItem(tableModel.getValueAt(selectedRow, 3));
                txtMobile.setText((String) tableModel.getValueAt(selectedRow, 4));
                cmbBlood.setSelectedItem(tableModel.getValueAt(selectedRow, 5));
                txtAddress.setText((String) tableModel.getValueAt(selectedRow, 6));
                txtId.setEditable(false);
            }
        });
    }

    private void handleAddPatient() {
        try {
            int age = Integer.parseInt(txtAge.getText().trim());
            Patient p = new Patient(
                    txtId.getText().trim(),
                    txtName.getText().trim(),
                    age,
                    (String) cmbGender.getSelectedItem(),
                    txtMobile.getText().trim(),
                    txtAddress.getText().trim(),
                    (String) cmbBlood.getSelectedItem()
            );

            if (patientController.registerPatient(p, this)) {
                clearFields();
                loadPatientData();
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid numeric age.", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleUpdatePatient() {
        try {
            int age = Integer.parseInt(txtAge.getText().trim());
            Patient p = new Patient(
                    txtId.getText().trim(),
                    txtName.getText().trim(),
                    age,
                    (String) cmbGender.getSelectedItem(),
                    txtMobile.getText().trim(),
                    txtAddress.getText().trim(),
                    (String) cmbBlood.getSelectedItem()
            );

            if (patientController.updatePatient(p, this)) {
                clearFields();
                loadPatientData();
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Please enter a valid numeric age.", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void handleDeletePatient() {
        String id = txtId.getText().trim();
        if (id.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please select a patient from the table to delete.", "Selection Required", JOptionPane.WARNING_MESSAGE);
            return;
        }
        if (patientController.deletePatient(id, this)) {
            clearFields();
            loadPatientData();
        }
    }

    private void handleSearch() {
        String kw = txtSearch.getText().trim();
        List<Patient> list = patientController.searchPatients(kw);
        populateTable(list);
    }

    private void loadPatientData() {
        List<Patient> list = patientController.getAllPatients();
        populateTable(list);
    }

    private void populateTable(List<Patient> list) {
        tableModel.setRowCount(0);
        for (Patient p : list) {
            tableModel.addRow(new Object[]{
                    p.getPatientId(),
                    p.getName(),
                    p.getAge(),
                    p.getGender(),
                    p.getMobile(),
                    p.getBloodGroup(),
                    p.getAddress(),
                    p.getRegisteredDate() != null ? p.getRegisteredDate().toString() : "Today"
            });
        }
    }

    private void clearFields() {
        txtId.setText("");
        txtId.setEditable(true);
        txtName.setText("");
        txtAge.setText("");
        txtMobile.setText("");
        txtAddress.setText("");
        cmbGender.setSelectedIndex(0);
        cmbBlood.setSelectedIndex(0);
        tblPatients.clearSelection();
    }
}
