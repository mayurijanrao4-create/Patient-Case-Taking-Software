package model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * CaseHistory Entity - Consultation Encounter Record
 */
public class CaseHistory {
    private int caseId;
    private String patientId;
    private int doctorId;
    private Date visitDate;
    private String chiefComplaint;
    private String symptoms;
    private String duration;
    private String pastHistory;
    private String allergy;
    private String familyHistory;
    private String currentMedication;
    private Timestamp createdAt;

    public CaseHistory() {}

    public CaseHistory(String patientId, int doctorId, Date visitDate, String chiefComplaint, String symptoms, String duration) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.visitDate = visitDate;
        this.chiefComplaint = chiefComplaint;
        this.symptoms = symptoms;
        this.duration = duration;
    }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public int getDoctorId() { return doctorId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }

    public Date getVisitDate() { return visitDate; }
    public void setVisitDate(Date visitDate) { this.visitDate = visitDate; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPastHistory() { return pastHistory; }
    public void setPastHistory(String pastHistory) { this.pastHistory = pastHistory; }

    public String getAllergy() { return allergy; }
    public void setAllergy(String allergy) { this.allergy = allergy; }

    public String getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(String familyHistory) { this.familyHistory = familyHistory; }

    public String getCurrentMedication() { return currentMedication; }
    public void setCurrentMedication(String currentMedication) { this.currentMedication = currentMedication; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
