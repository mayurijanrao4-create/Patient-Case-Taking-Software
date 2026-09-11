package view;

import controller.CaseController;
import dao.PatientDAO;
import model.Patient;
import model.Prescription;
import model.PrescriptionMedicine;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 11: Prescription Builder
 * Allows attending clinician to assemble dynamic multi-drug regimens with JTable preview.
 */
public class PrescriptionForm extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextField txtDoctor;
    private JTextArea txtAdvice;

    // Drug Input Line
    private JTextField txtDrugName;
    private JTextField txtDosage;
    private JComboBox<String> cmbFrequency;
    private JTextField txtDuration;
    private JTextField txtInstructions;

    private JButton btnAddDrug;
    private JButton btnRemoveDrug;

    private JTable tblMedicines;
    private DefaultTableModel modelMedicines;

    private JButton btnBack;
    private JButton btnClear;
    private JButton btnSavePrescription;

    private final CaseController controller = new CaseController();

    public PrescriptionForm(String doctorName) {
        setTitle("Prescription Builder & Drug Dispensation");
        setSize(950, 720);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents(doctorName);
        loadPatients();
    }

    private void initComponents(String doc) {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Digital Prescription Builder", "Dispense medications, specify dosages, administration schedules, and lifestyle advice"), BorderLayout.NORTH);

        // Center Content
        JPanel centerPanel = new JPanel(new BorderLayout(0, 10));
        centerPanel.setBorder(new EmptyBorder(10, 20, 10, 20));
        centerPanel.setOpaque(false);

        // Patient & Doctor Bar
        JPanel topMeta = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 8));
        topMeta.setBackground(Color.WHITE);
        topMeta.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(6, 12, 6, 12)));

        cmbPatient = new JComboBox<>();
        cmbPatient.setPreferredSize(new Dimension(320, 30));
        txtDoctor = new JTextField(doc != null ? doc : "Attending Doctor", 16);

        topMeta.add(new JLabel("Select Outpatient *:"));
        topMeta.add(cmbPatient);
        topMeta.add(new JLabel("Prescribing Clinician:"));
        topMeta.add(txtDoctor);
        centerPanel.add(topMeta, BorderLayout.NORTH);

        // Center Split: Drug Entry Strip + JTable + Advice Area
        JPanel centerInner = new JPanel(new BorderLayout(0, 10));
        centerInner.setOpaque(false);

        // Drug Entry Strip
        JPanel drugStrip = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        drugStrip.setBackground(Color.WHITE);
        drugStrip.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(6, 10, 6, 10)));

        txtDrugName = new JTextField(12);
        txtDosage = new JTextField("500 mg", 6);
        cmbFrequency = new JComboBox<>(new String[]{
            "1-0-1 (Twice Daily)", "1-1-1 (Thrice Daily)", "1-0-0 (Morning)", "0-0-1 (Night)", "SOS (As Needed)", "QID (4 times/day)"
        });
        txtDuration = new JTextField("5 Days", 6);
        txtInstructions = new JTextField("After meals", 10);

        btnAddDrug = UITheme.createPrimaryButton("+ Add Drug");
        btnAddDrug.addActionListener(e -> addDrugRow());

        btnRemoveDrug = UITheme.createDangerButton("Remove Item");
        btnRemoveDrug.addActionListener(e -> removeSelectedDrug());

        drugStrip.add(new JLabel("Drug Name:")); drugStrip.add(txtDrugName);
        drugStrip.add(new JLabel("Dose:")); drugStrip.add(txtDosage);
        drugStrip.add(new JLabel("Freq:")); drugStrip.add(cmbFrequency);
        drugStrip.add(new JLabel("Duration:")); drugStrip.add(txtDuration);
        drugStrip.add(new JLabel("Remarks:")); drugStrip.add(txtInstructions);
        drugStrip.add(btnAddDrug);
        drugStrip.add(btnRemoveDrug);
        centerInner.add(drugStrip, BorderLayout.NORTH);

        // JTable for Prescription Drugs
        modelMedicines = new DefaultTableModel(new String[]{
            "#", "Medication / Drug Name", "Dosage", "Frequency / Regimen", "Duration", "Special Instructions"
        }, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        tblMedicines = new JTable(modelMedicines);
        UITheme.styleTable(tblMedicines);
        centerInner.add(new JScrollPane(tblMedicines), BorderLayout.CENTER);

        // Dietary & General Advice
        JPanel pnlAdvice = new JPanel(new BorderLayout(5, 5));
        pnlAdvice.setBackground(Color.WHITE);
        pnlAdvice.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(10, 10, 10, 10)));

        JLabel lblAdv = new JLabel("Dietary Instructions, Precautions & Follow-up Advice:");
        lblAdv.setFont(UITheme.FONT_LABEL);
        txtAdvice = new JTextArea(3, 20);
        txtAdvice.setLineWrap(true);
        txtAdvice.setWrapStyleWord(true);
        pnlAdvice.add(lblAdv, BorderLayout.NORTH);
        pnlAdvice.add(new JScrollPane(txtAdvice), BorderLayout.CENTER);

        centerInner.add(pnlAdvice, BorderLayout.SOUTH);
        centerPanel.add(centerInner, BorderLayout.CENTER);
        root.add(centerPanel, BorderLayout.CENTER);

        // Bottom Action Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        btnClear = UITheme.createSecondaryButton("Clear Rx");
        btnClear.addActionListener(e -> clearForm());

        btnSavePrescription = UITheme.createSuccessButton("Save & Issue Prescription");
        btnSavePrescription.addActionListener(e -> savePrescription());

        rightActions.add(btnClear);
        rightActions.add(btnSavePrescription);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void addDrugRow() {
        String drug = txtDrugName.getText().trim();
        if (drug.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please specify a drug/medication name.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int count = modelMedicines.getRowCount() + 1;
        modelMedicines.addRow(new Object[]{
            count,
            drug,
            txtDosage.getText().trim(),
            cmbFrequency.getSelectedItem(),
            txtDuration.getText().trim(),
            txtInstructions.getText().trim()
        });

        txtDrugName.setText("");
        txtDrugName.requestFocus();
    }

    private void removeSelectedDrug() {
        int r = tblMedicines.getSelectedRow();
        if (r != -1) {
            modelMedicines.removeRow(r);
        } else {
            JOptionPane.showMessageDialog(this, "Select a medicine from table to remove.", "Notice", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void loadPatients() {
        try {
            List<Patient> list = new PatientDAO().getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void savePrescription() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (modelMedicines.getRowCount() == 0) {
            JOptionPane.showMessageDialog(this, "Please add at least one medication to the prescription.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        Prescription rx = new Prescription();
        rx.setPatientId(p.getPatientId());
        rx.setDoctorName(txtDoctor.getText().trim());
        rx.setAdvice(txtAdvice.getText().trim());

        for (int i = 0; i < modelMedicines.getRowCount(); i++) {
            PrescriptionMedicine pm = new PrescriptionMedicine();
            pm.setMedicineName((String) modelMedicines.getValueAt(i, 1));
            pm.setDosage((String) modelMedicines.getValueAt(i, 2));
            pm.setFrequency((String) modelMedicines.getValueAt(i, 3));
            pm.setDuration((String) modelMedicines.getValueAt(i, 4));
            pm.setInstructions((String) modelMedicines.getValueAt(i, 5));
            rx.addMedicine(pm);
        }

        if (controller.savePrescription(rx, this)) {
            dispose();
        }
    }

    private void clearForm() {
        modelMedicines.setRowCount(0);
        txtAdvice.setText("");
        txtDrugName.setText("");
    }
}
