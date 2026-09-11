-- ============================================================================
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

-- ----------------------------------------------------------------------------
-- ENTITY 1: User (Hospital Staff / Authentication & Role-Based Access Control)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 2: Patient (Master Demographic Record of Outpatients)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 3: CaseHistory (Consultation Encounter & Presenting Symptoms)
-- Relationship: One Patient -> Multiple Case Histories (1:N)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 4: Examination (Physical Examination & Vital Signs)
-- Relationship: One Case History -> Exactly One Physical Examination (1:1)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 5: Diagnosis (Medical Assessment & Clinical Verdict)
-- Relationship: One Case History -> Exactly One Clinical Diagnosis (1:1)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 6: Prescription (Doctor Prescription Order Header)
-- Relationship: One Case History -> Exactly One Prescription Header (1:1)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 7: PrescriptionMedicine (Individual Prescribed Pharmaceutical Items)
-- Relationship: One Prescription -> Multiple Prescribed Medicines (1:N)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- ENTITY 8: FollowUp (Post-Consultation Monitoring & Review Appointments)
-- Relationship: One Case History -> Multiple Follow-up Records (1:N)
-- ----------------------------------------------------------------------------
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

-- Insert Users (Administrators & Doctors)
INSERT INTO users (username, password, full_name, role, email, specialization, phone) VALUES
('admin', 'admin123', 'Hospital Admin', 'Admin', 'admin@hospital.org', 'Hospital Administration', '9876543210'),
('doctor', 'doctor123', 'Dr. Sarah Jenkins, M.D.', 'Doctor', 'dr.sarah@hospital.org', 'Internal Medicine', '9876543211'),
('dr_kumar', 'doctor123', 'Dr. Rajesh Kumar, M.B.B.S.', 'Doctor', 'dr.kumar@hospital.org', 'General Physician', '9876543212');

-- Insert Patients
INSERT INTO patients (patient_id, name, age, gender, mobile, address, blood_group, registered_date) VALUES
('P-1001', 'Rahul Sharma', 34, 'Male', '9820011223', '402, Green Valley Apartments, Mumbai', 'B+', '2026-02-15'),
('P-1002', 'Priya Patel', 28, 'Female', '9876543210', 'B-12, Shanti Nagar, Pune', 'O+', '2026-02-20'),
('P-1003', 'Anil Deshmukh', 52, 'Male', '9765432109', '78, Civil Lines, Nagpur', 'A+', '2026-03-01'),
('P-1004', 'Sneha Kulkarni', 22, 'Female', '9123456780', '15, Model Colony, Pune', 'AB+', '2026-03-05');

-- Insert Case Histories
-- Case 1: Rahul Sharma - Visit 1 (Acute viral pharyngitis)
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1001', 2, '2026-03-01', 'High grade fever with severe throat pain', 'Sore throat, difficulty swallowing, body aches, mild dry cough', '3 Days', 'No significant chronic illness', 'Penicillin (mild cutaneous rash)', 'Hypertension (Father)', 'Paracetamol 650mg SOS');

-- Case 2: Priya Patel - Visit 1 (Migraine without aura)
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1002', 2, '2026-03-03', 'Unilateral throbbing headache with nausea', 'Left-sided pounding headache, photophobia, phonophobia, nausea', '2 Days', 'Occasional tension headaches during stressful exams', 'None reported', 'Migraine (Mother)', 'None');

-- Case 3: Rahul Sharma - Visit 2 (Multi-visit demonstration: 1:N Patient-to-Case)
INSERT INTO case_history (patient_id, doctor_id, visit_date, chief_complaint, symptoms, duration, past_history, allergy, family_history, current_medication) VALUES
('P-1001', 3, '2026-03-08', 'Persistent dry cough following recovery from fever', 'Hacking dry cough especially at night, mild chest tightness', '5 Days', 'Recent acute upper respiratory infection', 'Penicillin', 'Hypertension (Father)', 'Completed Azithromycin course');

-- Insert Physical Examinations (1:1 with CaseHistory)
-- Exam for Case 1
INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES
(1, 101.4, '120/80', 88, 74.5, 175.0, 'Pharyngeal erythema with tonsillar congestion. Chest clear on bilateral auscultation.');

-- Exam for Case 2
INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES
(2, 98.6, '110/70', 74, 58.0, 162.0, 'Neurological cranial nerve screening normal. Left temporal tenderness on palpation.');

-- Exam for Case 3
INSERT INTO examinations (case_id, temperature, blood_pressure, pulse_rate, weight, height, observation) VALUES
(3, 98.4, '122/82', 76, 74.0, 175.0, 'Throat congestion resolved. Normal vesicular breath sounds, no rales or wheezing.');

-- Insert Diagnoses (1:1 with CaseHistory)
-- Diagnosis for Case 1
INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES
(1, 'Acute Viral Pharyngitis & Upper Respiratory Infection', 'Advised warm saline gargles, adequate hydration, and symptomatic antipyretics.', '2026-03-01');

-- Diagnosis for Case 2
INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES
(2, 'Acute Migraine Headache without Aura', 'Lifestyle modification advised. Avoid irregular sleep patterns and known dietary triggers.', '2026-03-03');

