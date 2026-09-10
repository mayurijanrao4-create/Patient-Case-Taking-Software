package view;

import controller.CaseController;
import dao.PatientDAO;
import model.*;

import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.sql.SQLException;
import java.util.List;

/**
 * Screen 13: Patient Case History (Longitudinal Medical Dossier)
 * Assembles chronological case narrative, vitals, diagnoses, prescriptions, and follow-ups.
 */
public class CaseHistoryFrame extends JFrame {
    private JComboBox<Patient> cmbPatient;
    private JButton btnFetch;
    private JEditorPane epTimeline;
    private JButton btnPrint;
    private JButton btnBack;

    private final CaseController controller = new CaseController();

    public CaseHistoryFrame() {
        setTitle("Longitudinal Patient Case Dossier & Clinical Timeline");
        setSize(950, 750);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        initComponents();
        loadPatients();
    }

    private void initComponents() {
        JPanel root = new JPanel(new BorderLayout(0, 12));
        root.setBackground(UITheme.BG_LIGHT);

        // Header
        root.add(UITheme.createHeader("Outpatient Medical Dossier", "Consolidated chronological archive of anamnesis, physical vitals, prescriptions, and follow-ups"), BorderLayout.NORTH);

        // Center Area
        JPanel center = new JPanel(new BorderLayout(0, 10));
        center.setBorder(new EmptyBorder(10, 20, 10, 20));
        center.setOpaque(false);

        // Selector Bar
        JPanel selectBar = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 8));
        selectBar.setBackground(Color.WHITE);
        selectBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(6, 12, 6, 12)));

        JLabel lbl = new JLabel("Select Outpatient:");
        lbl.setFont(UITheme.FONT_LABEL);
        cmbPatient = new JComboBox<>();
        cmbPatient.setPreferredSize(new Dimension(380, 30));

        btnFetch = UITheme.createPrimaryButton("Load Medical Dossier");
        btnFetch.addActionListener(e -> renderDossier());

        selectBar.add(lbl);
        selectBar.add(cmbPatient);
        selectBar.add(btnFetch);
        center.add(selectBar, BorderLayout.NORTH);

        // HTML Timeline Viewer
        epTimeline = new JEditorPane();
        epTimeline.setContentType("text/html");
        epTimeline.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(epTimeline);
        scrollPane.setBorder(new LineBorder(UITheme.BORDER, 1));
        center.add(scrollPane, BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);

        // Bottom Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setBackground(Color.WHITE);
        bottomBar.setBorder(new CompoundBorder(new LineBorder(UITheme.BORDER, 1), new EmptyBorder(12, 20, 12, 20)));

        btnBack = UITheme.createSecondaryButton("← Back to Dashboard");
        btnBack.addActionListener(e -> dispose());

        btnPrint = UITheme.createPrimaryButton("Print Case Summary");
        btnPrint.addActionListener(e -> {
            try {
                epTimeline.print();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Print error: " + ex.getMessage());
            }
        });

        bottomBar.add(btnBack, BorderLayout.WEST);
        bottomBar.add(btnPrint, BorderLayout.EAST);
        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private void loadPatients() {
        try {
            List<Patient> list = new PatientDAO().getAllPatients();
            for (Patient p : list) cmbPatient.addItem(p);
            if (!list.isEmpty()) renderDossier();
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void renderDossier() {
        Patient p = (Patient) cmbPatient.getSelectedItem();
        if (p == null) return;

        try {
            List<CaseHistory> histories = controller.getHistories(p.getPatientId());
            List<Examination> exams = controller.getExaminations(p.getPatientId());
            List<Diagnosis> diagnoses = controller.getDiagnoses(p.getPatientId());
            List<Prescription> rxs = controller.getPrescriptions(p.getPatientId());
            List<FollowUp> followUps = controller.getFollowUps(p.getPatientId());

            StringBuilder sb = new StringBuilder();
            sb.append("<html><body style='font-family: Segoe UI, sans-serif; padding: 20px; color: #0f172a; background-color: #ffffff;'>");

            // Patient Card Banner
            sb.append("<div style='background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; margin-bottom: 24px;'>");
            sb.append("<h2 style='margin:0 0 6px 0; color: #1e3a8a;'>").append(p.getFullName()).append(" (OPD: ").append(p.getOpdNumber()).append(")</h2>");
            sb.append("<p style='margin:0; color: #475569;'><b>Age:</b> ").append(p.getAge()).append(" Yrs | <b>Gender:</b> ").append(p.getGender())
              .append(" | <b>Blood Group:</b> ").append(p.getBloodGroup()).append(" | <b>Mobile:</b> ").append(p.getContactNumber())
              .append(" | <b>Address:</b> ").append(p.getAddress()).append("</p>");
            sb.append("</div>");

            // Section 1: Anamnesis
            sb.append("<h3 style='color: #1e3a8a; border-bottom: 2px solid #2563eb; padding-bottom: 4px;'>1. Anamnesis & Case History</h3>");
            if (histories.isEmpty()) {
                sb.append("<p style='color: #94a3b8;'>No case history on record.</p>");
            } else {
                for (CaseHistory ch : histories) {
                    sb.append("<div style='margin-bottom: 14px; border-left: 4px solid #2563eb; padding-left: 12px;'>");
                    sb.append("<b>Chief Complaints:</b> ").append(ch.getChiefComplaints()).append("<br/>");
                    if (ch.getHpi() != null && !ch.getHpi().isEmpty()) sb.append("<b>HPI:</b> ").append(ch.getHpi()).append("<br/>");
                    if (ch.getPastHistory() != null) sb.append("<b>Past Medical/Surgical:</b> ").append(ch.getPastHistory()).append("<br/>");
                    if (ch.getAllergies() != null && !ch.getAllergies().isEmpty()) sb.append("<b>Allergies:</b> <span style='color:#dc2626; font-weight:bold;'>").append(ch.getAllergies()).append("</span><br/>");
                    sb.append("<small style='color: #64748b;'>Recorded: ").append(ch.getRecordedAt()).append("</small>");
                    sb.append("</div>");
                }
            }

            // Section 2: Vitals & Examinations
            sb.append("<h3 style='color: #1e3a8a; border-bottom: 2px solid #059669; padding-bottom: 4px; margin-top: 24px;'>2. Objective Physical Vitals</h3>");
            if (exams.isEmpty()) {
                sb.append("<p style='color: #94a3b8;'>No examination records.</p>");
            } else {
                for (Examination ex : exams) {
                    sb.append("<div style='margin-bottom: 14px; border-left: 4px solid #059669; padding-left: 12px;'>");
                    sb.append("<b>Blood Pressure:</b> ").append(ex.getBloodPressure()).append(" mmHg | <b>Pulse:</b> ").append(ex.getPulseRate())
                      .append(" bpm | <b>Temp:</b> ").append(ex.getTemperature()).append(" °F | <b>SpO2:</b> ").append(ex.getSpo2()).append("% | <b>Weight:</b> ").append(ex.getWeightKg()).append(" kg<br/>");
                    if (ex.getGeneralExam() != null) sb.append("<b>General:</b> ").append(ex.getGeneralExam()).append("<br/>");
                    if (ex.getSystemicExam() != null) sb.append("<b>Systemic:</b> ").append(ex.getSystemicExam()).append("<br/>");
                    sb.append("<small style='color: #64748b;'>Logged: ").append(ex.getRecordedAt()).append("</small>");
                    sb.append("</div>");
                }
            }

            // Section 3: Diagnostic Assessment
            sb.append("<h3 style='color: #1e3a8a; border-bottom: 2px solid #d97706; padding-bottom: 4px; margin-top: 24px;'>3. Diagnostic Decisions</h3>");
            if (diagnoses.isEmpty()) {
                sb.append("<p style='color: #94a3b8;'>No diagnosis recorded.</p>");
            } else {
                for (Diagnosis d : diagnoses) {
                    sb.append("<div style='margin-bottom: 14px; border-left: 4px solid #d97706; padding-left: 12px;'>");
                    sb.append("<b>Provisional Diagnosis:</b> ").append(d.getProvisionalDiagnosis()).append("<br/>");
                    if (d.getFinalDiagnosis() != null) sb.append("<b>Final Diagnosis:</b> ").append(d.getFinalDiagnosis()).append("<br/>");
                    if (d.getIcdCode() != null) sb.append("<b>ICD-10 Code:</b> <span style='background:#fef3c7; padding:2px 6px;'>").append(d.getIcdCode()).append("</span><br/>");
                    sb.append("<small style='color: #64748b;'>Logged: ").append(d.getRecordedAt()).append("</small>");
                    sb.append("</div>");
                }
            }

            // Section 4: Prescriptions
            sb.append("<h3 style='color: #1e3a8a; border-bottom: 2px solid #7c3aed; padding-bottom: 4px; margin-top: 24px;'>4. Pharmacotherapy & Prescriptions</h3>");
            if (rxs.isEmpty()) {
                sb.append("<p style='color: #94a3b8;'>No medications prescribed.</p>");
            } else {
                for (Prescription rx : rxs) {
                    sb.append("<div style='margin-bottom: 18px; border-left: 4px solid #7c3aed; padding-left: 12px;'>");
                    sb.append("<b>Prescribing Clinician:</b> ").append(rx.getDoctorName()).append(" on ").append(rx.getPrescribedAt()).append("<br/>");
                    sb.append("<table border='1' cellpadding='6' cellspacing='0' style='border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 12px; border-color: #cbd5e1;'>");
                    sb.append("<tr bgcolor='#f1f5f9'><th>#</th><th>Medication</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr>");
                    int i = 1;
                    for (PrescriptionMedicine m : rx.getMedicines()) {
                        sb.append("<tr><td>").append(i++).append("</td>")
                          .append("<td><b>").append(m.getMedicineName()).append("</b></td>")
                          .append("<td>").append(m.getDosage()).append("</td>")
                          .append("<td>").append(m.getFrequency()).append("</td>")
                          .append("<td>").append(m.getDuration()).append("</td>")
                          .append("<td>").append(m.getInstructions()).append("</td></tr>");
                    }
                    sb.append("</table>");
                    if (rx.getAdvice() != null && !rx.getAdvice().isEmpty()) sb.append("<b>Dietary/Clinical Advice:</b> ").append(rx.getAdvice());
                    sb.append("</div>");
                }
            }

            // Section 5: Follow-Up
            sb.append("<h3 style='color: #1e3a8a; border-bottom: 2px solid #db2777; padding-bottom: 4px; margin-top: 24px;'>5. Follow-Up Reviews</h3>");
            if (followUps.isEmpty()) {
                sb.append("<p style='color: #94a3b8;'>No follow-up visits recorded.</p>");
            } else {
                for (FollowUp f : followUps) {
                    sb.append("<div style='margin-bottom: 14px; border-left: 4px solid #db2777; padding-left: 12px;'>");
                    sb.append("<b>Visit Date:</b> ").append(f.getVisitDate()).append(" | <b>Scheduled Next Review:</b> ").append(f.getNextFollowupDate()).append("<br/>");
                    sb.append("<b>Progress:</b> ").append(f.getSymptomsProgress()).append("<br/>");
                    sb.append("<b>Therapy Titration:</b> ").append(f.getTreatmentAdjusted()).append("<br/>");
                    sb.append("</div>");
                }
            }

            sb.append("</body></html>");
            epTimeline.setText(sb.toString());
            epTimeline.setCaretPosition(0);

        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
