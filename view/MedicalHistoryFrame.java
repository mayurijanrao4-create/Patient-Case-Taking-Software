package view;

import dao.CaseHistoryDAO;
import dao.PatientDAO;
import model.CaseHistory;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 8: Medical History
 * Specialized screen capturing detailed past medical, surgical, family, personal, and allergy profiles.
 */
public class MedicalHistoryFrame extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextArea txtPastMedical;
    private JTextArea txtPastSurgical;
    private JTextArea txtFamilyHistory;
    private JTextArea txtPersonalLifestyle;
    private JTextArea txtAllergies;

    private JButton btnSave;
    private JButton btnClear;
    private JButton btnBack;

    private final PatientDAO patientDAO = new PatientDAO();
    private final CaseHistoryDAO caseHistoryDAO = new CaseHistoryDAO();

    public MedicalHistoryFrame() {
        setTitle("Comprehensive Medical & Anamnesis History");
        setSize(850, 700);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Medical & Anamnesis History", "Document past medical disorders, surgeries, family heredity, and allergies"), BorderLayout.NORTH);

        // Center Content with JScrollPane
        JPanel centerPanel = new JPanel(new BorderLayout(0, 10));
        centerPanel.setBorder(new EmptyBorder(10, 20, 10, 20));
        centerPanel.setOpaque(false);

        // Patient Selector Bar
        JPanel pnlPatient = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        pnlPatient.setBackground(Color.WHITE);
        pnlPatient.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(5, 10, 5, 10)));

        JLabel lblPatient = new JLabel("Select Outpatient *:");
        lblPatient.setFont(UITheme.FONT_LABEL);
        cmbPatient = new JComboBox<>();
        cmbPatient.setPreferredSize(new Dimension(380, 30));
        pnlPatient.add(lblPatient);
        pnlPatient.add(cmbPatient);
        centerPanel.add(pnlPatient, BorderLayout.NORTH);

        // Grid of Medical History Fields
        JPanel grid = new JPanel(new GridLayout(3, 2, 14, 14));
        grid.setOpaque(false);

        txtPastMedical = createArea();
        txtPastSurgical = createArea();
        txtFamilyHistory = createArea();
        txtPersonalLifestyle = createArea();
        txtAllergies = createArea();

        grid.add(createCardField("1. Past Medical History (HTN, DM, Asthma, TB, etc.)", txtPastMedical));
        grid.add(createCardField("2. Past Surgical & Hospitalization History", txtPastSurgical));
        grid.add(createCardField("3. Family History (Hereditary & Chronic)", txtFamilyHistory));
        grid.add(createCardField("4. Personal & Lifestyle (Diet, Sleep, Habits)", txtPersonalLifestyle));
        grid.add(createCardField("5. Drug, Food & Environmental Allergies", txtAllergies));

        // Quick Clinical Notes card for 6th slot
        JTextArea txtGeneralNotes = createArea();
        grid.add(createCardField("6. Immunization & Additional Notes", txtGeneralNotes));

        centerPanel.add(new JScrollPane(grid), BorderLayout.CENTER);
        root.add(centerPanel, BorderLayout.CENTER);

        // Bottom Actions
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        btnClear = UITheme.createSecondaryButton("Clear Fields");
        btnClear.addActionListener(e -> clearFields());

        btnSave = UITheme.createPrimaryButton("Save Medical History");
        btnSave.addActionListener(e -> saveMedicalHistory());

        rightActions.add(btnClear);
        rightActions.add(btnSave);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private JPanel createCardField(String title, JTextArea area) {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBackground(Color.WHITE);
        p.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(10, 10, 10, 10)));

        JLabel lbl = new JLabel(title);
        lbl.setFont(UITheme.FONT_LABEL);
        lbl.setForeground(UITheme.PRIMARY);

        p.add(lbl, BorderLayout.NORTH);
        p.add(new JScrollPane(area), BorderLayout.CENTER);
        return p;
    }

    private JTextArea createArea() {
        JTextArea a = new JTextArea(4, 20);
        a.setLineWrap(true);
        a.setWrapStyleWord(true);
        a.setFont(UITheme.FONT_BODY);
        return a;
    }

    private void loadPatients() {
        try {
            List<Patient> list = patientDAO.getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error loading patients: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveMedicalHistory() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String pastCombined = "Medical: " + txtPastMedical.getText().trim() + "\nSurgical: " + txtPastSurgical.getText().trim();
        CaseHistory ch = new CaseHistory();
        ch.setPatientId(p.getPatientId());
        ch.setChiefComplaints("Routine Comprehensive Medical History Intake");
        ch.setHpi("Detailed anamnesis logged by attending clinician.");
        ch.setPastHistory(pastCombined);
        ch.setFamilyHistory(txtFamilyHistory.getText().trim());
        ch.setPersonalHistory(txtPersonalLifestyle.getText().trim());
        ch.setAllergies(txtAllergies.getText().trim());

        try {
            if (caseHistoryDAO.addCaseHistory(ch)) {
                JOptionPane.showMessageDialog(this,
                    "Medical history saved successfully for patient: " + p.getFullName(),
                    "History Recorded", JOptionPane.INFORMATION_MESSAGE);
                clearFields();
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Failed to persist medical history: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearFields() {
        txtPastMedical.setText("");
        txtPastSurgical.setText("");
        txtFamilyHistory.setText("");
        txtPersonalLifestyle.setText("");
        txtAllergies.setText("");
    }
}
