package model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Diagnosis Entity - Medical Assessment Record
 */
public class Diagnosis {
    private int diagnosisId;
    private int caseId;
    private String diagnosisText;
    private String doctorNotes;
    private Date diagnosisDate;
    private Timestamp createdAt;

    public Diagnosis() {}

    public Diagnosis(int caseId, String diagnosisText, String doctorNotes, Date diagnosisDate) {
        this.caseId = caseId;
        this.diagnosisText = diagnosisText;
        this.doctorNotes = doctorNotes;
        this.diagnosisDate = diagnosisDate;
    }

    public int getDiagnosisId() { return diagnosisId; }
    public void setDiagnosisId(int diagnosisId) { this.diagnosisId = diagnosisId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public String getDiagnosisText() { return diagnosisText; }
    public void setDiagnosisText(String diagnosisText) { this.diagnosisText = diagnosisText; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }

    public Date getDiagnosisDate() { return diagnosisDate; }
    public void setDiagnosisDate(Date diagnosisDate) { this.diagnosisDate = diagnosisDate; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