-- Diagnosis for Case 3
INSERT INTO diagnoses (case_id, diagnosis_text, doctor_notes, diagnosis_date) VALUES
(3, 'Post-Infectious Bronchial Hyperresponsiveness (Post-Viral Cough)', 'Benign self-limiting post-viral cough. Prescribed antitussive syrup.', '2026-03-08');

-- Insert Prescriptions (1:1 with CaseHistory)
-- Prescription for Case 1
INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES
(1, '2026-03-01', 'Take medications after meals. Return if fever persists beyond 48 hours.');

-- Prescription for Case 2
INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES
(2, '2026-03-03', 'Rest in a quiet, dark room during acute attack. Stay well hydrated.');

-- Prescription for Case 3
INSERT INTO prescriptions (case_id, prescription_date, doctor_notes) VALUES
(3, '2026-03-08', 'Steam inhalation twice daily for 5 days.');

-- Insert Prescription Medicines (1:N with Prescription)
-- Medicines for Prescription 1 (Case 1)
INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(1, 'Tab. Paracetamol', '650 mg', '1-1-1 (TDS)', '3 Days', 'After meals with water'),
(1, 'Tab. Cetirizine', '10 mg', '0-0-1 (Night)', '5 Days', 'Before bedtime'),
(1, 'Betadine Gargle (2% w/v)', '10 ml', '1-0-1 (BD)', '5 Days', 'Dilute with equal amount of warm water');

-- Medicines for Prescription 2 (Case 2)
INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(2, 'Tab. Naproxen', '500 mg', 'SOS (Max 2 tabs/day)', '3 Days', 'Take with food at onset of attack'),
(2, 'Tab. Domperidone', '10 mg', '1-0-1 (BD)', '3 Days', '30 minutes before breakfast and dinner');

-- Medicines for Prescription 3 (Case 3)
INSERT INTO prescription_medicines (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(3, 'Syr. Dextromethorphan HBr', '10 ml', '1-1-1 (TDS)', '5 Days', 'After food'),
(3, 'Tab. Montelukast + Levocetirizine', '10mg/5mg', '0-0-1 (Night)', '7 Days', 'Before sleep');

-- Insert Follow-ups (1:N with CaseHistory)
-- Case 1 Follow-ups (Multiple follow-ups for same case history)
INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES
(1, '2026-03-05', 'Scheduled review for fever clearance and pharynx check', 'Completed'),
(1, '2026-03-12', 'Secondary checkup for complete recovery confirmation', 'Scheduled');

-- Case 2 Follow-up
INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES
(2, '2026-03-17', 'Headache frequency review and migraine headache diary evaluation', 'Scheduled');

-- Case 3 Follow-up
INSERT INTO follow_ups (case_id, followup_date, notes, status) VALUES
(3, '2026-03-15', 'Review resolution of persistent nocturnal dry cough', 'Scheduled');

-- ============================================================================
-- 4. VERIFICATION & TEST SELECT QUERIES
-- ============================================================================

-- Query 1: Comprehensive Patient Case History (Multi-Table JOIN)
SELECT 
    p.patient_id,
    p.name AS patient_name,
    p.age,
    p.gender,
    p.blood_group,
    ch.case_id,
    ch.visit_date,
    ch.chief_complaint,
    u.full_name AS consulting_doctor,
    ex.temperature,
    ex.blood_pressure,
    ex.pulse_rate,
    dg.diagnosis_text
FROM patients p
JOIN case_history ch ON p.patient_id = ch.patient_id
JOIN users u ON ch.doctor_id = u.user_id
LEFT JOIN examinations ex ON ch.case_id = ex.case_id
LEFT JOIN diagnoses dg ON ch.case_id = dg.case_id
ORDER BY ch.visit_date DESC;

-- Query 2: Complete Prescription Details with Line-Item Medicines
SELECT 
    pr.prescription_id,
    ch.case_id,
    p.patient_id,
    p.name AS patient_name,
    pr.prescription_date,
    pm.medicine_name,
    pm.dosage,
    pm.frequency,
    pm.duration,
    pm.instructions,
    pr.doctor_notes
FROM prescriptions pr
JOIN case_history ch ON pr.case_id = ch.case_id
JOIN patients p ON ch.patient_id = p.patient_id
JOIN prescription_medicines pm ON pr.prescription_id = pm.prescription_id
WHERE ch.case_id = 1
ORDER BY pm.item_id ASC;

-- Query 3: Patient Longitudinal Visits (Demonstrating 1:N Patient -> CaseHistory)
SELECT 
    p.patient_id,
    p.name,
    COUNT(ch.case_id) AS total_visits,
    MIN(ch.visit_date) AS first_visit,
    MAX(ch.visit_date) AS latest_visit
FROM patients p
LEFT JOIN case_history ch ON p.patient_id = ch.patient_id
GROUP BY p.patient_id, p.name;

-- Query 4: Upcoming Follow-ups Due
SELECT 
    f.followup_id,
    f.followup_date,
    f.status,
    p.patient_id,
    p.name AS patient_name,
    p.mobile,
    ch.chief_complaint,
    f.notes AS followup_instructions
FROM follow_ups f
JOIN case_history ch ON f.case_id = ch.case_id
JOIN patients p ON ch.patient_id = p.patient_id
WHERE f.status = 'Scheduled'
ORDER BY f.followup_date ASC;
