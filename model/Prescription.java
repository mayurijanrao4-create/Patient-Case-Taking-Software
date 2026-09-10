package model;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Prescription Entity - Master Prescription Header
 */
public class Prescription {
    private int prescriptionId;
    private int caseId;
    private Date prescriptionDate;
    private String doctorNotes;
    private Timestamp createdAt;
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    public Prescription() {}

    public Prescription(int caseId, Date prescriptionDate, String doctorNotes) {
        this.caseId = caseId;
        this.prescriptionDate = prescriptionDate;
        this.doctorNotes = doctorNotes;
    }

    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public Date getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(Date prescriptionDate) { this.prescriptionDate = prescriptionDate; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public List<PrescriptionMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescriptionMedicine> medicines) { this.medicines = medicines; }
    public void addMedicine(PrescriptionMedicine med) { this.medicines.add(med); }
}
