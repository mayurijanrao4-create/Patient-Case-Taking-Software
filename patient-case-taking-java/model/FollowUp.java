package model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * FollowUp Entity - Review Schedule & Progress
 */
public class FollowUp {
    private int followupId;
    private int caseId;
    private Date followupDate;
    private String notes;
    private String status; // Scheduled, Completed, Cancelled, Missed
    private Timestamp createdAt;

    public FollowUp() {}

    public FollowUp(int caseId, Date followupDate, String notes, String status) {
        this.caseId = caseId;
        this.followupDate = followupDate;
        this.notes = notes;
        this.status = status;
    }

    public int getFollowupId() { return followupId; }
    public void setFollowupId(int followupId) { this.followupId = followupId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public Date getFollowupDate() { return followupDate; }
    public void setFollowupDate(Date followupDate) { this.followupDate = followupDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
