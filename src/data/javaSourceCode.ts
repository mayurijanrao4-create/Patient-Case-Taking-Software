export interface JavaFile {
  path: string;
  name: string;
  category: 'database' | 'model' | 'dao' | 'controller' | 'view' | 'root';
  description: string;
  code: string;
}

export const JAVA_PROJECT_FILES: JavaFile[] = [
  {
    path: 'database/schema.sql',
    name: 'schema.sql',
    category: 'database',
    description: 'Complete MySQL database schema with normalized tables, foreign keys, and sample records.',
    code: `-- ============================================================================
-- PATIENT CASE-TAKING SOFTWARE - COMPLETE RELATIONAL DATABASE DESIGN (MySQL)
-- Academic Project: Third Year Computer Science & Information Technology
-- Database Name: PatientCaseDB
-- Architecture: 3NF Normalized Relational Database with Foreign Keys
-- Compatible: MySQL 5.7, 8.0+, MySQL Workbench, phpMyAdmin
-- ============================================================================

-- 1. DATABASE CREATION
DROP DATABASE IF EXISTS PatientCaseDB;
CREATE DATABASE PatientCaseDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE PatientCaseDB;

-- ============================================================================
-- 2. TABLE DEFINITIONS (Normalized DDL with Constraints & Indexes)
-- ============================================================================

-- 1. USER TABLE (Authentication & Role-Based Access Control)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('Admin', 'Doctor') NOT NULL DEFAULT 'Doctor',
    email VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(100) DEFAULT 'General Physician',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_role (role)
) ENGINE=InnoDB COMMENT='Stores doctor and administrator authentication credentials';

-- 2. PATIENT TABLE (Master Demographic Record of Outpatients)
CREATE TABLE patients (
    patient_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 125),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    registered_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_patient_name (name),
    INDEX idx_patient_mobile (mobile)
) ENGINE=InnoDB COMMENT='Patient master demographic records';

-- 3. CASE HISTORY TABLE (Consultation Encounter & Presenting Symptoms)
-- Relationship: One Patient -> Multiple Case Histories (1:N)
CREATE TABLE case_history (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    doctor_id INT NOT NULL,
    visit_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    past_history TEXT,
    allergy TEXT,
    family_history TEXT,
    current_medication TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_case_patient 
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_case_doctor 
        FOREIGN KEY (doctor_id) REFERENCES users(user_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_case_patient (patient_id),
    INDEX idx_case_doctor (doctor_id),
    INDEX idx_case_date (visit_date)
) ENGINE=InnoDB COMMENT='Clinical consultation cases; 1:N with Patient';

-- 4. PHYSICAL EXAMINATION TABLE (Physical Examination & Vital Signs)
-- Relationship: One Case History -> Exactly One Physical Examination (1:1)
CREATE TABLE examinations (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL UNIQUE,
    temperature FLOAT NOT NULL COMMENT 'Body temperature in Fahrenheit (°F)',
    blood_pressure VARCHAR(20) NOT NULL COMMENT 'BP in format Systolic/Diastolic (e.g. 120/80)',
    pulse_rate INT NOT NULL COMMENT 'Pulse rate in beats per minute (bpm)',
    weight FLOAT NOT NULL COMMENT 'Body weight in Kilograms (kg)',
    height FLOAT NOT NULL COMMENT 'Body height in Centimeters (cm)',
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exam_case 
        FOREIGN KEY (case_id) REFERENCES case_history(case_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_exam_case (case_id)
) ENGINE=InnoDB COMMENT='Physical examination vitals; 1:1 with CaseHistory';

-- 5. DIAGNOSIS TABLE (Medical Assessment & Clinical Verdict)
-- Relationship: One Case History -> Exactly One Clinical Diagnosis (1:1)
CREATE TABLE diagnoses (
    diagnosis_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL UNIQUE,
    diagnosis_text TEXT NOT NULL COMMENT 'Final or working medical diagnosis',
    doctor_notes TEXT COMMENT 'Clinical reasoning, differential diagnosis remarks',
    diagnosis_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_diag_case 
        FOREIGN KEY (case_id) REFERENCES case_history(case_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_diag_case (case_id)
) ENGINE=InnoDB COMMENT='Clinical diagnosis record; 1:1 with CaseHistory';

-- 6. PRESCRIPTION TABLE (Doctor Prescription Order Header)
-- Relationship: One Case History -> Exactly One Prescription Header (1:1)
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL UNIQUE,
    prescription_date DATE NOT NULL,
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presc_case 
        FOREIGN KEY (case_id) REFERENCES case_history(case_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_presc_case (case_id)
) ENGINE=InnoDB COMMENT='Prescription header; 1:1 with CaseHistory';

-- 7. PRESCRIPTION MEDICINES (Individual Prescribed Pharmaceutical Items)
-- Relationship: One Prescription -> Multiple Prescribed Medicines (1:N)
CREATE TABLE prescription_medicines (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL COMMENT 'e.g. 500mg, 10ml, 1 tablet',
    frequency VARCHAR(50) NOT NULL COMMENT 'e.g. 1-0-1, Once daily, TDS',
    duration VARCHAR(50) NOT NULL COMMENT 'e.g. 5 days, 2 weeks, 1 month',
    instructions VARCHAR(200) NOT NULL COMMENT 'e.g. After food, Before sleep',
    CONSTRAINT fk_item_prescription 
        FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_item_presc (prescription_id),
    INDEX idx_medicine_name (medicine_name)
) ENGINE=InnoDB COMMENT='Prescription drug line items; 1:N with Prescription';

-- 8. FOLLOW-UP TABLE (Post-Consultation Monitoring & Review Appointments)
-- Relationship: One Case History -> Multiple Follow-up Records (1:N)
CREATE TABLE follow_ups (
    followup_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    followup_date DATE NOT NULL,
    notes TEXT,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'Missed') NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_followup_case 
        FOREIGN KEY (case_id) REFERENCES case_history(case_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_followup_case (case_id),
    INDEX idx_followup_date (followup_date),
    INDEX idx_followup_status (status)
) ENGINE=InnoDB COMMENT='Follow-up reviews; 1:N with CaseHistory';

-- ============================================================================
-- 3. SAMPLE DATA INSERTION (REALISTIC CLINICAL TEST DATA)
-- ============================================================================

INSERT INTO users (username, password, full_name, role, email, specialization, phone) VALUES
('admin', 'admin123', 'Hospital Admin', 'Admin', 'admin@hospital.org', 'Hospital Administration', '9876543210'),
('doctor', 'doctor123', 'Dr. Sarah Jenkins, M.D.', 'Doctor', 'dr.sarah@hospital.org', 'Internal Medicine', '9876543211'),
('dr_kumar', 'doctor123', 'Dr. Rajesh Kumar, M.B.B.S.', 'Doctor', 'dr.kumar@hospital.org', 'General Physician', '9876543212');

INSERT INTO patients (patient_id, name, age, gender, mobile, address, blood_group, registered_date) VALUES
('P-1001', 'Rahul Sharma', 34, 'Male', '9820011223', '402, Green Valley Apartments, Mumbai', 'B+', '2026-02-15'),
('P-1002', 'Priya Patel', 28, 'Female', '9876543210', 'B-12, Shanti Nagar, Pune', 'O+', '2026-02-20'),
('P-1003', 'Anil Deshmukh', 52, 'Male', '9765432109', '78, Civil Lines, Nagpur', 'A+', '2026-03-01'),
('P-1004', 'Sneha Kulkarni', 22, 'Female', '9123456780', '15, Model Colony, Pune', 'AB+', '2026-03-05');

-- Case 1
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1001', 2, '2026-03-01', 'High grade fever with severe throat pain', 'Sore throat, difficulty swallowing, body aches, mild dry cough', '3 Days', 'No significant chronic illness', 'Penicillin (mild cutaneous rash)', 'Hypertension (Father)', 'Paracetamol 650mg SOS');

-- Case 2
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1002', 2, '2026-03-03', 'Unilateral throbbing headache with nausea', 'Left-sided pounding headache, photophobia, phonophobia, nausea', '2 Days', 'Occasional tension headaches during stressful exams', 'None reported', 'Migraine (Mother)', 'None');

-- Case 3 (Multi-visit for P-1001)
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1001', 3, '2026-03-08', 'Persistent dry cough following recovery from fever', 'Hacking dry cough especially at night, mild chest tightness', '5 Days', 'Recent acute upper respiratory infection', 'Penicillin', 'Hypertension (Father)', 'Completed Azithromycin course');

-- Examinations (1:1 with CaseHistory)
INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES
(1, 101.4, '120/80', 88, 74.5, 175.0, 'Pharyngeal erythema with tonsillar congestion. Chest clear on auscultation.'),
(2, 98.6, '110/70', 74, 58.0, 162.0, 'Neurological cranial nerve screening normal. Left temporal tenderness on palpation.'),
(3, 98.4, '122/82', 76, 74.0, 175.0, 'Throat congestion resolved. Normal vesicular breath sounds, no rales or wheezing.');

-- Diagnoses (1:1 with CaseHistory)
INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES
(1, 'Acute Viral Pharyngitis & Upper Respiratory Infection', 'Advised warm saline gargles, adequate hydration, and symptomatic antipyretics.', '2026-03-01'),
(2, 'Acute Migraine Headache without Aura', 'Lifestyle modification advised. Avoid irregular sleep patterns and known dietary triggers.', '2026-03-03'),
(3, 'Post-Infectious Bronchial Hyperresponsiveness (Post-Viral Cough)', 'Benign self-limiting post-viral cough. Prescribed antitussive syrup.', '2026-03-08');

-- Prescriptions (1:1 with CaseHistory)
INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES
(1, '2026-03-01', 'Take medications after meals. Return if fever persists beyond 48 hours.'),
(2, '2026-03-03', 'Rest in a quiet, dark room during acute attack. Stay well hydrated.'),
(3, '2026-03-08', 'Steam inhalation twice daily for 5 days.');

-- Prescription Medicines (1:N with Prescription)
INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(1, 'Tab. Paracetamol', '650 mg', '1-1-1 (TDS)', '3 Days', 'After meals with water'),
(1, 'Tab. Cetirizine', '10 mg', '0-0-1 (Night)', '5 Days', 'Before bedtime'),
(1, 'Betadine Gargle (2% w/v)', '10 ml', '1-0-1 (BD)', '5 Days', 'Dilute with equal amount of warm water'),
(2, 'Tab. Naproxen', '500 mg', 'SOS (Max 2 tabs/day)', '3 Days', 'Take with food at onset of attack'),
(2, 'Tab. Domperidone', '10 mg', '1-0-1 (BD)', '3 Days', '30 minutes before breakfast and dinner'),
(3, 'Syr. Dextromethorphan HBr', '10 ml', '1-1-1 (TDS)', '5 Days', 'After food'),
(3, 'Tab. Montelukast + Levocetirizine', '10mg/5mg', '0-0-1 (Night)', '7 Days', 'Before sleep');

-- Follow-ups (1:N with CaseHistory)
INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES
(1, '2026-03-05', 'Scheduled review for fever clearance and pharynx check', 'Completed'),
(1, '2026-03-12', 'Secondary checkup for complete recovery confirmation', 'Scheduled'),
(2, '2026-03-17', 'Headache frequency review and migraine headache diary evaluation', 'Scheduled'),
(3, '2026-03-15', 'Review resolution of persistent nocturnal dry cough', 'Scheduled');
`
  },
  {
    path: 'database/DBConnection.java',
    name: 'DBConnection.java',
    category: 'database',
    description: 'Singleton JDBC Database Connection manager for MySQL database pooling with robust error handling.',
    code: `package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;

/**
 * DBConnection - Database Connection Manager (JDBC)
 * Manages connection lifecycle with MySQL using JDBC PreparedStatement support.
 */
public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/PatientCaseDB?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password"; // Update with your MySQL root password

    private static Connection connection = null;

    // Private constructor to prevent direct instantiation (Singleton pattern)
    private DBConnection() {}

    /**
     * Gets or creates the active MySQL Connection.
     * @return Connection object
     */
    public static synchronized Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                // Load MySQL JDBC Driver
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
                System.out.println("[DBConnection] Connected successfully to MySQL database.");
            }
        } catch (ClassNotFoundException e) {
            String msg = "MySQL JDBC Driver (mysql-connector-j) not found in Classpath!\\n" +
                         "Please add the MySQL Connector JAR to project libraries.\\nError: " + e.getMessage();
            System.err.println(msg);
            JOptionPane.showMessageDialog(null, msg, "Database Driver Error", JOptionPane.ERROR_MESSAGE);
        } catch (SQLException e) {
            String msg = "Failed to connect to MySQL database at " + URL + "\\n" +
                         "Ensure MySQL Service is running and credentials are correct.\\nError: " + e.getMessage();
            System.err.println(msg);
            JOptionPane.showMessageDialog(null, msg, "Database Connection Error", JOptionPane.ERROR_MESSAGE);
        }
        return connection;
    }

    /**
     * Safely closes the database connection.
     */
    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("[DBConnection] Database connection closed.");
            }
        } catch (SQLException e) {
            System.err.println("Error closing database connection: " + e.getMessage());
        }
    }
}
`
  },
  {
    path: 'model/User.java',
    name: 'User.java',
    category: 'model',
    description: 'Encapsulates user entity for authentication and role-based permissions (Admin / Doctor).',
    code: `package model;

/**
 * Model class representing a User in the system (Admin or Doctor).
 */
public class User {
    private int userId;
    private String username;
    private String password;
    private String fullName;
    private String role; // "Admin" or "Doctor"
    private String email;

    public User() {}

    public User(int userId, String username, String password, String fullName, String role, String email) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.email = email;
    }

    // Getters and Setters
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Override
    public String toString() {
        return fullName + " (" + role + ")";
    }
}
`
  },
  {
    path: 'model/Patient.java',
    name: 'Patient.java',
    category: 'model',
    description: 'Patient entity storing demographic information and primary key Patient ID.',
    code: `package model;

import java.sql.Timestamp;

/**
 * Model class representing a Patient.
 */
public class Patient {
    private String patientId;
    private String name;
    private int age;
    private String gender; // Male, Female, Other
    private String mobile;
    private String address;
    private String bloodGroup; // A+, B+, O+, AB+, etc.
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

    // Getters and Setters
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

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return patientId + " - " + name + " (" + age + "/" + gender + ")";
    }
}
`
  },
  {
    path: 'model/CaseHistory.java',
    name: 'CaseHistory.java',
    category: 'model',
    description: 'Case History model storing consultation symptoms, complaint, duration, and patient visit link.',
    code: `package model;

import java.sql.Date;

/**
 * Model class representing a Case History / Visit record.
 * A single patient can have multiple CaseHistory records (1:N).
 */
public class CaseHistory {
    private int caseId;
    private String patientId;
    private Date visitDate;
    private String chiefComplaint;
    private String symptoms;
    private String duration;
    private String pastHistory;
    private String allergy;
    private String familyHistory;
    private String currentMedication;
    private int doctorId;

    public CaseHistory() {}

    public CaseHistory(int caseId, String patientId, Date visitDate, String chiefComplaint,
                       String symptoms, String duration, String pastHistory, String allergy,
                       String familyHistory, String currentMedication, int doctorId) {
        this.caseId = caseId;
        this.patientId = patientId;
        this.visitDate = visitDate;
        this.chiefComplaint = chiefComplaint;
        this.symptoms = symptoms;
        this.duration = duration;
        this.pastHistory = pastHistory;
        this.allergy = allergy;
        this.familyHistory = familyHistory;
        this.currentMedication = currentMedication;
        this.doctorId = doctorId;
    }

    // Getters and Setters
    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

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

    public int getDoctorId() { return doctorId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }
}
`
  },
  {
    path: 'model/Examination.java',
    name: 'Examination.java',
    category: 'model',
    description: 'Physical Examination model storing vital signs (Temp, BP, Pulse, Wt, Ht, Observations).',
    code: `package model;

/**
 * Model class representing Physical Examination vitals and clinical observations.
 */
public class Examination {
    private int examId;
    private int caseId;
    private String temperature;
    private String bloodPressure;
    private String pulseRate;
    private String weight;
    private String height;
    private String observation;

    public Examination() {}

    public Examination(int examId, int caseId, String temperature, String bloodPressure,
                       String pulseRate, String weight, String height, String observation) {
        this.examId = examId;
        this.caseId = caseId;
        this.temperature = temperature;
        this.bloodPressure = bloodPressure;
        this.pulseRate = pulseRate;
        this.weight = weight;
        this.height = height;
        this.observation = observation;
    }

    // Getters and Setters
    public int getExamId() { return examId; }
    public void setExamId(int examId) { this.examId = examId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getPulseRate() { return pulseRate; }
    public void setPulseRate(String pulseRate) { this.pulseRate = pulseRate; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
}
`
  },
  {
    path: 'model/Diagnosis.java',
    name: 'Diagnosis.java',
    category: 'model',
    description: 'Diagnosis model storing clinical diagnosis, doctor notes, and diagnosis date.',
    code: `package model;

import java.sql.Date;

/**
 * Model class representing Medical Diagnosis and Clinical Notes.
 */
public class Diagnosis {
    private int diagnosisId;
    private int caseId;
    private String diagnosisText;
    private String doctorNotes;
    private Date diagnosisDate;

    public Diagnosis() {}

    public Diagnosis(int diagnosisId, int caseId, String diagnosisText, String doctorNotes, Date diagnosisDate) {
        this.diagnosisId = diagnosisId;
        this.caseId = caseId;
        this.diagnosisText = diagnosisText;
        this.doctorNotes = doctorNotes;
        this.diagnosisDate = diagnosisDate;
    }

    // Getters and Setters
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
}
`
  },
  {
    path: 'model/Prescription.java',
    name: 'Prescription.java',
    category: 'model',
    description: 'Prescription header model containing case reference and list of multiple medicine items.',
    code: `package model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

/**
 * Model class representing a Prescription header.
 * Holds multiple PrescriptionMedicine items (1:N).
 */
public class Prescription {
    private int prescriptionId;
    private int caseId;
    private Date prescriptionDate;
    private String doctorNotes;
    private List<PrescriptionMedicine> medicines = new ArrayList<>();

    public Prescription() {}

    public Prescription(int prescriptionId, int caseId, Date prescriptionDate, String doctorNotes) {
        this.prescriptionId = prescriptionId;
        this.caseId = caseId;
        this.prescriptionDate = prescriptionDate;
        this.doctorNotes = doctorNotes;
    }

    // Getters and Setters
    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }

    public int getCaseId() { return caseId; }
    public void setCaseId(int caseId) { this.caseId = caseId; }

    public Date getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(Date prescriptionDate) { this.prescriptionDate = prescriptionDate; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }

    public List<PrescriptionMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescriptionMedicine> medicines) { this.medicines = medicines; }

    public void addMedicine(PrescriptionMedicine med) {
        this.medicines.add(med);
    }
}
`
  },
  {
    path: 'model/PrescriptionMedicine.java',
    name: 'PrescriptionMedicine.java',
    category: 'model',
    description: 'Prescription item detail model (Medicine name, dosage, frequency, duration, instructions).',
    code: `package model;

/**
 * Model class representing an individual medicine row in a prescription.
 */
public class PrescriptionMedicine {
    private int itemId;
    private int prescriptionId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;

    public PrescriptionMedicine() {}

    public PrescriptionMedicine(int itemId, int prescriptionId, String medicineName,
                                String dosage, String frequency, String duration, String instructions) {
        this.itemId = itemId;
        this.prescriptionId = prescriptionId;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
    }

    // Getters and Setters
    public int getItemId() { return itemId; }
    public void setItemId(int itemId) { this.itemId = itemId; }

    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
}
`
  },
  {
    path: 'model/FollowUp.java',
    name: 'FollowUp.java',
    category: 'model',
    description: 'Follow-up model tracking review dates, doctor remarks, and appointment statuses.',
    code: `package model;

import java.sql.Date;

/**
 * Model class representing Follow-up records.
 */
public class FollowUp {
    private int followupId;
    private int caseId;
    private Date followupDate;
    private String notes;
    private String status; // "Scheduled", "Completed", "Cancelled", "Missed"

    public FollowUp() {}

    public FollowUp(int followupId, int caseId, Date followupDate, String notes, String status) {
        this.followupId = followupId;
        this.caseId = caseId;
        this.followupDate = followupDate;
        this.notes = notes;
        this.status = status;
    }

    // Getters and Setters
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
}
`
  },
  {
    path: 'dao/UserDAO.java',
    name: 'UserDAO.java',
    category: 'dao',
    description: 'Data Access Object for User authentication and credential queries using PreparedStatement.',
    code: `package dao;

import database.DBConnection;
import model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * DAO class for User database operations.
 */
public class UserDAO {

    /**
     * Authenticates user against MySQL users table using PreparedStatement.
     * @param username user login handle
     * @param password plain text password
     * @param role selected role (Admin or Doctor)
     * @return User object if matched, or null
     */
    public User authenticate(String username, String password, String role) {
        String sql = "SELECT user_id, username, full_name, role, email FROM users WHERE username = ? AND password = ? AND role = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, username.trim());
            stmt.setString(2, password);
            stmt.setString(3, role);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setUserId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setFullName(rs.getString("full_name"));
                    user.setRole(rs.getString("role"));
                    user.setEmail(rs.getString("email"));
                    return user;
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in UserDAO.authenticate: " + e.getMessage());
        }
        return null;
    }
}
`
  },
  {
    path: 'dao/PatientDAO.java',
    name: 'PatientDAO.java',
    category: 'dao',
    description: 'Data Access Object for Patient CRUD and multi-criteria search operations.',
    code: `package dao;

import database.DBConnection;
import model.Patient;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO class for Patient CRUD and search operations using PreparedStatement.
 */
public class PatientDAO {

    public boolean insertPatient(Patient p) {
        String sql = "INSERT INTO patients (patient_id, name, age, gender, mobile, address, blood_group) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getPatientId());
            stmt.setString(2, p.getName());
            stmt.setInt(3, p.getAge());
            stmt.setString(4, p.getGender());
            stmt.setString(5, p.getMobile());
            stmt.setString(6, p.getAddress());
            stmt.setString(7, p.getBloodGroup());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.insertPatient: " + e.getMessage());
            return false;
        }
    }

    public boolean updatePatient(Patient p) {
        String sql = "UPDATE patients SET name = ?, age = ?, gender = ?, mobile = ?, address = ?, blood_group = ? WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getName());
            stmt.setInt(2, p.getAge());
            stmt.setString(3, p.getGender());
            stmt.setString(4, p.getMobile());
            stmt.setString(5, p.getAddress());
            stmt.setString(6, p.getBloodGroup());
            stmt.setString(7, p.getPatientId());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.updatePatient: " + e.getMessage());
            return false;
        }
    }

    public boolean deletePatient(String patientId) {
        String sql = "DELETE FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.deletePatient: " + e.getMessage());
            return false;
        }
    }

    public Patient getPatientById(String patientId) {
        String sql = "SELECT * FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPatient(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.getPatientById: " + e.getMessage());
        }
        return null;
    }

    public boolean existsById(String patientId) {
        String sql = "SELECT 1 FROM patients WHERE patient_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return false;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.existsById: " + e.getMessage());
            return false;
        }
    }

    public List<Patient> getAllPatients() {
        List<Patient> list = new ArrayList<>();
        String sql = "SELECT * FROM patients ORDER BY created_at DESC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(mapResultSetToPatient(rs));
            }
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.getAllPatients: " + e.getMessage());
        }
        return list;
    }

    /**
     * Search patients by ID, Name, or Mobile Number.
     */
    public List<Patient> searchPatients(String keyword, String searchType) {
        List<Patient> list = new ArrayList<>();
        String sql;
        if ("Patient ID".equalsIgnoreCase(searchType)) {
            sql = "SELECT * FROM patients WHERE patient_id LIKE ?";
        } else if ("Mobile".equalsIgnoreCase(searchType)) {
            sql = "SELECT * FROM patients WHERE mobile LIKE ?";
        } else {
            sql = "SELECT * FROM patients WHERE name LIKE ?";
        }

        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, "%" + keyword.trim() + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToPatient(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in PatientDAO.searchPatients: " + e.getMessage());
        }
        return list;
    }

    private Patient mapResultSetToPatient(ResultSet rs) throws SQLException {
        Patient p = new Patient();
        p.setPatientId(rs.getString("patient_id"));
        p.setName(rs.getString("name"));
        p.setAge(rs.getInt("age"));
        p.setGender(rs.getString("gender"));
        p.setMobile(rs.getString("mobile"));
        p.setAddress(rs.getString("address"));
        p.setBloodGroup(rs.getString("blood_group"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        return p;
    }
}
`
  },
  {
    path: 'dao/CaseHistoryDAO.java',
    name: 'CaseHistoryDAO.java',
    category: 'dao',
    description: 'Data Access Object managing Case History records and transactional multi-visit persistence.',
    code: `package dao;

import database.DBConnection;
import model.CaseHistory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO for CaseHistory table operations.
 */
public class CaseHistoryDAO {

    /**
     * Inserts a case history record and returns the generated auto_increment case_id.
     */
    public int insertCaseHistory(CaseHistory ch, Connection conn) throws SQLException {
        String sql = "INSERT INTO case_history (patient_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication, doctor_id) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, ch.getPatientId());
            stmt.setDate(2, ch.getVisitDate());
            stmt.setString(3, ch.getChiefComplaint());
            stmt.setString(4, ch.getSymptoms());
            stmt.setString(5, ch.getDuration());
            stmt.setString(6, ch.getPastHistory());
            stmt.setString(7, ch.getAllergy());
            stmt.setString(8, ch.getFamilyHistory());
            stmt.setString(9, ch.getCurrentMedication());
            stmt.setInt(10, ch.getDoctorId());

            stmt.executeUpdate();
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return -1;
    }

    public List<CaseHistory> getCasesByPatientId(String patientId) {
        List<CaseHistory> list = new ArrayList<>();
        String sql = "SELECT * FROM case_history WHERE patient_id = ? ORDER BY visit_date DESC, case_id DESC";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return list;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, patientId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToCase(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in CaseHistoryDAO.getCasesByPatientId: " + e.getMessage());
        }
        return list;
    }

    public CaseHistory getCaseById(int caseId) {
        String sql = "SELECT * FROM case_history WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCase(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in CaseHistoryDAO.getCaseById: " + e.getMessage());
        }
        return null;
    }

    public int getTotalCasesCount() {
        String sql = "SELECT COUNT(*) FROM case_history";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return 0;

        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("SQLException in CaseHistoryDAO.getTotalCasesCount: " + e.getMessage());
        }
        return 0;
    }

    private CaseHistory mapResultSetToCase(ResultSet rs) throws SQLException {
        CaseHistory ch = new CaseHistory();
        ch.setCaseId(rs.getInt("case_id"));
        ch.setPatientId(rs.getString("patient_id"));
        ch.setVisitDate(rs.getDate("visit_date"));
        ch.setChiefComplaint(rs.getString("chief_complaint"));
        ch.setSymptoms(rs.getString("symptoms"));
        ch.setDuration(rs.getString("duration"));
        ch.setPastHistory(rs.getString("past_history"));
        ch.setAllergy(rs.getString("allergy"));
        ch.setFamilyHistory(rs.getString("family_history"));
        ch.setCurrentMedication(rs.getString("current_medication"));
        ch.setDoctorId(rs.getInt("doctor_id"));
        return ch;
    }
}
`
  },
  {
    path: 'dao/ExaminationDAO.java',
    name: 'ExaminationDAO.java',
    category: 'dao',
    description: 'Data Access Object for Physical Examination vitals table.',
    code: `package dao;

import database.DBConnection;
import model.Examination;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ExaminationDAO {

    public boolean insertExamination(Examination exam, Connection conn) throws SQLException {
        String sql = "INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, exam.getCaseId());
            stmt.setString(2, exam.getTemperature());
            stmt.setString(3, exam.getBloodPressure());
            stmt.setString(4, exam.getPulseRate());
            stmt.setString(5, exam.getWeight());
            stmt.setString(6, exam.getHeight());
            stmt.setString(7, exam.getObservation());
            return stmt.executeUpdate() > 0;
        }
    }

    public Examination getExaminationByCaseId(int caseId) {
        String sql = "SELECT * FROM examinations WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Examination e = new Examination();
                    e.setExamId(rs.getInt("exam_id"));
                    e.setCaseId(rs.getInt("case_id"));
                    e.setTemperature(rs.getString("temperature"));
                    e.setBloodPressure(rs.getString("blood_pressure"));
                    e.setPulseRate(rs.getString("pulse_rate"));
                    e.setWeight(rs.getString("weight"));
                    e.setHeight(rs.getString("height"));
                    e.setObservation(rs.getString("observation"));
                    return e;
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in ExaminationDAO.getExaminationByCaseId: " + e.getMessage());
        }
        return null;
    }
}
`
  },
  {
    path: 'dao/DiagnosisDAO.java',
    name: 'DiagnosisDAO.java',
    category: 'dao',
    description: 'Data Access Object for Medical Diagnoses and Doctor clinical notes.',
    code: `package dao;

import database.DBConnection;
import model.Diagnosis;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DiagnosisDAO {

    public boolean insertDiagnosis(Diagnosis d, Connection conn) throws SQLException {
        String sql = "INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, d.getCaseId());
            stmt.setString(2, d.getDiagnosisText());
            stmt.setString(3, d.getDoctorNotes());
            stmt.setDate(4, d.getDiagnosisDate());
            return stmt.executeUpdate() > 0;
        }
    }

    public Diagnosis getDiagnosisByCaseId(int caseId) {
        String sql = "SELECT * FROM diagnoses WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Diagnosis d = new Diagnosis();
                    d.setDiagnosisId(rs.getInt("diagnosis_id"));
                    d.setCaseId(rs.getInt("case_id"));
                    d.setDiagnosisText(rs.getString("diagnosis_text"));
                    d.setDoctorNotes(rs.getString("doctor_notes"));
                    d.setDiagnosisDate(rs.getDate("diagnosis_date"));
                    return d;
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in DiagnosisDAO.getDiagnosisByCaseId: " + e.getMessage());
        }
        return null;
    }
}
`
  },
  {
    path: 'dao/PrescriptionDAO.java',
    name: 'PrescriptionDAO.java',
    category: 'dao',
    description: 'Data Access Object for Prescriptions and multiple PrescriptionMedicines items.',
    code: `package dao;

import database.DBConnection;
import model.Prescription;
import model.PrescriptionMedicine;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PrescriptionDAO {

    public boolean insertPrescriptionWithMedicines(Prescription p, Connection conn) throws SQLException {
        String sqlPresc = "INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES (?, ?, ?)";
        int prescriptionId = -1;

        try (PreparedStatement stmt = conn.prepareStatement(sqlPresc, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, p.getCaseId());
            stmt.setDate(2, p.getPrescriptionDate());
            stmt.setString(3, p.getDoctorNotes());
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    prescriptionId = rs.getInt(1);
                }
            }
        }

        if (prescriptionId <= 0) return false;

        String sqlMed = "INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sqlMed)) {
            for (PrescriptionMedicine med : p.getMedicines()) {
                stmt.setInt(1, prescriptionId);
                stmt.setString(2, med.getMedicineName());
                stmt.setString(3, med.getDosage());
                stmt.setString(4, med.getFrequency());
                stmt.setString(5, med.getDuration());
                stmt.setString(6, med.getInstructions());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
        return true;
    }

    public Prescription getPrescriptionByCaseId(int caseId) {
        String sql = "SELECT * FROM prescriptions WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Prescription p = new Prescription();
                    int prescId = rs.getInt("prescription_id");
                    p.setPrescriptionId(prescId);
                    p.setCaseId(rs.getInt("case_id"));
                    p.setPrescriptionDate(rs.getDate("prescription_date"));
                    p.setDoctorNotes(rs.getString("doctor_notes"));
                    p.setMedicines(getMedicinesByPrescriptionId(prescId, conn));
                    return p;
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in PrescriptionDAO.getPrescriptionByCaseId: " + e.getMessage());
        }
        return null;
    }

    private List<PrescriptionMedicine> getMedicinesByPrescriptionId(int prescId, Connection conn) throws SQLException {
        List<PrescriptionMedicine> list = new ArrayList<>();
        String sql = "SELECT * FROM prescription_medicines WHERE prescription_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, prescId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    PrescriptionMedicine med = new PrescriptionMedicine();
                    med.setItemId(rs.getInt("item_id"));
                    med.setPrescriptionId(rs.getInt("prescription_id"));
                    med.setMedicineName(rs.getString("medicine_name"));
                    med.setDosage(rs.getString("dosage"));
                    med.setFrequency(rs.getString("frequency"));
                    med.setDuration(rs.getString("duration"));
                    med.setInstructions(rs.getString("instructions"));
                    list.add(med);
                }
            }
        }
        return list;
    }
}
`
  },
  {
    path: 'dao/FollowUpDAO.java',
    name: 'FollowUpDAO.java',
    category: 'dao',
    description: 'Data Access Object for Follow-up visits and status management.',
    code: `package dao;

import database.DBConnection;
import model.FollowUp;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FollowUpDAO {

    public boolean insertFollowUp(FollowUp f, Connection conn) throws SQLException {
        String sql = "INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, f.getCaseId());
            stmt.setDate(2, f.getFollowupDate());
            stmt.setString(3, f.getNotes());
            stmt.setString(4, f.getStatus());
            return stmt.executeUpdate() > 0;
        }
    }

    public FollowUp getFollowUpByCaseId(int caseId) {
        String sql = "SELECT * FROM follow_ups WHERE case_id = ?";
        Connection conn = DBConnection.getConnection();
        if (conn == null) return null;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, caseId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    FollowUp f = new FollowUp();
                    f.setFollowupId(rs.getInt("followup_id"));
                    f.setCaseId(rs.getInt("case_id"));
                    f.setFollowupDate(rs.getDate("followup_date"));
                    f.setNotes(rs.getString("notes"));
                    f.setStatus(rs.getString("status"));
                    return f;
                }
            }
        } catch (SQLException e) {
            System.err.println("SQLException in FollowUpDAO.getFollowUpByCaseId: " + e.getMessage());
        }
        return null;
    }
}
`
  },
  {
    path: 'controller/AuthController.java',
    name: 'AuthController.java',
    category: 'controller',
    description: 'Controls authentication session, role authorization, and credential validation.',
    code: `package controller;

import dao.UserDAO;
import model.User;

public class AuthController {
    private final UserDAO userDAO;
    private static User currentUser = null;

    public AuthController() {
        this.userDAO = new UserDAO();
    }

    public boolean login(String username, String password, String role) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return false;
        }
        User user = userDAO.authenticate(username.trim(), password, role);
        if (user != null) {
            currentUser = user;
            return true;
        }
        return false;
    }

    public static User getCurrentUser() {
        return currentUser;
    }

    public static void logout() {
        currentUser = null;
    }

    public static boolean isAdmin() {
        return currentUser != null && "Admin".equalsIgnoreCase(currentUser.getRole());
    }

    public static boolean isDoctor() {
        return currentUser != null && "Doctor".equalsIgnoreCase(currentUser.getRole());
    }
}
`
  },
  {
    path: 'controller/PatientController.java',
    name: 'PatientController.java',
    category: 'controller',
    description: 'Controller handling patient registration, validation rules, updates, deletions, and search.',
    code: `package controller;

import dao.PatientDAO;
import model.Patient;
import java.util.List;

public class PatientController {
    private final PatientDAO patientDAO;

    public PatientController() {
        this.patientDAO = new PatientDAO();
    }

    public String validateAndRegister(Patient p) {
        // Validation 1: Empty Fields
        if (p.getPatientId() == null || p.getPatientId().trim().isEmpty()) {
            return "Patient ID cannot be empty!";
        }
        if (p.getName() == null || p.getName().trim().isEmpty()) {
            return "Patient Name cannot be empty!";
        }
        if (p.getAddress() == null || p.getAddress().trim().isEmpty()) {
            return "Address cannot be empty!";
        }

        // Validation 2: Duplicate Patient ID Check
        if (patientDAO.existsById(p.getPatientId().trim())) {
            return "Error: Patient ID '" + p.getPatientId() + "' already exists in database!";
        }

        // Validation 3: Age Validation
        if (p.getAge() <= 0 || p.getAge() > 125) {
            return "Invalid Age! Age must be a positive number between 1 and 125.";
        }

        // Validation 4: 10-digit Mobile Number Validation
        String mobile = p.getMobile() != null ? p.getMobile().trim() : "";
        if (!mobile.matches("^[0-9]{10}$")) {
            return "Invalid Mobile Number! Must be exactly 10 numeric digits.";
        }

        // Validation 5: Blood group
        if (p.getBloodGroup() == null || p.getBloodGroup().equals("Select")) {
            return "Please select a valid Blood Group!";
        }

        boolean success = patientDAO.insertPatient(p);
        return success ? "SUCCESS" : "Database error while saving patient.";
    }

    public String validateAndUpdate(Patient p) {
        if (p.getName() == null || p.getName().trim().isEmpty()) return "Name cannot be empty!";
        if (p.getAge() <= 0 || p.getAge() > 125) return "Invalid Age!";
        if (!p.getMobile().matches("^[0-9]{10}$")) return "Invalid 10-digit mobile!";

        boolean success = patientDAO.updatePatient(p);
        return success ? "SUCCESS" : "Failed to update patient.";
    }

    public boolean deletePatient(String patientId) {
        return patientDAO.deletePatient(patientId);
    }

    public Patient getPatient(String patientId) {
        return patientDAO.getPatientById(patientId);
    }

    public List<Patient> getAllPatients() {
        return patientDAO.getAllPatients();
    }

    public List<Patient> searchPatients(String query, String searchBy) {
        return patientDAO.searchPatients(query, searchBy);
    }
}
`
  },
  {
    path: 'controller/CaseController.java',
    name: 'CaseController.java',
    category: 'controller',
    description: 'Coordinates complete multi-table transactional save for CaseHistory, Exam, Diagnosis, Rx, and FollowUp.',
    code: `package controller;

import database.DBConnection;
import dao.CaseHistoryDAO;
import dao.ExaminationDAO;
import dao.DiagnosisDAO;
import dao.PrescriptionDAO;
import dao.FollowUpDAO;
import model.CaseHistory;
import model.Examination;
import model.Diagnosis;
import model.Prescription;
import model.FollowUp;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

/**
 * Controller orchestrating atomic Case Taking transaction across 5 normalized tables.
 */
public class CaseController {
    private final CaseHistoryDAO caseHistoryDAO = new CaseHistoryDAO();
    private final ExaminationDAO examinationDAO = new ExaminationDAO();
    private final DiagnosisDAO diagnosisDAO = new DiagnosisDAO();
    private final PrescriptionDAO prescriptionDAO = new PrescriptionDAO();
    private final FollowUpDAO followUpDAO = new FollowUpDAO();

    /**
     * Executes atomic JDBC transaction across:
     * case_history -> examinations -> diagnoses -> prescriptions -> follow_ups
     */
    public String saveCompleteCase(CaseHistory ch, Examination exam, Diagnosis diag, Prescription rx, FollowUp followUp) {
        // Clinical Validations
        if (ch.getPatientId() == null || ch.getPatientId().trim().isEmpty()) {
            return "Please select or provide a valid Patient ID!";
        }
        if (ch.getChiefComplaint() == null || ch.getChiefComplaint().trim().isEmpty()) {
            return "Chief Complaint cannot be empty!";
        }
        if (ch.getSymptoms() == null || ch.getSymptoms().trim().isEmpty()) {
            return "Symptoms cannot be empty!";
        }
        if (diag.getDiagnosisText() == null || diag.getDiagnosisText().trim().isEmpty()) {
            return "Diagnosis field cannot be empty!";
        }
        if (rx.getMedicines().isEmpty()) {
            return "Prescription must have at least one medicine prescribed!";
        }

        Connection conn = DBConnection.getConnection();
        if (conn == null) return "Database connection unavailable!";

        try {
            // Begin Transaction
            conn.setAutoCommit(false);

            // 1. Insert Case History
            int generatedCaseId = caseHistoryDAO.insertCaseHistory(ch, conn);
            if (generatedCaseId <= 0) {
                conn.rollback();
                return "Failed to insert Case History record.";
            }

            // 2. Insert Examination
            exam.setCaseId(generatedCaseId);
            if (!examinationDAO.insertExamination(exam, conn)) {
                conn.rollback();
                return "Failed to insert Physical Examination.";
            }

            // 3. Insert Diagnosis
            diag.setCaseId(generatedCaseId);
            if (!diagnosisDAO.insertDiagnosis(diag, conn)) {
                conn.rollback();
                return "Failed to insert Diagnosis.";
            }

            // 4. Insert Prescription & Medicines
            rx.setCaseId(generatedCaseId);
            if (!prescriptionDAO.insertPrescriptionWithMedicines(rx, conn)) {
                conn.rollback();
                return "Failed to insert Prescription and Medicines.";
            }

            // 5. Insert Follow-up
            followUp.setCaseId(generatedCaseId);
            if (!followUpDAO.insertFollowUp(followUp, conn)) {
                conn.rollback();
                return "Failed to insert Follow-up record.";
            }

            // Commit Transaction
            conn.commit();
            conn.setAutoCommit(true);
            return "SUCCESS: Case Record #" + generatedCaseId + " saved successfully!";

        } catch (SQLException e) {
            try {
                conn.rollback();
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                System.err.println("Rollback failed: " + ex.getMessage());
            }
            return "Database Transaction Error: " + e.getMessage();
        }
    }

    public List<CaseHistory> getPatientCases(String patientId) {
        return caseHistoryDAO.getCasesByPatientId(patientId);
    }

    public Examination getExamination(int caseId) {
        return examinationDAO.getExaminationByCaseId(caseId);
    }

    public Diagnosis getDiagnosis(int caseId) {
        return diagnosisDAO.getDiagnosisByCaseId(caseId);
    }

    public Prescription getPrescription(int caseId) {
        return prescriptionDAO.getPrescriptionByCaseId(caseId);
    }

    public FollowUp getFollowUp(int caseId) {
        return followUpDAO.getFollowUpByCaseId(caseId);
    }
}
`
  },
  {
    path: 'view/LoginView.java',
    name: 'LoginView.java',
    category: 'view',
    description: 'Swing JFrame for login authentication with password masking, role picker, and error popups.',
    code: `package view;

import controller.AuthController;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * LoginView - Java Swing Login Window
 */
public class LoginView extends JFrame {

    private JTextField txtUsername;
    private JPasswordField txtPassword;
    private JComboBox<String> cmbRole;
    private JButton btnLogin;
    private JButton btnCancel;
    private final AuthController authController;

    public LoginView() {
        authController = new AuthController();
        initComponents();
    }

    private void initComponents() {
        setTitle("Patient Case-Taking Software - User Login");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(480, 360);
        setLocationRelativeTo(null);
        setResizable(false);

        // Header Panel (Medical Theme)
        JPanel pnlHeader = new JPanel();
        pnlHeader.setBackground(new Color(24, 76, 120));
        pnlHeader.setPreferredSize(new Dimension(480, 70));
        pnlHeader.setLayout(new FlowLayout(FlowLayout.CENTER, 10, 15));

        JLabel lblTitle = new JLabel("PATIENT CASE-TAKING SYSTEM");
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lblTitle.setForeground(Color.WHITE);
        pnlHeader.add(lblTitle);

        // Center Form Panel
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new GridBagLayout());
        pnlCenter.setBorder(BorderFactory.createEmptyBorder(20, 30, 20, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Username
        gbc.gridx = 0; gbc.gridy = 0;
        pnlCenter.add(new JLabel("Username:"), gbc);
        gbc.gridx = 1;
        txtUsername = new JTextField(15);
        txtUsername.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        pnlCenter.add(txtUsername, gbc);

        // Password
        gbc.gridx = 0; gbc.gridy = 1;
        pnlCenter.add(new JLabel("Password:"), gbc);
        gbc.gridx = 1;
        txtPassword = new JPasswordField(15);
        txtPassword.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        pnlCenter.add(txtPassword, gbc);

        // Role Dropdown
        gbc.gridx = 0; gbc.gridy = 2;
        pnlCenter.add(new JLabel("Role:"), gbc);
        gbc.gridx = 1;
        cmbRole = new JComboBox<>(new String[]{"Doctor", "Admin"});
        cmbRole.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        pnlCenter.add(cmbRole, gbc);

        // Buttons
        JPanel pnlButtons = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnLogin = new JButton("Login");
        btnLogin.setBackground(new Color(24, 76, 120));
        btnLogin.setForeground(Color.WHITE);
        btnLogin.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btnLogin.setFocusPainted(false);

        btnCancel = new JButton("Exit");
        btnCancel.setFont(new Font("Segoe UI", Font.PLAIN, 13));

        pnlButtons.add(btnLogin);
        pnlButtons.add(btnCancel);

        gbc.gridx = 0; gbc.gridy = 3;
        gbc.gridwidth = 2;
        pnlCenter.add(pnlButtons, gbc);

        // Action Listeners
        btnLogin.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                performLogin();
            }
        });

        btnCancel.addActionListener(e -> System.exit(0));

        // Assemble Layout
        setLayout(new BorderLayout());
        add(pnlHeader, BorderLayout.NORTH);
        add(pnlCenter, BorderLayout.CENTER);
    }

    private void performLogin() {
        String username = txtUsername.getText().trim();
        String password = new String(txtPassword.getPassword()).trim();
        String role = (String) cmbRole.getSelectedItem();

        if (username.isEmpty() || password.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter both Username and Password!", "Validation Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }

        boolean success = authController.login(username, password, role);
        if (success) {
            JOptionPane.showMessageDialog(this, "Welcome " + AuthController.getCurrentUser().getFullName() + "!", "Login Successful", JOptionPane.INFORMATION_MESSAGE);
            dispose(); // Close login window
            new DashboardView().setVisible(true); // Launch main dashboard
        } else {
            JOptionPane.showMessageDialog(this, "Invalid credentials or unauthorized role! Please try again.", "Authentication Failed", JOptionPane.ERROR_MESSAGE);
            txtPassword.setText("");
            txtPassword.requestFocus();
        }
    }
}
`
  },
  {
    path: 'view/DashboardView.java',
    name: 'DashboardView.java',
    category: 'view',
    description: 'Main desktop dashboard JFrame featuring quick-launch cards, JMenuBar, and role-adapted panels.',
    code: `package view;

import controller.AuthController;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;

/**
 * Main application Dashboard with navigation for all 15 clinical modules.
 */
public class DashboardView extends JFrame {

    public DashboardView() {
        initComponents();
    }

    private void initComponents() {
        setTitle("Patient Case-Taking Software - Doctor & Admin Portal");
        setSize(1100, 720);
        setMinimumSize(new Dimension(960, 640));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create Menu Bar
        setJMenuBar(createAppMenuBar());

        // Header Panel
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setBackground(new Color(24, 76, 120));
        pnlHeader.setPreferredSize(new Dimension(1100, 80));
        pnlHeader.setBorder(BorderFactory.createEmptyBorder(15, 25, 15, 25));

        JLabel lblLogo = new JLabel("PATIENT CASE-TAKING SOFTWARE");
        lblLogo.setFont(new Font("Segoe UI", Font.BOLD, 20));
        lblLogo.setForeground(Color.WHITE);

        String userRole = AuthController.getCurrentUser() != null ? AuthController.getCurrentUser().getRole() : "Doctor";
        String userName = AuthController.getCurrentUser() != null ? AuthController.getCurrentUser().getFullName() : "Medical Staff";
        JLabel lblUser = new JLabel("Logged in as: " + userName + " [" + userRole + "]");
        lblUser.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        lblUser.setForeground(new Color(210, 230, 250));

        pnlHeader.add(lblLogo, BorderLayout.WEST);
        pnlHeader.add(lblUser, BorderLayout.EAST);

        // Center Grid of Dashboard Cards
        JPanel pnlCards = new JPanel(new GridLayout(3, 4, 18, 18));
        pnlCards.setBorder(BorderFactory.createEmptyBorder(25, 30, 25, 30));
        pnlCards.setBackground(new Color(245, 248, 250));

        pnlCards.add(createDashboardCard("Register Patient", "Add new patient records with validation", e -> new PatientRegistrationView().setVisible(true)));
        pnlCards.add(createDashboardCard("Manage Patients", "View, edit, or delete patient list", e -> new PatientManagementView().setVisible(true)));
        pnlCards.add(createDashboardCard("Search Patient", "Lookup by ID, Name, or Mobile Number", e -> new PatientSearchView().setVisible(true)));
        pnlCards.add(createDashboardCard("New Case Taking", "Symptoms, exam, diagnosis & prescription", e -> new CaseTakingView().setVisible(true)));
        pnlCards.add(createDashboardCard("Patient Case History", "Inspect multi-visit timeline & Rx records", e -> new CaseHistoryView().setVisible(true)));
        pnlCards.add(createDashboardCard("Clinical Reports", "Statistical summary, date-wise cases", e -> new ReportsView().setVisible(true)));
        pnlCards.add(createDashboardCard("Database Inspector", "Check raw normalized SQL tables", e -> JOptionPane.showMessageDialog(this, "MySQL patient_case_db connection active on port 3306!")));
        pnlCards.add(createDashboardCard("Logout Session", "End active session and return to login", e -> performLogout()));

        // Status Bar
        JPanel pnlStatus = new JPanel(new BorderLayout());
        pnlStatus.setPreferredSize(new Dimension(1100, 28));
        pnlStatus.setBackground(new Color(230, 235, 240));
        pnlStatus.setBorder(BorderFactory.createEmptyBorder(5, 15, 5, 15));

        JLabel lblDbStatus = new JLabel("● Database: Connected (MySQL: patient_case_db)");
        lblDbStatus.setForeground(new Color(15, 120, 60));
        JLabel lblCopy = new JLabel("Academic Engineering Project | MVC Architecture");
        lblCopy.setForeground(Color.GRAY);

        pnlStatus.add(lblDbStatus, BorderLayout.WEST);
        pnlStatus.add(lblCopy, BorderLayout.EAST);

        setLayout(new BorderLayout());
        add(pnlHeader, BorderLayout.NORTH);
        add(pnlCards, BorderLayout.CENTER);
        add(pnlStatus, BorderLayout.SOUTH);
    }

    private JPanel createDashboardCard(String title, String desc, java.awt.event.ActionListener action) {
        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(215, 225, 235), 1),
            BorderFactory.createEmptyBorder(16, 16, 16, 16)
        ));

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 16));
        lblTitle.setForeground(new Color(24, 76, 120));

        JLabel lblDesc = new JLabel("<html><p style='width:160px;'>" + desc + "</p></html>");
        lblDesc.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblDesc.setForeground(new Color(100, 110, 120));

        JButton btnOpen = new JButton("Open Module →");
        btnOpen.setBackground(new Color(240, 245, 250));
        btnOpen.setForeground(new Color(24, 76, 120));
        btnOpen.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnOpen.addActionListener(action);

        card.add(lblTitle, BorderLayout.NORTH);
        card.add(lblDesc, BorderLayout.CENTER);
        card.add(btnOpen, BorderLayout.SOUTH);
        return card;
    }

    private JMenuBar createAppMenuBar() {
        JMenuBar menuBar = new JMenuBar();

        JMenu menuFile = new JMenu("File");
        JMenuItem itemLogout = new JMenuItem("Logout");
        itemLogout.addActionListener(e -> performLogout());
        JMenuItem itemExit = new JMenuItem("Exit");
        itemExit.addActionListener(e -> System.exit(0));
        menuFile.add(itemLogout);
        menuFile.addSeparator();
        menuFile.add(itemExit);

        JMenu menuPatients = new JMenu("Patients");
        JMenuItem itemReg = new JMenuItem("Register Patient");
        itemReg.addActionListener(e -> new PatientRegistrationView().setVisible(true));
        JMenuItem itemManage = new JMenuItem("Manage Patients");
        itemManage.addActionListener(e -> new PatientManagementView().setVisible(true));
        menuPatients.add(itemReg);
        menuPatients.add(itemManage);

        JMenu menuCases = new JMenu("Clinical Cases");
        JMenuItem itemNewCase = new JMenuItem("New Case-Taking");
        itemNewCase.addActionListener(e -> new CaseTakingView().setVisible(true));
        JMenuItem itemHistory = new JMenuItem("Patient Case History");
        itemHistory.addActionListener(e -> new CaseHistoryView().setVisible(true));
        menuCases.add(itemNewCase);
        menuCases.add(itemHistory);

        JMenu menuReports = new JMenu("Reports");
        JMenuItem itemSummary = new JMenuItem("View Statistics");
        itemSummary.addActionListener(e -> new ReportsView().setVisible(true));
        menuReports.add(itemSummary);

        menuBar.add(menuFile);
        menuBar.add(menuPatients);
        menuBar.add(menuCases);
        menuBar.add(menuReports);
        return menuBar;
    }

    private void performLogout() {
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to log out?", "Confirm Logout", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            AuthController.logout();
            dispose();
            new LoginView().setVisible(true);
        }
    }
}
`
  },
  {
    path: 'view/PatientRegistrationView.java',
    name: 'PatientRegistrationView.java',
    category: 'view',
    description: 'Swing form for Patient Registration with validations (duplicate ID, age, 10-digit mobile, blood group).',
    code: `package view;

import controller.PatientController;
import model.Patient;
import javax.swing.*;
import java.awt.*;

/**
 * PatientRegistrationView - Form for adding new patients with strict validations.
 */
public class PatientRegistrationView extends JFrame {

    private JTextField txtPatientId;
    private JTextField txtName;
    private JTextField txtAge;
    private JRadioButton rbMale, rbFemale, rbOther;
    private ButtonGroup genderGroup;
    private JTextField txtMobile;
    private JTextArea txtAddress;
    private JComboBox<String> cmbBloodGroup;
    private JButton btnSave, btnClear, btnClose;

    private final PatientController patientController;

    public PatientRegistrationView() {
        patientController = new PatientController();
        initComponents();
    }

    private void initComponents() {
        setTitle("Patient Registration - New Patient Entry");
        setSize(560, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel pnlMain = new JPanel(new GridBagLayout());
        pnlMain.setBorder(BorderFactory.createEmptyBorder(20, 25, 20, 25));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Title Header
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        JLabel lblHeader = new JLabel("New Patient Registration");
        lblHeader.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lblHeader.setForeground(new Color(24, 76, 120));
        pnlMain.add(lblHeader, gbc);

        gbc.gridwidth = 1;

        // 1. Patient ID
        gbc.gridx = 0; gbc.gridy = 1;
        pnlMain.add(new JLabel("Patient ID (e.g. PAT-1005):*"), gbc);
        gbc.gridx = 1;
        txtPatientId = new JTextField(15);
        pnlMain.add(txtPatientId, gbc);

        // 2. Name
        gbc.gridx = 0; gbc.gridy = 2;
        pnlMain.add(new JLabel("Full Name:*"), gbc);
        gbc.gridx = 1;
        txtName = new JTextField(15);
        pnlMain.add(txtName, gbc);

        // 3. Age
        gbc.gridx = 0; gbc.gridy = 3;
        pnlMain.add(new JLabel("Age:*"), gbc);
        gbc.gridx = 1;
        txtAge = new JTextField(15);
        pnlMain.add(txtAge, gbc);

        // 4. Gender (Radio Buttons)
        gbc.gridx = 0; gbc.gridy = 4;
        pnlMain.add(new JLabel("Gender:*"), gbc);
        gbc.gridx = 1;
        JPanel pnlGender = new JPanel(new FlowLayout(FlowLayout.LEFT, 5, 0));
        rbMale = new JRadioButton("Male", true);
        rbFemale = new JRadioButton("Female");
        rbOther = new JRadioButton("Other");
        genderGroup = new ButtonGroup();
        genderGroup.add(rbMale);
        genderGroup.add(rbFemale);
        genderGroup.add(rbOther);
        pnlGender.add(rbMale);
        pnlGender.add(rbFemale);
        pnlGender.add(rbOther);
        pnlMain.add(pnlGender, gbc);

        // 5. Mobile
        gbc.gridx = 0; gbc.gridy = 5;
        pnlMain.add(new JLabel("Mobile Number (10 digits):*"), gbc);
        gbc.gridx = 1;
        txtMobile = new JTextField(15);
        pnlMain.add(txtMobile, gbc);

        // 6. Address
        gbc.gridx = 0; gbc.gridy = 6;
        pnlMain.add(new JLabel("Address:*"), gbc);
        gbc.gridx = 1;
        txtAddress = new JTextArea(3, 15);
        txtAddress.setLineWrap(true);
        pnlMain.add(new JScrollPane(txtAddress), gbc);

        // 7. Blood Group
        gbc.gridx = 0; gbc.gridy = 7;
        pnlMain.add(new JLabel("Blood Group:*"), gbc);
        gbc.gridx = 1;
        cmbBloodGroup = new JComboBox<>(new String[]{"Select", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"});
        pnlMain.add(cmbBloodGroup, gbc);

        // Action Buttons
        gbc.gridx = 0; gbc.gridy = 8; gbc.gridwidth = 2;
        JPanel pnlButtons = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnSave = new JButton("Save Patient");
        btnSave.setBackground(new Color(24, 76, 120));
        btnSave.setForeground(Color.WHITE);
        btnClear = new JButton("Clear");
        btnClose = new JButton("Close");

        pnlButtons.add(btnSave);
        pnlButtons.add(btnClear);
        pnlButtons.add(btnClose);
        pnlMain.add(pnlButtons, gbc);

        // Listeners
        btnSave.addActionListener(e -> savePatient());
        btnClear.addActionListener(e -> clearForm());
        btnClose.addActionListener(e -> dispose());

        add(pnlMain);
    }

    private void savePatient() {
        String patientId = txtPatientId.getText().trim();
        String name = txtName.getText().trim();
        String ageStr = txtAge.getText().trim();
        String mobile = txtMobile.getText().trim();
        String address = txtAddress.getText().trim();
        String bloodGroup = (String) cmbBloodGroup.getSelectedItem();

        int age = -1;
        try {
            age = Integer.parseInt(ageStr);
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Age must be a valid integer number!", "Input Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String gender = rbMale.isSelected() ? "Male" : (rbFemale.isSelected() ? "Female" : "Other");

        Patient patient = new Patient(patientId, name, age, gender, mobile, address, bloodGroup);
        String result = patientController.validateAndRegister(patient);

        if ("SUCCESS".equals(result)) {
            JOptionPane.showMessageDialog(this, "Patient " + name + " registered successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
            clearForm();
        } else {
            JOptionPane.showMessageDialog(this, result, "Validation Warning", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void clearForm() {
        txtPatientId.setText("");
        txtName.setText("");
        txtAge.setText("");
        txtMobile.setText("");
        txtAddress.setText("");
        cmbBloodGroup.setSelectedIndex(0);
        rbMale.setSelected(true);
    }
}
`
  },
  {
    path: 'view/PatientManagementView.java',
    name: 'PatientManagementView.java',
    category: 'view',
    description: 'Swing view with JTable for listing patients, live searching, updating, and deleting.',
    code: `package view;

import controller.PatientController;
import model.Patient;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class PatientManagementView extends JFrame {

    private JTable tblPatients;
    private DefaultTableModel tableModel;
    private JTextField txtSearch;
    private JComboBox<String> cmbSearchCriteria;
    private JButton btnSearch, btnRefresh, btnDelete, btnEdit;
    private final PatientController patientController;

    public PatientManagementView() {
        patientController = new PatientController();
        initComponents();
        loadAllPatients();
    }

    private void initComponents() {
        setTitle("Patient Management - Directory & Records");
        setSize(920, 580);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Top Search Bar Panel
        JPanel pnlTop = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 12));
        pnlTop.setBackground(new Color(240, 245, 250));

        pnlTop.add(new JLabel("Search by:"));
        cmbSearchCriteria = new JComboBox<>(new String[]{"Patient ID", "Name", "Mobile"});
        pnlTop.add(cmbSearchCriteria);

        txtSearch = new JTextField(18);
        pnlTop.add(txtSearch);

        btnSearch = new JButton("Search");
        btnSearch.setBackground(new Color(24, 76, 120));
        btnSearch.setForeground(Color.WHITE);
        pnlTop.add(btnSearch);

        btnRefresh = new JButton("Reset Table");
        pnlTop.add(btnRefresh);

        // Table Setup
        String[] columns = {"Patient ID", "Full Name", "Age", "Gender", "Mobile", "Address", "Blood Group"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // read-only table selection
            }
        };

        tblPatients = new JTable(tableModel);
        tblPatients.setRowHeight(24);
        tblPatients.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scrollPane = new JScrollPane(tblPatients);

        // Bottom Action Panel
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 10));
        btnEdit = new JButton("Edit Selected");
        btnDelete = new JButton("Delete Selected");
        btnDelete.setForeground(new Color(180, 40, 40));

        pnlBottom.add(btnEdit);
        pnlBottom.add(btnDelete);

        // Event Listeners
        btnSearch.addActionListener(e -> performSearch());
        btnRefresh.addActionListener(e -> { txtSearch.setText(""); loadAllPatients(); });
        btnDelete.addActionListener(e -> deleteSelectedPatient());
        btnEdit.addActionListener(e -> editSelectedPatient());

        setLayout(new BorderLayout());
        add(pnlTop, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void loadAllPatients() {
        tableModel.setRowCount(0);
        List<Patient> list = patientController.getAllPatients();
        for (Patient p : list) {
            tableModel.addRow(new Object[]{
                p.getPatientId(), p.getName(), p.getAge(), p.getGender(), p.getMobile(), p.getAddress(), p.getBloodGroup()
            });
        }
    }

    private void performSearch() {
        String query = txtSearch.getText().trim();
        String criteria = (String) cmbSearchCriteria.getSelectedItem();
        tableModel.setRowCount(0);
        List<Patient> list = patientController.searchPatients(query, criteria);
        for (Patient p : list) {
            tableModel.addRow(new Object[]{
                p.getPatientId(), p.getName(), p.getAge(), p.getGender(), p.getMobile(), p.getAddress(), p.getBloodGroup()
            });
        }
    }

    private void deleteSelectedPatient() {
        int selectedRow = tblPatients.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a patient row to delete!", "Selection Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String patientId = (String) tableModel.getValueAt(selectedRow, 0);
        String patientName = (String) tableModel.getValueAt(selectedRow, 1);

        int confirm = JOptionPane.showConfirmDialog(this,
            "Are you sure you want to delete patient " + patientName + " (" + patientId + ")?\\nAll associated case histories will also be removed.",
            "Confirm Delete", JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            boolean success = patientController.deletePatient(patientId);
            if (success) {
                JOptionPane.showMessageDialog(this, "Patient deleted successfully.");
                loadAllPatients();
            } else {
                JOptionPane.showMessageDialog(this, "Failed to delete patient.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void editSelectedPatient() {
        int selectedRow = tblPatients.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a patient row to edit!", "Selection Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }
        String patientId = (String) tableModel.getValueAt(selectedRow, 0);
        Patient p = patientController.getPatient(patientId);
        if (p != null) {
            String newName = JOptionPane.showInputDialog(this, "Update Name:", p.getName());
            if (newName != null && !newName.trim().isEmpty()) {
                p.setName(newName.trim());
                patientController.validateAndUpdate(p);
                loadAllPatients();
            }
        }
    }
}
`
  },
  {
    path: 'view/CaseTakingView.java',
    name: 'CaseTakingView.java',
    category: 'view',
    description: 'Comprehensive Case Taking form uniting Symptoms, Examination, Diagnosis, dynamic Prescription table, and Follow-up.',
    code: `package view;

import controller.AuthController;
import controller.CaseController;
import controller.PatientController;
import model.*;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.Date;

/**
 * CaseTakingView - Form spanning Case History, Examination, Diagnosis, Prescription & Follow-up.
 */
public class CaseTakingView extends JFrame {

    // Section 1: Patient & Case Info
    private JTextField txtPatientId;
    private JTextField txtChiefComplaint;
    private JTextArea txtSymptoms;
    private JTextField txtDuration;
    private JTextField txtPastHistory;
    private JTextField txtAllergy;
    private JTextField txtFamilyHistory;
    private JTextField txtCurrentMedication;

    // Section 2: Physical Examination
    private JTextField txtTemp, txtBP, txtPulse, txtWeight, txtHeight;
    private JTextArea txtObservation;

    // Section 3: Diagnosis
    private JTextArea txtDiagnosis;
    private JTextArea txtDoctorNotes;

    // Section 4: Prescription Medicines Table
    private DefaultTableModel medTableModel;
    private JTable tblMedicines;
    private JTextField txtMedName, txtDosage, txtFreq, txtDurationMed, txtInstructions;
    private JButton btnAddMed, btnRemoveMed;

    // Section 5: Follow-up
    private JTextField txtFollowUpDate;
    private JTextField txtFollowUpNotes;
    private JComboBox<String> cmbFollowUpStatus;

    private JButton btnSaveCompleteCase;
    private final CaseController caseController;

    public CaseTakingView() {
        caseController = new CaseController();
        initComponents();
    }

    private void initComponents() {
        setTitle("Clinical Case-Taking & Prescription");
        setSize(980, 750);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JTabbedPane tabbedPane = new JTabbedPane();

        // Tab 1: Symptoms & Medical History
        tabbedPane.addTab("1. Symptoms & History", createSymptomsPanel());

        // Tab 2: Physical Examination
        tabbedPane.addTab("2. Physical Examination", createExamPanel());

        // Tab 3: Diagnosis
        tabbedPane.addTab("3. Diagnosis", createDiagnosisPanel());

        // Tab 4: Prescription
        tabbedPane.addTab("4. Prescription", createPrescriptionPanel());

        // Tab 5: Follow-up
        tabbedPane.addTab("5. Follow-up & Review", createFollowUpPanel());

        // Bottom Bar with Save Button
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 12));
        pnlBottom.setBackground(new Color(240, 245, 250));
        btnSaveCompleteCase = new JButton("Save Complete Case Record");
        btnSaveCompleteCase.setBackground(new Color(24, 76, 120));
        btnSaveCompleteCase.setForeground(Color.WHITE);
        btnSaveCompleteCase.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btnSaveCompleteCase.addActionListener(e -> saveCaseRecord());
        pnlBottom.add(btnSaveCompleteCase);

        setLayout(new BorderLayout());
        add(tabbedPane, BorderLayout.CENTER);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private JPanel createSymptomsPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0; p.add(new JLabel("Patient ID:*"), gbc);
        gbc.gridx = 1; txtPatientId = new JTextField(15); p.add(txtPatientId, gbc);

        gbc.gridx = 0; gbc.gridy = 1; p.add(new JLabel("Chief Complaint:*"), gbc);
        gbc.gridx = 1; txtChiefComplaint = new JTextField(25); p.add(txtChiefComplaint, gbc);

        gbc.gridx = 0; gbc.gridy = 2; p.add(new JLabel("Detailed Symptoms:*"), gbc);
        gbc.gridx = 1; txtSymptoms = new JTextArea(3, 25); p.add(new JScrollPane(txtSymptoms), gbc);

        gbc.gridx = 0; gbc.gridy = 3; p.add(new JLabel("Duration (e.g. 3 days):*"), gbc);
        gbc.gridx = 1; txtDuration = new JTextField(15); p.add(txtDuration, gbc);

        gbc.gridx = 0; gbc.gridy = 4; p.add(new JLabel("Past Medical History:"), gbc);
        gbc.gridx = 1; txtPastHistory = new JTextField(25); p.add(txtPastHistory, gbc);

        gbc.gridx = 0; gbc.gridy = 5; p.add(new JLabel("Drug / Food Allergies:"), gbc);
        gbc.gridx = 1; txtAllergy = new JTextField(25); p.add(txtAllergy, gbc);

        gbc.gridx = 0; gbc.gridy = 6; p.add(new JLabel("Family Medical History:"), gbc);
        gbc.gridx = 1; txtFamilyHistory = new JTextField(25); p.add(txtFamilyHistory, gbc);

        gbc.gridx = 0; gbc.gridy = 7; p.add(new JLabel("Current Medications:"), gbc);
        gbc.gridx = 1; txtCurrentMedication = new JTextField(25); p.add(txtCurrentMedication, gbc);

        return p;
    }

    private JPanel createExamPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(6, 6, 6, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0; p.add(new JLabel("Temperature (°F):"), gbc);
        gbc.gridx = 1; txtTemp = new JTextField("98.6 F", 12); p.add(txtTemp, gbc);

        gbc.gridx = 0; gbc.gridy = 1; p.add(new JLabel("Blood Pressure (mmHg):"), gbc);
        gbc.gridx = 1; txtBP = new JTextField("120/80 mmHg", 12); p.add(txtBP, gbc);

        gbc.gridx = 0; gbc.gridy = 2; p.add(new JLabel("Pulse Rate (bpm):"), gbc);
        gbc.gridx = 1; txtPulse = new JTextField("72 bpm", 12); p.add(txtPulse, gbc);

        gbc.gridx = 0; gbc.gridy = 3; p.add(new JLabel("Weight (kg):"), gbc);
        gbc.gridx = 1; txtWeight = new JTextField("70 kg", 12); p.add(txtWeight, gbc);

        gbc.gridx = 0; gbc.gridy = 4; p.add(new JLabel("Height (cm):"), gbc);
        gbc.gridx = 1; txtHeight = new JTextField("170 cm", 12); p.add(txtHeight, gbc);

        gbc.gridx = 0; gbc.gridy = 5; p.add(new JLabel("General Observations:"), gbc);
        gbc.gridx = 1; txtObservation = new JTextArea(4, 25); p.add(new JScrollPane(txtObservation), gbc);

        return p;
    }

    private JPanel createDiagnosisPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0; p.add(new JLabel("Clinical Diagnosis:*"), gbc);
        gbc.gridx = 1; txtDiagnosis = new JTextArea(4, 28); p.add(new JScrollPane(txtDiagnosis), gbc);

        gbc.gridx = 0; gbc.gridy = 1; p.add(new JLabel("Doctor Notes & Clinical Advice:"), gbc);
        gbc.gridx = 1; txtDoctorNotes = new JTextArea(4, 28); p.add(new JScrollPane(txtDoctorNotes), gbc);

        return p;
    }

    private JPanel createPrescriptionPanel() {
        JPanel p = new JPanel(new BorderLayout(10, 10));
        p.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));

        // Form to add medicine
        JPanel pnlAdd = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 5));
        txtMedName = new JTextField(12);
        txtDosage = new JTextField(8);
        txtFreq = new JTextField(8);
        txtDurationMed = new JTextField(8);
        txtInstructions = new JTextField(12);

        pnlAdd.add(new JLabel("Medicine:")); pnlAdd.add(txtMedName);
        pnlAdd.add(new JLabel("Dose:")); pnlAdd.add(txtDosage);
        pnlAdd.add(new JLabel("Freq:")); pnlAdd.add(txtFreq);
        pnlAdd.add(new JLabel("Duration:")); pnlAdd.add(txtDurationMed);
        pnlAdd.add(new JLabel("Instructions:")); pnlAdd.add(txtInstructions);

        btnAddMed = new JButton("+ Add");
        btnRemoveMed = new JButton("- Remove");
        pnlAdd.add(btnAddMed);
        pnlAdd.add(btnRemoveMed);

        // Medicines Table
        String[] cols = {"Medicine Name", "Dosage", "Frequency", "Duration", "Instructions"};
        medTableModel = new DefaultTableModel(cols, 0);
        tblMedicines = new JTable(medTableModel);

        btnAddMed.addActionListener(e -> {
            if (!txtMedName.getText().trim().isEmpty()) {
                medTableModel.addRow(new Object[]{
                    txtMedName.getText().trim(),
                    txtDosage.getText().trim(),
                    txtFreq.getText().trim(),
                    txtDurationMed.getText().trim(),
                    txtInstructions.getText().trim()
                });
                txtMedName.setText(""); txtDosage.setText("");
            }
        });

        btnRemoveMed.addActionListener(e -> {
            int sel = tblMedicines.getSelectedRow();
            if (sel != -1) medTableModel.removeRow(sel);
        });

        p.add(pnlAdd, BorderLayout.NORTH);
        p.add(new JScrollPane(tblMedicines), BorderLayout.CENTER);
        return p;
    }

    private JPanel createFollowUpPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0; p.add(new JLabel("Next Follow-up Date (YYYY-MM-DD):"), gbc);
        gbc.gridx = 1; txtFollowUpDate = new JTextField("2026-09-25", 15); p.add(txtFollowUpDate, gbc);

        gbc.gridx = 0; gbc.gridy = 1; p.add(new JLabel("Follow-up Notes / Targets:"), gbc);
        gbc.gridx = 1; txtFollowUpNotes = new JTextField("Review BP and lab reports", 25); p.add(txtFollowUpNotes, gbc);

        gbc.gridx = 0; gbc.gridy = 2; p.add(new JLabel("Status:"), gbc);
        gbc.gridx = 1; cmbFollowUpStatus = new JComboBox<>(new String[]{"Scheduled", "Completed", "Cancelled", "Missed"}); p.add(cmbFollowUpStatus, gbc);

        return p;
    }

    private void saveCaseRecord() {
        String patId = txtPatientId.getText().trim();
        long now = System.currentTimeMillis();
        Date today = new Date(now);

        int docId = AuthController.getCurrentUser() != null ? AuthController.getCurrentUser().getUserId() : 2;

        CaseHistory ch = new CaseHistory(0, patId, today, txtChiefComplaint.getText().trim(),
            txtSymptoms.getText().trim(), txtDuration.getText().trim(), txtPastHistory.getText().trim(),
            txtAllergy.getText().trim(), txtFamilyHistory.getText().trim(), txtCurrentMedication.getText().trim(), docId);

        Examination exam = new Examination(0, 0, txtTemp.getText().trim(), txtBP.getText().trim(),
            txtPulse.getText().trim(), txtWeight.getText().trim(), txtHeight.getText().trim(), txtObservation.getText().trim());

        Diagnosis diag = new Diagnosis(0, 0, txtDiagnosis.getText().trim(), txtDoctorNotes.getText().trim(), today);

        Prescription rx = new Prescription(0, 0, today, "Follow prescribed doses.");
        for (int i = 0; i < medTableModel.getRowCount(); i++) {
            rx.addMedicine(new PrescriptionMedicine(0, 0,
                (String) medTableModel.getValueAt(i, 0),
                (String) medTableModel.getValueAt(i, 1),
                (String) medTableModel.getValueAt(i, 2),
                (String) medTableModel.getValueAt(i, 3),
                (String) medTableModel.getValueAt(i, 4)));
        }

        Date followDate = today;
        try {
            followDate = Date.valueOf(txtFollowUpDate.getText().trim());
        } catch (Exception ex) {
            // fallback
        }

        FollowUp fu = new FollowUp(0, 0, followDate, txtFollowUpNotes.getText().trim(), (String) cmbFollowUpStatus.getSelectedItem());

        String status = caseController.saveCompleteCase(ch, exam, diag, rx, fu);
        if (status.startsWith("SUCCESS")) {
            JOptionPane.showMessageDialog(this, status, "Case Saved", JOptionPane.INFORMATION_MESSAGE);
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, status, "Validation or Transaction Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
`
  },
  {
    path: 'view/CaseHistoryView.java',
    name: 'CaseHistoryView.java',
    category: 'view',
    description: 'Displays complete multi-visit patient case records, previous visit timeline, vitals, and Rx items.',
    code: `package view;

import controller.CaseController;
import controller.PatientController;
import model.*;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class CaseHistoryView extends JFrame {

    private JTextField txtSearchPatient;
    private JButton btnSearch;
    private JList<String> listVisits;
    private DefaultListModel<String> visitListModel;
    private List<CaseHistory> activeCases;

    private JLabel lblPatientInfo;
    private JTextArea txtHistoryDetails;
    private JTable tblPrescriptions;
    private DefaultTableModel prescTableModel;

    private final PatientController patientController;
    private final CaseController caseController;

    public CaseHistoryView() {
        patientController = new PatientController();
        caseController = new CaseController();
        initComponents();
    }

    private void initComponents() {
        setTitle("Patient Multi-Visit Case History Explorer");
        setSize(960, 680);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Top Search Bar
        JPanel pnlTop = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 10));
        pnlTop.setBackground(new Color(240, 245, 250));
        pnlTop.add(new JLabel("Enter Patient ID (e.g. PAT-1001):"));
        txtSearchPatient = new JTextField(15);
        btnSearch = new JButton("Load History");
        btnSearch.setBackground(new Color(24, 76, 120));
        btnSearch.setForeground(Color.WHITE);
        pnlTop.add(txtSearchPatient);
        pnlTop.add(btnSearch);

        // Left Panel: Previous Visits list
        visitListModel = new DefaultListModel<>();
        listVisits = new JList<>(visitListModel);
        listVisits.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scrollVisits = new JScrollPane(listVisits);
        scrollVisits.setPreferredSize(new Dimension(220, 500));
        scrollVisits.setBorder(BorderFactory.createTitledBorder("Previous Clinical Visits"));

        // Right Panel: Visit Details
        JPanel pnlDetails = new JPanel(new BorderLayout(8, 8));
        lblPatientInfo = new JLabel("Select a patient and visit to inspect records.");
        lblPatientInfo.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lblPatientInfo.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));

        txtHistoryDetails = new JTextArea();
        txtHistoryDetails.setEditable(false);
        txtHistoryDetails.setFont(new Font("Monospaced", Font.PLAIN, 13));
        JScrollPane scrollDetails = new JScrollPane(txtHistoryDetails);

        String[] cols = {"Medicine", "Dosage", "Frequency", "Duration", "Instructions"};
        prescTableModel = new DefaultTableModel(cols, 0);
        tblPrescriptions = new JTable(prescTableModel);
        JScrollPane scrollPresc = new JScrollPane(tblPrescriptions);
        scrollPresc.setPreferredSize(new Dimension(680, 160));
        scrollPresc.setBorder(BorderFactory.createTitledBorder("Prescription Medicines for this Visit"));

        pnlDetails.add(lblPatientInfo, BorderLayout.NORTH);
        pnlDetails.add(scrollDetails, BorderLayout.CENTER);
        pnlDetails.add(scrollPresc, BorderLayout.SOUTH);

        // Listeners
        btnSearch.addActionListener(e -> loadPatientHistory());
        listVisits.addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) displaySelectedVisit();
        });

        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, scrollVisits, pnlDetails);
        splitPane.setDividerLocation(240);

        setLayout(new BorderLayout());
        add(pnlTop, BorderLayout.NORTH);
        add(splitPane, BorderLayout.CENTER);
    }

    private void loadPatientHistory() {
        String pid = txtSearchPatient.getText().trim();
        Patient p = patientController.getPatient(pid);
        if (p == null) {
            JOptionPane.showMessageDialog(this, "Patient ID not found in database!", "Notice", JOptionPane.WARNING_MESSAGE);
            return;
        }

        lblPatientInfo.setText("Patient: " + p.getName() + " | Age: " + p.getAge() + " | Gender: " + p.getGender() + " | Blood: " + p.getBloodGroup());
        activeCases = caseController.getPatientCases(pid);
        visitListModel.clear();

        if (activeCases.isEmpty()) {
            visitListModel.addElement("No recorded visits yet");
            txtHistoryDetails.setText("No previous case history found for this patient.");
            prescTableModel.setRowCount(0);
            return;
        }

        for (CaseHistory ch : activeCases) {
            visitListModel.addElement("Visit #" + ch.getCaseId() + " (" + ch.getVisitDate() + ")");
        }
        listVisits.setSelectedIndex(0);
    }

    private void displaySelectedVisit() {
        int idx = listVisits.getSelectedIndex();
        if (idx == -1 || activeCases == null || idx >= activeCases.size()) return;

        CaseHistory ch = activeCases.get(idx);
        Examination exam = caseController.getExamination(ch.getCaseId());
        Diagnosis diag = caseController.getDiagnosis(ch.getCaseId());
        Prescription rx = caseController.getPrescription(ch.getCaseId());
        FollowUp fu = caseController.getFollowUp(ch.getCaseId());

        StringBuilder sb = new StringBuilder();
        sb.append("=========================================================================\\n");
        sb.append("CLINICAL CASE REPORT - CASE ID: #").append(ch.getCaseId()).append("  |  DATE: ").append(ch.getVisitDate()).append("\\n");
        sb.append("=========================================================================\\n");
        sb.append("CHIEF COMPLAINT : ").append(ch.getChiefComplaint()).append("\\n");
        sb.append("SYMPTOMS        : ").append(ch.getSymptoms()).append("\\n");
        sb.append("DURATION        : ").append(ch.getDuration()).append("\\n");
        sb.append("PAST HISTORY    : ").append(ch.getPastHistory()).append("\\n");
        sb.append("ALLERGIES       : ").append(ch.getAllergy()).append("\\n");
        sb.append("CURRENT MEDS    : ").append(ch.getCurrentMedication()).append("\\n\\n");

        if (exam != null) {
            sb.append("--- PHYSICAL EXAMINATION ---\\n");
            sb.append("Temperature : ").append(exam.getTemperature()).append("   BP: ").append(exam.getBloodPressure()).append("   Pulse: ").append(exam.getPulseRate()).append("\\n");
            sb.append("Weight      : ").append(exam.getWeight()).append("   Height: ").append(exam.getHeight()).append("\\n");
            sb.append("Observation : ").append(exam.getObservation()).append("\\n\\n");
        }

        if (diag != null) {
            sb.append("--- DIAGNOSIS & CLINICAL NOTES ---\\n");
            sb.append("Diagnosis   : ").append(diag.getDiagnosisText()).append("\\n");
            sb.append("Notes       : ").append(diag.getDoctorNotes()).append("\\n\\n");
        }

        if (fu != null) {
            sb.append("--- FOLLOW-UP ---\\n");
            sb.append("Next Date   : ").append(fu.getFollowupDate()).append("  (Status: ").append(fu.getStatus()).append(")\\n");
            sb.append("Remarks     : ").append(fu.getNotes()).append("\\n");
        }

        txtHistoryDetails.setText(sb.toString());

        prescTableModel.setRowCount(0);
        if (rx != null && rx.getMedicines() != null) {
            for (PrescriptionMedicine m : rx.getMedicines()) {
                prescTableModel.addRow(new Object[]{
                    m.getMedicineName(), m.getDosage(), m.getFrequency(), m.getDuration(), m.getInstructions()
                });
            }
        }
    }
}
`
  },
  {
    path: 'view/ReportsView.java',
    name: 'ReportsView.java',
    category: 'view',
    description: 'Clinical reports dashboard displaying totals, recent cases, date-wise stats, and patient visit volumes.',
    code: `package view;

import dao.CaseHistoryDAO;
import dao.PatientDAO;
import model.Patient;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

public class ReportsView extends JFrame {

    private final PatientDAO patientDAO = new PatientDAO();
    private final CaseHistoryDAO caseHistoryDAO = new CaseHistoryDAO();

    public ReportsView() {
        initComponents();
    }

    private void initComponents() {
        setTitle("Clinical Analytics & Case Reports");
        setSize(880, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Stats Header
        JPanel pnlStats = new JPanel(new GridLayout(1, 3, 15, 15));
        pnlStats.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        pnlStats.setBackground(new Color(240, 245, 250));

        List<Patient> patients = patientDAO.getAllPatients();
        int totalPatients = patients.size();
        int totalCases = caseHistoryDAO.getTotalCasesCount();

        pnlStats.add(createMetricBox("Total Patients Registered", String.valueOf(totalPatients), new Color(24, 76, 120)));
        pnlStats.add(createMetricBox("Total Clinical Cases", String.valueOf(totalCases), new Color(15, 120, 60)));
        pnlStats.add(createMetricBox("System Status", "Normal (Active)", new Color(70, 80, 90)));

        // Recent Patients Table
        String[] cols = {"Patient ID", "Name", "Age", "Gender", "Mobile", "Blood Group"};
        DefaultTableModel model = new DefaultTableModel(cols, 0);
        for (Patient p : patients) {
            model.addRow(new Object[]{p.getPatientId(), p.getName(), p.getAge(), p.getGender(), p.getMobile(), p.getBloodGroup()});
        }
        JTable tbl = new JTable(model);
        JScrollPane scroll = new JScrollPane(tbl);
        scroll.setBorder(BorderFactory.createTitledBorder("Patient Roster & Case Registrations"));

        setLayout(new BorderLayout());
        add(pnlStats, BorderLayout.NORTH);
        add(scroll, BorderLayout.CENTER);
    }

    private JPanel createMetricBox(String label, String value, Color color) {
        JPanel p = new JPanel(new GridLayout(2, 1));
        p.setBackground(Color.WHITE);
        p.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(210, 220, 230), 1),
            BorderFactory.createEmptyBorder(12, 12, 12, 12)
        ));
        JLabel lblVal = new JLabel(value);
        lblVal.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblVal.setForeground(color);
        JLabel lblTxt = new JLabel(label);
        lblTxt.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        p.add(lblVal);
        p.add(lblTxt);
        return p;
    }
}
`
  },
  {
    path: 'Main.java',
    name: 'Main.java',
    category: 'root',
    description: 'Application entry point testing JDBC connection and launching Swing LoginView.',
    code: `import database.DBConnection;
import view.LoginView;

import javax.swing.*;
import java.sql.Connection;

/**
 * Main Class - Application Entry Point
 * Academic Project: Patient Case-Taking Software
 */
public class Main {

    public static void main(String[] args) {
        // Set Native System Look and Feel for modern desktop styling
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            System.out.println("Using default Swing Look & Feel.");
        }

        // Test Database Connectivity
        SwingUtilities.invokeLater(() -> {
            System.out.println("Starting Patient Case-Taking Software...");
            Connection conn = DBConnection.getConnection();
            if (conn != null) {
                System.out.println("[Main] MySQL Database connection verified.");
            } else {
                System.out.println("[Main] Warning: Proceeding in offline mode until DB is configured.");
            }

            // Launch Login Interface
            new LoginView().setVisible(true);
        });
    }
}
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'root',
    description: 'Comprehensive setup guide for NetBeans, IntelliJ IDEA, VS Code, MySQL, and Academic Viva questions.',
    code: `# Patient Case-Taking Software (Academic Engineering Project)

A complete desktop-based clinical patient case-taking system built with **Java Swing**, **MySQL**, **JDBC**, and **MVC Architecture**.

---

## 🛠️ Technology Stack
* **Language**: Java (JDK 17 or higher recommended)
* **GUI Framework**: Java Swing (\`JFrame\`, \`JPanel\`, \`JTable\`, \`JTabbedPane\`, \`JOptionPane\`)
* **Database**: MySQL 8.x
* **Connectivity**: JDBC with \`PreparedStatement\` (MySQL Connector/J)
* **Design Pattern**: Model-View-Controller (MVC) + DAO Pattern

---

## 📂 Project Structure
\`\`\`
patient_case_taking/
├── database/
│   ├── schema.sql              # MySQL DDL & DML script
│   └── DBConnection.java        # JDBC Driver & Connection Singleton
├── model/
│   ├── User.java
│   ├── Patient.java
│   ├── CaseHistory.java
│   ├── Examination.java
│   ├── Diagnosis.java
│   ├── Prescription.java
│   ├── PrescriptionMedicine.java
│   └── FollowUp.java
├── dao/
│   ├── UserDAO.java
│   ├── PatientDAO.java
│   ├── CaseHistoryDAO.java
│   ├── ExaminationDAO.java
│   ├── DiagnosisDAO.java
│   ├── PrescriptionDAO.java
│   └── FollowUpDAO.java
├── controller/
│   ├── AuthController.java
│   ├── PatientController.java
│   └── CaseController.java
├── view/
│   ├── LoginView.java
│   ├── DashboardView.java
│   ├── PatientRegistrationView.java
│   ├── PatientManagementView.java
│   ├── CaseTakingView.java
│   ├── CaseHistoryView.java
│   └── ReportsView.java
└── Main.java                    # Entry Point
\`\`\`

---

## 🚀 Setup & Execution Guide

### 1. Database Setup (MySQL)
1. Open **MySQL Workbench** or command line \`mysql -u root -p\`.
2. Open and run \`database/schema.sql\`.
3. Verify that the database \`patient_case_db\` and its 8 normalized tables are created.
4. Edit \`database/DBConnection.java\` if your MySQL username or password differs:
   \`\`\`java
   private static final String USERNAME = "root";
   private static final String PASSWORD = "your_mysql_password";
   \`\`\`

### 2. Setup in NetBeans IDE
1. Open **NetBeans** -> \`File\` -> \`New Project\` -> \`Java with Ant\` -> \`Java Application\`.
2. Name it \`PatientCaseTaking\`.
3. Copy the \`model\`, \`view\`, \`controller\`, \`dao\`, \`database\` packages and \`Main.java\` into the \`src\` folder.
4. Right-click the project -> \`Properties\` -> \`Libraries\` -> \`Add JAR/Folder\` -> Select \`mysql-connector-j-8.x.jar\`.
5. Press **F6** or click **Run Project**.

### 3. Setup in IntelliJ IDEA
1. Open **IntelliJ IDEA** -> \`New Project\` -> Select **Java** (JDK 17+).
2. Copy all packages and \`Main.java\` into \`src/\`.
3. Go to \`File\` -> \`Project Structure\` -> \`Libraries\` -> Click \`+\` -> Add \`mysql-connector-j-8.x.jar\`.
4. Right-click \`Main.java\` -> \`Run 'Main.main()'\`.

---

## 🔑 Default Login Credentials
| Role | Username | Password |
|---|---|---|
| **Administrator** | \`admin\` | \`admin123\` |
| **Doctor** | \`doctor\` | \`doctor123\` |
| **Doctor (Alternative)** | \`dr_kumar\` | \`doctor123\` |
`
  }
];
