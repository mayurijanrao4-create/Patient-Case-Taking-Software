package view;

import controller.CaseController;
import dao.PatientDAO;
import model.FollowUp;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

/**
 * Screen 12: Follow-Up & Review Form
 * Tracks patient symptom progression, drug tolerance, regimen titration, and next appointment dates.
 */
public class FollowUpForm extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextField txtVisitDate;
    private JComboBox<String> cmbPatientStatus;
    private JTextArea txtProgressNotes;
    private JTextArea txtTreatmentAdjustment;
    private JTextField txtNextVisitDate;

    private JButton btnBack;
    private JButton btnClear;
    private JButton btnSave;

    private final CaseController controller = new CaseController();

    public FollowUpForm() {
        setTitle("Follow-Up Review & Progress Evaluation");
        setSize(780, 640);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Follow-Up & Clinical Review", "Monitor treatment efficacy, patient compliance, and schedule review consultations"), BorderLayout.NORTH);

        // Center Content
        JPanel center = new JPanel(new BorderLayout(0, 10));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

        JPanel card = UITheme.createCard();
        card.setLayout(new GridBagLayout());
        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(8, 10, 8, 10);
        g.fill = GridBagConstraints.HORIZONTAL;

        cmbPatient = new JComboBox<>();
        txtVisitDate = new JTextField(LocalDate.now().toString(), 12);
        cmbPatientStatus = new JComboBox<>(new String[]{"Significantly Improved", "Stable / No Change", "Deteriorated", "Resolved", "Under Observation"});
        txtProgressNotes = new JTextArea(4, 20);
        txtProgressNotes.setLineWrap(true);
        txtProgressNotes.setWrapStyleWord(true);

        txtTreatmentAdjustment = new JTextArea(4, 20);
        txtTreatmentAdjustment.setLineWrap(true);
        txtTreatmentAdjustment.setWrapStyleWord(true);

        txtNextVisitDate = new JTextField(LocalDate.now().plusDays(14).toString(), 12);

        int r = 0;
        addRow(card, g, r++, "Select Outpatient *:", cmbPatient);
        addRow(card, g, r++, "Visit Date (YYYY-MM-DD) *:", txtVisitDate);
        addRow(card, g, r++, "Clinical Recovery Status:", cmbPatientStatus);
        addRow(card, g, r++, "Symptom Progression / Changes:", new JScrollPane(txtProgressNotes));
        addRow(card, g, r++, "Treatment Adjustments / Titration:", new JScrollPane(txtTreatmentAdjustment));
        addRow(card, g, r++, "Next Review Date (YYYY-MM-DD):", txtNextVisitDate);

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

        btnClear = UITheme.createSecondaryButton("Clear Form");
        btnClear.addActionListener(e -> clearForm());

        btnSave = UITheme.createSuccessButton("Save Follow-Up Record");
        btnSave.addActionListener(e -> saveFollowUp());

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
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveFollowUp() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            Date vDate = Date.valueOf(txtVisitDate.getText().trim());
            Date nDate = Date.valueOf(txtNextVisitDate.getText().trim());

            FollowUp fu = new FollowUp();
            fu.setPatientId(p.getPatientId());
            fu.setVisitDate(vDate);
            fu.setSymptomsProgress("Status: " + cmbPatientStatus.getSelectedItem() + "\n" + txtProgressNotes.getText().trim());
            fu.setTreatmentAdjusted(txtTreatmentAdjustment.getText().trim());
            fu.setNextFollowupDate(nDate);

            if (controller.saveFollowUp(fu, this)) {
                dispose();
            }
        } catch (IllegalArgumentException ex) {
            JOptionPane.showMessageDialog(this, "Dates must strictly follow YYYY-MM-DD format.", "Invalid Date", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearForm() {
        txtVisitDate.setText(LocalDate.now().toString());
        txtNextVisitDate.setText(LocalDate.now().plusDays(14).toString());
        txtProgressNotes.setText("");
        txtTreatmentAdjustment.setText("");
        cmbPatientStatus.setSelectedIndex(0);
    }
}
