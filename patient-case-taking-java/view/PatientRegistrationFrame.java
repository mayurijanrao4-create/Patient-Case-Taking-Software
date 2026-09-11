package view;

import dao.PatientDAO;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.SQLException;

/**
 * Screen 4: Patient Registration Form
 * Dedicated single-patient registration screen with complete validation.
 */
public class PatientRegistrationFrame extends JFrame {
    private JTextField txtOpdNumber;
    private JTextField txtFullName;
    private JTextField txtAge;
    private JComboBox<String> cmbGender;
    private JTextField txtContactNumber;
    private JTextField txtEmail;
    private JComboBox<String> cmbBloodGroup;
    private JTextArea txtAddress;

    private JButton btnSave;
    private JButton btnClear;
    private JButton btnBack;

    private final PatientDAO patientDAO = new PatientDAO();

    public PatientRegistrationFrame() {
        setTitle("Patient Registration - Medical Case-Taking System");
        setSize(700, 680);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("New Patient Registration", "Capture outpatient demographic and contact particulars"), BorderLayout.NORTH);

        // Center Form
        JPanel card = UITheme.createCard();
        card.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 10, 8, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        txtOpdNumber = new JTextField("OPD-" + (System.currentTimeMillis() % 100000), 15);
        txtFullName = new JTextField(15);
        txtAge = new JTextField(5);
        cmbGender = new JComboBox<>(new String[]{"Male", "Female", "Other"});
        txtContactNumber = new JTextField(15);
        txtEmail = new JTextField(15);
        cmbBloodGroup = new JComboBox<>(new String[]{"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"});
        txtAddress = new JTextArea(3, 15);
        txtAddress.setLineWrap(true);
        txtAddress.setWrapStyleWord(true);

        int row = 0;
        addFormRow(card, gbc, row++, "OPD Number *", txtOpdNumber);
        addFormRow(card, gbc, row++, "Full Name *", txtFullName);
        addFormRow(card, gbc, row++, "Age (Years) *", txtAge);
        addFormRow(card, gbc, row++, "Gender *", cmbGender);
        addFormRow(card, gbc, row++, "Contact Mobile *", txtContactNumber);
        addFormRow(card, gbc, row++, "Email Address", txtEmail);
        addFormRow(card, gbc, row++, "Blood Group", cmbBloodGroup);
        addFormRow(card, gbc, row++, "Residential Address", new JScrollPane(txtAddress));

        JPanel centerWrapper = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 20));
        centerWrapper.setOpaque(false);
        centerWrapper.add(card);
        root.add(new JScrollPane(centerWrapper), BorderLayout.CENTER);

        // Bottom Action Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(
            new LineBorder(UITheme.BORDER, 1),
            new EmptyBorder(12, 20, 12, 20)
        ));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);
        btnClear = UITheme.createSecondaryButton("Clear Form");
        btnClear.addActionListener(e -> clearForm());

        btnSave = UITheme.createSuccessButton("Save & Register Patient");
        btnSave.addActionListener(e -> registerPatient());

        rightActions.add(btnClear);
        rightActions.add(btnSave);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void addFormRow(JPanel panel, GridBagConstraints gbc, int row, String label, Component comp) {
        gbc.gridx = 0;
        gbc.gridy = row;
        gbc.weightx = 0.3;
        JLabel lbl = new JLabel(label);
        lbl.setFont(UITheme.FONT_LABEL);
        lbl.setForeground(UITheme.TEXT_MAIN);
        panel.add(lbl, gbc);

        gbc.gridx = 1;
        gbc.weightx = 0.7;
        panel.add(comp, gbc);
    }

    private void registerPatient() {
        String opd = txtOpdNumber.getText().trim();
        String name = txtFullName.getText().trim();
        String ageText = txtAge.getText().trim();
        String mobile = txtContactNumber.getText().trim();

        if (opd.isEmpty() || name.isEmpty() || ageText.isEmpty() || mobile.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                "Please fill all mandatory fields (OPD Number, Full Name, Age, and Contact Mobile).",
                "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int age;
        try {
            age = Integer.parseInt(ageText);
            if (age < 0 || age > 130) throw new NumberFormatException();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this,
                "Please enter a valid numeric age between 0 and 130.",
                "Invalid Age", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Patient p = new Patient();
        p.setOpdNumber(opd);
        p.setFullName(name);
        p.setAge(age);
        p.setGender((String) cmbGender.getSelectedItem());
        p.setContactNumber(mobile);
        p.setEmail(txtEmail.getText().trim());
        p.setBloodGroup((String) cmbBloodGroup.getSelectedItem());
        p.setAddress(txtAddress.getText().trim());

        try {
            if (patientDAO.addPatient(p)) {
                JOptionPane.showMessageDialog(this,
                    "Patient registered successfully!\nAssigned OPD: " + p.getOpdNumber(),
                    "Registration Successful", JOptionPane.INFORMATION_MESSAGE);
                clearForm();
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this,
                "Database error: " + ex.getMessage(),
                "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearForm() {
        txtOpdNumber.setText("OPD-" + (System.currentTimeMillis() % 100000));
        txtFullName.setText("");
        txtAge.setText("");
        txtContactNumber.setText("");
        txtEmail.setText("");
        txtAddress.setText("");
        cmbGender.setSelectedIndex(0);
        cmbBloodGroup.setSelectedIndex(0);
        txtFullName.requestFocus();
    }
}
