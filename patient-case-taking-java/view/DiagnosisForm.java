package view;

import controller.CaseController;
import dao.PatientDAO;
import model.Diagnosis;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 10: Diagnosis Form
 * Captures provisional diagnosis, differential diagnosis, confirmed ICD-10 codes, and clinical treatment plans.
 */
public class DiagnosisForm extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextField txtProvisional;
    private JTextField txtDifferential;
    private JTextField txtFinal;
    private JTextField txtIcdCode;
    private JTextArea txtClinicalNotes;

    private JButton btnBack;
    private JButton btnClear;
    private JButton btnSave;

    private final CaseController controller = new CaseController();

    public DiagnosisForm() {
        setTitle("Clinical Diagnosis & ICD-10 Diagnostic Decision");
        setSize(750, 620);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Clinical Diagnosis & Diagnostic Assessment", "Record provisional hypotheses, ICD-10 coding, and confirmed clinical diagnosis"), BorderLayout.NORTH);

        // Center Form
        JPanel center = new JPanel(new BorderLayout(0, 10));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

        JPanel card = UITheme.createCard();
        card.setLayout(new GridBagLayout());
        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(8, 10, 8, 10);
        g.fill = GridBagConstraints.HORIZONTAL;

        cmbPatient = new JComboBox<>();
        txtProvisional = new JTextField(20);
        txtDifferential = new JTextField(20);
        txtFinal = new JTextField(20);
        txtIcdCode = new JTextField(12);
        txtClinicalNotes = new JTextArea(4, 20);
        txtClinicalNotes.setLineWrap(true);
        txtClinicalNotes.setWrapStyleWord(true);

        int r = 0;
        addRow(card, g, r++, "Select Outpatient *:", cmbPatient);
        addRow(card, g, r++, "Provisional Diagnosis *:", txtProvisional);
        addRow(card, g, r++, "Differential Diagnosis:", txtDifferential);
        addRow(card, g, r++, "Confirmed Final Diagnosis:", txtFinal);
        addRow(card, g, r++, "ICD-10 Diagnostic Code:", txtIcdCode);
        addRow(card, g, r++, "Clinical Impression & Treatment Plan:", new JScrollPane(txtClinicalNotes));

        center.add(new JScrollPane(card), BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);

        // Bottom Action Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        btnClear = UITheme.createSecondaryButton("Clear Fields");
        btnClear.addActionListener(e -> clearForm());

        btnSave = UITheme.createSuccessButton("Save Diagnosis");
        btnSave.addActionListener(e -> saveDiagnosis());

        rightActions.add(btnClear);
        rightActions.add(btnSave);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void addRow(JPanel p, GridBagConstraints g, int row, String lbl, Component c) {
        g.gridx = 0; g.gridy = row; g.weightx = 0.35;
        JLabel l = new JLabel(lbl);
        l.setFont(UITheme.FONT_LABEL);
        p.add(l, g);

        g.gridx = 1; g.weightx = 0.65;
        p.add(c, g);
    }

    private void loadPatients() {
        try {
            List<Patient> list = new PatientDAO().getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveDiagnosis() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String prov = txtProvisional.getText().trim();
        if (prov.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Provisional Diagnosis is mandatory.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Diagnosis d = new Diagnosis();
        d.setPatientId(p.getPatientId());
        d.setProvisionalDiagnosis(prov);
        d.setFinalDiagnosis(txtFinal.getText().trim());
        d.setIcdCode(txtIcdCode.getText().trim());
        d.setClinicalNotes("Differential: " + txtDifferential.getText().trim() + "\nPlan: " + txtClinicalNotes.getText().trim());

        if (controller.saveDiagnosis(d, this)) {
            dispose();
        }
    }

    private void clearForm() {
        txtProvisional.setText("");
        txtDifferential.setText("");
        txtFinal.setText("");
        txtIcdCode.setText("");
        txtClinicalNotes.setText("");
    }
}
