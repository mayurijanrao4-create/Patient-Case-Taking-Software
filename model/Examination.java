package model;

import java.sql.Timestamp;

/**
 * Examination Entity - Physical Vitals & Clinical Observation
 */
public class Examination {
    private int examId;
    private int caseId;
    private float temperature;
    private String bloodPressure;
    private int pulseRate;
    private float weight;
    private float height;
    private String observation;
    private Timestamp createdAt;

    public Examination() {}

    public Examination(int caseId, float temperature, String bloodPressure, int pulseRate, float weight, float height, String observation) {
        this.caseId = caseId;
        this.temperature = temperature;
        this.bloodPressure = bloodPressure;
        this.pulseRate = pulseRate;
        this.weight = weight;
        this.height = height;
        this.observation = observation;
    }

    public int getExamId() { return examId; }
    public void setExamId(int examId) { this.examId = examId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public float getTemperature() { return temperature; }
    public void setTemperature(float temperature) { this.temperature = temperature; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public int getPulseRate() { return pulseRate; }
    public void setPulseRate(int pulseRate) { this.pulseRate = pulseRate; }

    public float getWeight() { return weight; }
    public void setWeight(float weight) { this.weight = weight; }

    public float getHeight() { return height; }
    public void setHeight(float height) { this.height = height; }

    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
