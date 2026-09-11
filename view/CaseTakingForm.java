package view;

import controller.CaseController;
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
 * Screen 7: Case Taking Form
 * Captures chief complaints, duration, severity, modalities, and history of present illness (HPI).
 */
public class CaseTakingForm extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JTextArea txtChiefComplaints;
    private JTextField txtDuration;
    private JComboBox<String> cmbSeverity;
    private JTextArea txtHpi;
    private JTextArea txtModalities;
    private JTextArea txtAssociatedSymptoms;

    private JButton btnBack;
    private JButton btnClear;
    private JButton btnSave;

    private final CaseController controller = new CaseController();

    public CaseTakingForm() {
        setTitle("Clinical Case-Taking & Anamnesis");
        setSize(850, 720);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Clinical Case-Taking Form", "Record presenting illness, symptom modalities, duration and onset history"), BorderLayout.NORTH);

        // Center Content
        JPanel center = new JPanel(new BorderLayout(0, 12));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

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
        center.add(patientBar, BorderLayout.NORTH);

        // Tabs
        JTabbedPane tabs = new JTabbedPane();
        tabs.setFont(UITheme.FONT_LABEL);

        // Tab 1: Chief Complaints
        JPanel tabComplaints = new JPanel(new BorderLayout(10, 10));
        tabComplaints.setBackground(Color.WHITE);
        tabComplaints.setBorder(new EmptyBorder(15, 15, 15, 15));

        JPanel metaRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 5));
        metaRow.setOpaque(false);
        txtDuration = new JTextField("3 Days", 10);
        cmbSeverity = new JComboBox<>(new String[]{"Mild", "Moderate", "Severe", "Acute Exacerbation"});

        metaRow.add(new JLabel("Duration:")); metaRow.add(txtDuration);
        metaRow.add(new JLabel("Severity:")); metaRow.add(cmbSeverity);
        tabComplaints.add(metaRow, BorderLayout.NORTH);

        txtChiefComplaints = createTextArea();
        tabComplaints.add(new JScrollPane(txtChiefComplaints), BorderLayout.CENTER);
        tabs.addTab("1. Chief Complaints *", tabComplaints);

        // Tab 2: History of Present Illness (HPI)
        txtHpi = createTextArea();
        tabs.addTab("2. History of Present Illness (HPI)", wrapInPadding(txtHpi));

        // Tab 3: Modalities & Associated Symptoms
        JPanel tabModalities = new JPanel(new GridLayout(2, 1, 10, 10));
        tabModalities.setBackground(Color.WHITE);
        tabModalities.setBorder(new EmptyBorder(15, 15, 15, 15));

        txtModalities = createTextArea();
        txtAssociatedSymptoms = createTextArea();

        JPanel p1 = new JPanel(new BorderLayout(5, 5));
        p1.setOpaque(false);
        p1.add(new JLabel("Aggravating & Ameliorating Factors / Modalities:"), BorderLayout.NORTH);
        p1.add(new JScrollPane(txtModalities), BorderLayout.CENTER);

        JPanel p2 = new JPanel(new BorderLayout(5, 5));
        p2.setOpaque(false);
        p2.add(new JLabel("Associated Symptoms & Concomitants:"), BorderLayout.NORTH);
        p2.add(new JScrollPane(txtAssociatedSymptoms), BorderLayout.CENTER);

        tabModalities.add(p1);
        tabModalities.add(p2);
        tabs.addTab("3. Modalities & Concomitants", tabModalities);

        center.add(tabs, BorderLayout.CENTER);
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

        btnSave = UITheme.createSuccessButton("Save Case History");
        btnSave.addActionListener(e -> saveCase());

        rightActions.add(btnClear);
        rightActions.add(btnSave);

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private JPanel wrapInPadding(JComponent comp) {
        JPanel p = new JPanel(new BorderLayout());
        p.setBackground(Color.WHITE);
        p.setBorder(new EmptyBorder(15, 15, 15, 15));
        p.add(new JScrollPane(comp), BorderLayout.CENTER);
        return p;
    }

    private JTextArea createTextArea() {
        JTextArea area = new JTextArea(8, 40);
        area.setLineWrap(true);
        area.setWrapStyleWord(true);
        area.setFont(UITheme.FONT_BODY);
        return area;
    }

    private void loadPatients() {
        try {
            List<Patient> list = new PatientDAO().getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error loading patients: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveCase() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Please select an outpatient.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String complaints = txtChiefComplaints.getText().trim();
        if (complaints.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Chief Complaints cannot be blank.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        CaseHistory history = new CaseHistory();
        history.setPatientId(p.getPatientId());
        history.setChiefComplaints("Duration: " + txtDuration.getText().trim() + " | Severity: " + cmbSeverity.getSelectedItem() + "\n" + complaints);
        history.setHpi(txtHpi.getText().trim());
        history.setPersonalHistory("Modalities: " + txtModalities.getText().trim());
        history.setAllergies("Associated: " + txtAssociatedSymptoms.getText().trim());

        if (controller.saveCaseHistory(history, this)) {
            clearForm();
        }
    }

    private void clearForm() {
        txtChiefComplaints.setText("");
        txtHpi.setText("");
        txtModalities.setText("");
        txtAssociatedSymptoms.setText("");
        txtDuration.setText("");
    }
}
