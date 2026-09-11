package view;

import controller.CaseController;
import dao.PatientDAO;
import model.Examination;
import model.Patient;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 9: Physical Examination
 * Records objective clinical signs: Vitals (BP, Pulse, Temp, SpO2, BMI) and General/Systemic findings.
 */
public class ExaminationForm extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextField txtBp;
    private JTextField txtPulse;
    private JTextField txtTemp;
    private JTextField txtRr;
    private JTextField txtSpo2;
    private JTextField txtWeight;
    private JTextField txtHeight;
    private JLabel lblBmi;

    private JTextArea txtGeneralExam;
    private JTextArea txtSystemicExam;

    private JButton btnBack;
    private JButton btnClear;
    private JButton btnSave;

    private final CaseController controller = new CaseController();

    public ExaminationForm() {
        setTitle("Physical & Systemic Examination");
        setSize(900, 680);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Physical & Systemic Examination", "Log clinical vitals, hemodynamic parameters, and organ system assessments"), BorderLayout.NORTH);

        // Center Panel
        JPanel centerPanel = new JPanel(new BorderLayout(0, 10));
        centerPanel.setBorder(new EmptyBorder(10, 20, 10, 20));
        centerPanel.setOpaque(false);

        // Patient Selector Bar
        JPanel patientBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        patientBar.setBackground(Color.WHITE);
        patientBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(5, 10, 5, 10)));

        JLabel lblPat = new JLabel("Select Outpatient *:");
        lblPat.setFont(UITheme.FONT_LABEL);
        cmbPatient = new JComboBox<>();
        cmbPatient.setPreferredSize(new Dimension(380, 30));
        patientBar.add(lblPat);
        patientBar.add(cmbPatient);
        centerPanel.add(patientBar, BorderLayout.NORTH);

        // Examination 2-Column Layout
        JPanel grid = new JPanel(new GridLayout(1, 2, 15, 15));
        grid.setOpaque(false);

        // Left Column: Vitals Card
        JPanel cardVitals = new JPanel(new GridBagLayout());
        cardVitals.setBackground(Color.WHITE);
        cardVitals.setBorder(new CompoundBorder(
            new LineBorder(UITheme.BORDER, 1),
            new EmptyBorder(15, 15, 15, 15)
        ));

        GridBagConstraints g = new GridBagConstraints();
        g.insets = new Insets(6, 6, 6, 6);
        g.fill = GridBagConstraints.HORIZONTAL;

        txtBp = new JTextField("120/80", 8);
        txtPulse = new JTextField("72", 8);
        txtTemp = new JTextField("98.6", 8);
        txtRr = new JTextField("16", 8);
        txtSpo2 = new JTextField("99", 8);
        txtWeight = new JTextField("65.0", 8);
        txtHeight = new JTextField("170.0", 8);
        lblBmi = new JLabel("22.49 (Normal)");
        lblBmi.setFont(UITheme.FONT_LABEL);
        lblBmi.setForeground(UITheme.SUCCESS);

        int r = 0;
        addVitalRow(cardVitals, g, r++, "Blood Pressure (mmHg) *:", txtBp);
        addVitalRow(cardVitals, g, r++, "Pulse Rate (beats/min) *:", txtPulse);
        addVitalRow(cardVitals, g, r++, "Body Temp (°F) *:", txtTemp);
        addVitalRow(cardVitals, g, r++, "Respiratory Rate (/min):", txtRr);
        addVitalRow(cardVitals, g, r++, "Oxygen Saturation SpO2 (%):", txtSpo2);
        addVitalRow(cardVitals, g, r++, "Weight (kg):", txtWeight);
        addVitalRow(cardVitals, g, r++, "Height (cm):", txtHeight);
        addVitalRow(cardVitals, g, r++, "Calculated BMI:", lblBmi);

        grid.add(cardVitals);

        // Right Column: General & Systemic Notes
        JPanel cardNotes = new JPanel(new GridLayout(2, 1, 10, 10));
        cardNotes.setOpaque(false);

        txtGeneralExam = new JTextArea(4, 20);
        txtGeneralExam.setLineWrap(true);
        txtGeneralExam.setWrapStyleWord(true);

        txtSystemicExam = new JTextArea(4, 20);
        txtSystemicExam.setLineWrap(true);
        txtSystemicExam.setWrapStyleWord(true);

        cardNotes.add(createSubPanel("General Survey (Pallor, Icterus, Cyanosis, Clubbing, Edema)", txtGeneralExam));
        cardNotes.add(createSubPanel("Systemic Examination (CVS, RS, CNS, Per Abdomen)", txtSystemicExam));

        grid.add(cardNotes);
        centerPanel.add(new JScrollPane(grid), BorderLayout.CENTER);
        root.add(centerPanel, BorderLayout.CENTER);

        // Bottom Action Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        btnClear = UITheme.createSecondaryButton("Clear Vitals");
        btnClear.addActionListener(e -> clearForm());

        btnSave = UITheme.createSuccessButton("Save Examination Findings");
        btnSave.addActionListener(e -> saveExamination());

        rightActions.add(btnClear);
        rightActions.add(btnSave);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void addVitalRow(JPanel p, GridBagConstraints g, int row, String label, Component comp) {
        g.gridx = 0; g.gridy = row; g.weightx = 0.4;
        JLabel l = new JLabel(label);
        l.setFont(UITheme.FONT_LABEL);
        p.add(l, g);

        g.gridx = 1; g.weightx = 0.6;
        p.add(comp, g);
    }

    private JPanel createSubPanel(String title, JTextArea area) {
        JPanel p = new JPanel(new BorderLayout(5, 5));
        p.setBackground(Color.WHITE);
        p.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(10, 10, 10, 10)));

        JLabel l = new JLabel(title);
        l.setFont(UITheme.FONT_LABEL);
        l.setForeground(UITheme.PRIMARY);

        p.add(l, BorderLayout.NORTH);
        p.add(new JScrollPane(area), BorderLayout.CENTER);
        return p;
    }

    private void loadPatients() {
        try {
            List<Patient> list = new PatientDAO().getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveExamination() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation", JOptionPane.WARNING_MESSAGE);
            return;
        }

        try {
            Examination ex = new Examination();
            ex.setPatientId(p.getPatientId());
            ex.setBloodPressure(txtBp.getText().trim());
            ex.setPulseRate(Integer.parseInt(txtPulse.getText().trim()));
            ex.setTemperature(Double.parseDouble(txtTemp.getText().trim()));
            ex.setRespiratoryRate(Integer.parseInt(txtRr.getText().trim()));
            ex.setSpo2(Integer.parseInt(txtSpo2.getText().trim()));
            ex.setWeightKg(Double.parseDouble(txtWeight.getText().trim()));
            ex.setHeightCm(Double.parseDouble(txtHeight.getText().trim()));
            ex.setGeneralExam(txtGeneralExam.getText().trim());
            ex.setSystemicExam(txtSystemicExam.getText().trim());

            if (controller.saveExamination(ex, this)) {
                dispose();
            }
        } catch (NumberFormatException nfe) {
            JOptionPane.showMessageDialog(this,
                "Please verify numeric values for Pulse, Temp, Resp Rate, SpO2, Weight, and Height.",
                "Numeric Format Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearForm() {
        txtBp.setText("120/80");
        txtPulse.setText("72");
        txtTemp.setText("98.6");
        txtRr.setText("16");
        txtSpo2.setText("99");
        txtWeight.setText("65.0");
        txtHeight.setText("170.0");
        txtGeneralExam.setText("");
        txtSystemicExam.setText("");
    }
}
