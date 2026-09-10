package model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Patient Entity - Master Demographic Profile
 */
public class Patient {
    private String patientId;
    private String name;
    private int age;
    private String gender; // Male, Female, Other
    private String mobile;
    private String address;
    private String bloodGroup;
    private Date registeredDate;
    private Timestamp createdAt;

    public Patient() {}

    public Patient(String patientId, String name, int age, String gender, String mobile, String address, String bloodGroup) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.mobile = mobile;
        this.address = address;
        this.bloodGroup = bloodGroup;
    }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Date getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(Date registeredDate) { this.registeredDate = registeredDate; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
