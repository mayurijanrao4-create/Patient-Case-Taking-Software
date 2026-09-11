import { User, Patient, CaseHistory, Examination, Diagnosis, Prescription, FollowUp, Ward, Bed, RoutineCheckup, SmsMessage, AuditLog, PatientDocument } from '../types';

export const INITIAL_USERS: User[] = [
  {
    userId: 1,
    username: 'admin',
    password: 'admin123',
    fullName: 'System Administrator',
    role: 'Admin',
    email: 'admin@hospital.org'
  },
  {
    userId: 2,
    username: 'doctor',
    password: 'doctor123',
    fullName: 'Dr. Sarah Jenkins (M.D. Gen. Med)',
    role: 'Doctor',
    email: 'dr.sarah@hospital.org'
  },
  {
    userId: 3,
    username: 'dr_kumar',
    password: 'doctor123',
    fullName: 'Dr. Rajesh Kumar (M.B.B.S, D.N.B)',
    role: 'Doctor',
    email: 'dr.kumar@hospital.org'
  }
];

export const INITIAL_WARDS: Ward[] = [
  {
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    category: 'ICU',
    totalBeds: 6,
    floor: 'Floor 2 (Block B)',
    nurseInCharge: 'Sr. Mary Davis, RN',
    contactExt: 'Ext. 2401',
    dailyRate: 3500,
    description: '24x7 Multi-parameter monitored critical care with dedicated ventilators and centralized oxygen.'
  },
  {
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    category: 'General',
    totalBeds: 8,
    floor: 'Floor 1 (Block A)',
    nurseInCharge: 'Sr. Rachel Adams, RN',
    contactExt: 'Ext. 1102',
    dailyRate: 600,
    description: 'Inpatient recovery ward for adult male patients with shared nursing station.'
  },
  {
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    category: 'General',
    totalBeds: 8,
    floor: 'Floor 1 (Block B)',
    nurseInCharge: 'Sr. Priya Patel, RN',
    contactExt: 'Ext. 1105',
    dailyRate: 600,
    description: 'Inpatient medical-surgical recovery ward for adult female patients.'
  },
  {
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    category: 'Emergency',
    totalBeds: 6,
    floor: 'Ground Floor (Triage)',
    nurseInCharge: 'Sr. James Wilson, RN',
    contactExt: 'Ext. 1000',
    dailyRate: 1200,
    description: 'Acute stabilization and emergency triage unit with immediate resuscitation gear.'
  },
  {
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    category: 'Pediatric',
    totalBeds: 6,
    floor: 'Floor 3 (Children Wing)',
    nurseInCharge: 'Sr. Angela Brown, RN',
    contactExt: 'Ext. 3204',
    dailyRate: 900,
    description: 'Child-friendly inpatient environment with pediatric nursing staff.'
  },
  {
    wardId: 'WARD-DLX',
    wardName: 'Private Deluxe Suite',
    category: 'Private',
    totalBeds: 4,
    floor: 'Floor 4 (Executive Wing)',
    nurseInCharge: 'Sr. Jennifer Lee, RN',
    contactExt: 'Ext. 4101',
    dailyRate: 4500,
    description: 'Individual single-occupancy air-conditioned private rooms with patient-attendant cot.'
  }
];

export const INITIAL_BEDS: Bed[] = [
  // ICU Beds
  {
    bedId: 'BED-ICU-01',
    bedNumber: 'ICU-01',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Occupied',
    patientId: 'PAT-1003',
    patientName: 'Vikramaditya Sharma',
    admissionDate: '2026-08-19',
    admittingDoctor: 'Dr. Sarah Jenkins',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-ICU-02',
    bedNumber: 'ICU-02',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-ICU-03',
    bedNumber: 'ICU-03',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Cleaning',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-ICU-04',
    bedNumber: 'ICU-04',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-ICU-05',
    bedNumber: 'ICU-05',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-ICU-06',
    bedNumber: 'ICU-06',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },

  // General Ward Male Beds
  {
    bedId: 'BED-GWM-01',
    bedNumber: 'GWM-01',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Occupied',
    patientId: 'PAT-1001',
    patientName: 'Robert Vance',
    admissionDate: '2026-08-10',
    admittingDoctor: 'Dr. Sarah Jenkins',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-02',
    bedNumber: 'GWM-02',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-03',
    bedNumber: 'GWM-03',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-04',
    bedNumber: 'GWM-04',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Occupied',
    patientId: 'PAT-1004',
    patientName: 'Michael Scott',
    admissionDate: '2026-09-02',
    admittingDoctor: 'Dr. Rajesh Kumar',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-05',
    bedNumber: 'GWM-05',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-06',
    bedNumber: 'GWM-06',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-07',
    bedNumber: 'GWM-07',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWM-08',
    bedNumber: 'GWM-08',
    wardId: 'WARD-GWM',
    wardName: 'General Ward (Male)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },

  // General Ward Female Beds
  {
    bedId: 'BED-GWF-01',
    bedNumber: 'GWF-01',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-02',
    bedNumber: 'GWF-02',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-03',
    bedNumber: 'GWF-03',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-04',
    bedNumber: 'GWF-04',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Occupied',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    admissionDate: '2026-08-14',
    admittingDoctor: 'Dr. Rajesh Kumar',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-05',
    bedNumber: 'GWF-05',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-06',
    bedNumber: 'GWF-06',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-07',
    bedNumber: 'GWF-07',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-GWF-08',
    bedNumber: 'GWF-08',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    status: 'Cleaning',
    oxygenSupported: true,
    ventilatorAvailable: false
  },

  // Emergency Beds
  {
    bedId: 'BED-EMG-01',
    bedNumber: 'EMG-01',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-EMG-02',
    bedNumber: 'EMG-02',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: true
  },
  {
    bedId: 'BED-EMG-03',
    bedNumber: 'EMG-03',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-EMG-04',
    bedNumber: 'EMG-04',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-EMG-05',
    bedNumber: 'EMG-05',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-EMG-06',
    bedNumber: 'EMG-06',
    wardId: 'WARD-EMG',
    wardName: 'Emergency & Casualty',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },

  // Pediatric Beds
  {
    bedId: 'BED-PED-01',
    bedNumber: 'PED-01',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-PED-02',
    bedNumber: 'PED-02',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-PED-03',
    bedNumber: 'PED-03',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-PED-04',
    bedNumber: 'PED-04',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-PED-05',
    bedNumber: 'PED-05',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-PED-06',
    bedNumber: 'PED-06',
    wardId: 'WARD-PED',
    wardName: 'Pediatric Care Ward',
    status: 'Available',
    oxygenSupported: false,
    ventilatorAvailable: false
  },

  // Deluxe Suite Beds
  {
    bedId: 'BED-DLX-01',
    bedNumber: 'DLX-01',
    wardId: 'WARD-DLX',
    wardName: 'Private Deluxe Suite',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-DLX-02',
    bedNumber: 'DLX-02',
    wardId: 'WARD-DLX',
    wardName: 'Private Deluxe Suite',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-DLX-03',
    bedNumber: 'DLX-03',
    wardId: 'WARD-DLX',
    wardName: 'Private Deluxe Suite',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  },
  {
    bedId: 'BED-DLX-04',
    bedNumber: 'DLX-04',
    wardId: 'WARD-DLX',
    wardName: 'Private Deluxe Suite',
    status: 'Available',
    oxygenSupported: true,
    ventilatorAvailable: false
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    patientId: 'PAT-1001',
    name: 'Rahul Patil',
    age: 38,
    gender: 'Male',
    mobile: '9876543210',
    address: '42 Pine Crest Avenue, North Suburb',
    bloodGroup: 'B+',
    createdAt: '2026-07-10',
    admissionType: 'OPD',
    bedStatus: 'None',
    status: 'ACTIVE',
    emergencyNotes: 'Severe Penicillin allergy. Under treatment for viral fever and recurrent migraine. Monitor BP and temperature.',
    allergiesSummary: 'Penicillin (Severe Cutaneous Rash)',
    hasRoutineCheckup: true,
    checkupFrequency: 'Weekly',
    routineCondition: 'Hypertension & Cardiac Follow-up',
    preferredDay: 'Monday',
    nextCheckupDate: '2026-09-07',
    lastCheckupDate: '2026-08-31'
  },
  {
    patientId: 'PAT-1002',
    name: 'Eleanor Davis',
    age: 32,
    gender: 'Female',
    mobile: '9823456789',
    address: '15 Greenwood Residency, Oak Street',
    bloodGroup: 'O+',
    createdAt: '2026-08-14',
    admissionType: 'IPD',
    wardId: 'WARD-GWF',
    wardName: 'General Ward (Female)',
    bedNumber: 'GWF-04',
    admissionDate: '2026-08-14',
    bedStatus: 'Allocated',
    status: 'ACTIVE',
    emergencyNotes: 'Post-op appendectomy wound care. Recovering well, dressing intact.',
    allergiesSummary: 'No Known Drug Allergies (NKDA)',
    hasRoutineCheckup: true,
    checkupFrequency: 'Weekly',
    routineCondition: 'Post-Op Wound & Vitals Check',
    preferredDay: 'Wednesday',
    nextCheckupDate: '2026-09-02',
    lastCheckupDate: '2026-08-26'
  },
  {
    patientId: 'PAT-1003',
    name: 'Vikramaditya Sharma',
    age: 58,
    gender: 'Male',
    mobile: '9765432198',
    address: 'Flat 302, Sunrise Towers, MG Road',
    bloodGroup: 'A+',
    createdAt: '2026-08-19',
    admissionType: 'IPD',
    wardId: 'WARD-ICU',
    wardName: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-01',
    admissionDate: '2026-08-19',
    bedStatus: 'Allocated',
    status: 'ACTIVE',
    emergencyNotes: 'Type 2 Diabetes Mellitus with peripheral neuropathy. Post-ICU pulmonary rehabilitation.',
    allergiesSummary: 'Sulfa Drugs',
    hasRoutineCheckup: true,
    checkupFrequency: 'Weekly',
    routineCondition: 'Post-ICU Pulmonary Recovery',
    preferredDay: 'Friday',
    nextCheckupDate: '2026-09-11',
    lastCheckupDate: '2026-09-04'
  },
  {
    patientId: 'PAT-1004',
    name: 'Clara Oswald',
    age: 26,
    gender: 'Female',
    mobile: '9123456780',
    address: '77 Baker Street, Central District',
    bloodGroup: 'AB-',
    createdAt: '2026-09-01',
    admissionType: 'OPD',
    bedStatus: 'None',
    status: 'ACTIVE',
    emergencyNotes: 'Type 2 Diabetes glycemic follow-up. Avoid aspirin.',
    allergiesSummary: 'Aspirin (Gastric irritation)',
    hasRoutineCheckup: true,
    checkupFrequency: 'Weekly',
    routineCondition: 'Type 2 Diabetes Glycemic Monitoring',
    preferredDay: 'Tuesday',
    nextCheckupDate: '2026-09-08',
    lastCheckupDate: '2026-09-01'
  },
  {
    patientId: 'PAT-1005',
    name: 'Deepak Verma',
    age: 49,
    gender: 'Male',
    mobile: '9845012345',
    address: '12 Lotus Residency, Subhash Nagar',
    bloodGroup: 'O-',
    createdAt: '2026-06-15',
    admissionType: 'OPD',
    bedStatus: 'None',
    status: 'ARCHIVED',
    emergencyNotes: 'Archived patient file. Relocated to another city. Case completed.',
    allergiesSummary: 'None',
    hasRoutineCheckup: false
  },
  {
    patientId: 'PAT-1006',
    name: 'Sneha Kulkarni',
    age: 29,
    gender: 'Female',
    mobile: '9833214567',
    address: '88 Shivaji Park Road, Dadar West',
    bloodGroup: 'B+',
    createdAt: '2026-09-01',
    admissionType: 'OPD',
    bedStatus: 'None',
    status: 'ACTIVE',
    emergencyNotes: 'Upper respiratory allergic rhinitis and mild seasonal pharyngitis.',
    allergiesSummary: 'Ciprofloxacin',
    hasRoutineCheckup: false
  },
  {
    patientId: 'PAT-1007',
    name: 'Amit Shah',
    age: 42,
    gender: 'Male',
    mobile: '9811223344',
    address: '104 Marine Drive, Nariman Point',
    bloodGroup: 'A+',
    createdAt: '2026-09-05',
    admissionType: 'OPD',
    bedStatus: 'None',
    status: 'ACTIVE',
    emergencyNotes: 'Occasional musculoskeletal fever and lumbar muscle sprain.',
    allergiesSummary: 'None',
    hasRoutineCheckup: false
  }
];

export const INITIAL_CASES: CaseHistory[] = [
  {
    caseId: 99,
    patientId: 'PAT-1001',
    visitDate: '2026-07-15',
    chiefComplaint: 'General Checkup',
    symptoms: 'Mild tiredness, occasional afternoon fatigue, no acute distress',
    duration: '2 weeks',
    pastHistory: 'No major chronic illnesses reported',
    allergy: 'Penicillin (Skin rash)',
    familyHistory: 'Father has essential hypertension',
    currentMedication: 'None',
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    caseStatus: 'Completed',
    doctorNotes: 'Routine baseline general physical checkup. All physiological systems within normal adult parameters.',
    followupInstructions: 'Maintain balanced hydration and daily 30-minute brisk walking.',
    handoverNotes: 'General health satisfactory. No immediate intervention required.'
  },
  {
    caseId: 101,
    patientId: 'PAT-1001',
    visitDate: '2026-08-20',
    chiefComplaint: 'Headache',
    symptoms: 'Throbbing unilateral frontal headache, photophobia, mild nausea',
    duration: '3 days',
    pastHistory: 'History of penicillin allergy',
    allergy: 'Penicillin',
    familyHistory: 'Maternal migraine history',
    currentMedication: 'None',
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    caseStatus: 'Completed',
    doctorNotes: 'Classic migraine with sensory aura. Stress and excessive screen glare identified as probable triggers.',
    followupInstructions: 'Keep headache diary. Avoid skipping meals. Sleep in darkened room during attacks.',
    handoverNotes: 'Patient responds well to dark room rest and mild analgesic therapy.'
  },
  {
    caseId: 102,
    patientId: 'PAT-1001',
    visitDate: '2026-09-10',
    chiefComplaint: 'Fever',
    symptoms: 'Fever, Headache, body ache, chills, fatigue',
    duration: '2 days',
    pastHistory: 'Hypertension, Penicillin allergy',
    allergy: 'Penicillin',
    familyHistory: 'Paternal cardiac history',
    currentMedication: 'None currently',
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    caseStatus: 'Under Treatment',
    doctorNotes: 'Patient improving after previous treatment. High grade evening spikes up to 101°F noted.',
    followupInstructions: 'Review symptoms during follow-up.',
    handoverNotes: 'Next Doctor Instructions: Review symptoms during follow-up on 15 September 2026.'
  },
  {
    caseId: 103,
    patientId: 'PAT-1002',
    visitDate: '2026-08-15',
    chiefComplaint: 'High grade fever with chills, persistent frontal headache, body ache',
    symptoms: 'Fever spiking in evening (102°F), retro-orbital pain, loss of appetite',
    duration: '3 days',
    pastHistory: 'None reported, previous appendectomy in 2021',
    allergy: 'No known drug allergies (NKDA)',
    familyHistory: 'Non-contributory',
    currentMedication: 'Paracetamol 650mg SOS',
    doctorId: 3,
    doctorName: 'Dr. Rajesh Kumar',
    caseStatus: 'Completed',
    doctorNotes: 'Acute viral pyrexia. Dengue NS1 negative. Sponge baths advised.',
    followupInstructions: 'Report back if fever recurs.',
    handoverNotes: 'Post-fever recovery complete.'
  },
  {
    caseId: 104,
    patientId: 'PAT-1003',
    visitDate: '2026-08-20',
    chiefComplaint: 'Polyuria, polydipsia, unexplained weight loss and numbness in toes',
    symptoms: 'Frequent urination at night (4-5 times), excessive thirst, tingling sensations',
    duration: '3 weeks',
    pastHistory: 'Borderline high fasting sugars noted last year',
    allergy: 'Sulfa drugs',
    familyHistory: 'Both parents had Type 2 Diabetes Mellitus',
    currentMedication: 'None',
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    caseStatus: 'Under Treatment',
    doctorNotes: 'Newly Detected Type 2 Diabetes Mellitus with early Peripheral Neuropathy. Random sugar 286 mg/dL.',
    followupInstructions: 'Monitor fasting blood sugar weekly.',
    handoverNotes: 'Review HbA1c and titrate Metformin dosage.'
  },
  {
    caseId: 105,
    patientId: 'PAT-1006',
    visitDate: '2026-09-01',
    chiefComplaint: 'Sore throat, runny nose and mild low grade fever',
    symptoms: 'Throat irritation, sneezing, body ache',
    duration: '2 days',
    pastHistory: 'Seasonal allergic rhinitis',
    allergy: 'Ciprofloxacin',
    familyHistory: 'None',
    currentMedication: 'Antihistamine',
    doctorId: 3,
    doctorName: 'Dr. Rajesh Kumar',
    caseStatus: 'Completed',
    doctorNotes: 'Acute allergic pharyngitis with secondary viral upper respiratory tract infection.',
    followupInstructions: 'Warm saline gargles thrice daily.',
    handoverNotes: 'Patient asymptomatic after 3 days.'
  },
  {
    caseId: 106,
    patientId: 'PAT-1007',
    visitDate: '2026-09-05',
    chiefComplaint: 'Low back pain radiating to left gluteal region and mild feverish feeling',
    symptoms: 'Dull aching back pain on prolonged sitting, fatigue',
    duration: '5 days',
    pastHistory: 'Sedentary work posture',
    allergy: 'None',
    familyHistory: 'None',
    currentMedication: 'None',
    doctorId: 2,
    doctorName: 'Dr. Sarah Jenkins',
    caseStatus: 'Under Treatment',
    doctorNotes: 'Acute lumbosacral muscle spasm without neurological deficit.',
    followupInstructions: 'Physiotherapy core strengthening after acute phase.',
    handoverNotes: 'Review spinal mobility at follow-up.'
  }
];

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    examId: 199,
    caseId: 99,
    temperature: '98.6 F',
    bloodPressure: '120/80 mmHg',
    pulseRate: '72 bpm',
    weight: '64 kg',
    height: '172 cm',
    observation: 'Well nourished, oriented in time and space, S1 S2 normal, chest clear to auscultation.'
  },
  {
    examId: 201,
    caseId: 101,
    temperature: '98.7 F',
    bloodPressure: '124/82 mmHg',
    pulseRate: '78 bpm',
    weight: '65 kg',
    height: '172 cm',
    observation: 'Mild photophobia, cranial nerves intact, neck supple, no focal neurological deficit.'
  },
  {
    examId: 202,
    caseId: 102,
    temperature: '101.0 F',
    bloodPressure: '118/76 mmHg',
    pulseRate: '92 bpm',
    weight: '65 kg',
    height: '172 cm',
    observation: 'Febrile, flushed facies, mild pharyngeal congestion, lungs clear, no neck stiffness, S1 S2 heard.'
  },
  {
    examId: 203,
    caseId: 103,
    temperature: '102.2 F',
    bloodPressure: '110/72 mmHg',
    pulseRate: '98 bpm',
    weight: '56 kg',
    height: '162 cm',
    observation: 'Febrile, flushed facies, pharyngeal congestion, no meningeal signs, abdomen soft.'
  },
  {
    examId: 204,
    caseId: 104,
    temperature: '98.6 F',
    bloodPressure: '136/86 mmHg',
    pulseRate: '78 bpm',
    weight: '74 kg',
    height: '168 cm',
    observation: 'Mild decrease in monofilament vibration sense over distal phalanges. Tongue dry.'
  },
  {
    examId: 205,
    caseId: 105,
    temperature: '99.2 F',
    bloodPressure: '116/74 mmHg',
    pulseRate: '80 bpm',
    weight: '58 kg',
    height: '160 cm',
    observation: 'Posterior pharyngeal wall erythematous, tonsils grade 1 without exudate.'
  },
  {
    examId: 206,
    caseId: 106,
    temperature: '99.0 F',
    bloodPressure: '130/84 mmHg',
    pulseRate: '76 bpm',
    weight: '79 kg',
    height: '176 cm',
    observation: 'Paravertebral muscle tenderness at L4-L5, straight leg raise test negative bilaterally.'
  }
];

export const INITIAL_DIAGNOSES: Diagnosis[] = [
  {
    diagnosisId: 299,
    caseId: 99,
    diagnosisText: 'General Checkup - Normal Physiological Parameters',
    doctorNotes: 'Baseline vitals within normal adult limits. No pharmacological treatment required.',
    diagnosisDate: '2026-07-15'
  },
  {
    diagnosisId: 301,
    caseId: 101,
    diagnosisText: 'Migraine',
    doctorNotes: 'Neurological exam normal. Advised dark room rest and stress reduction.',
    diagnosisDate: '2026-08-20'
  },
  {
    diagnosisId: 302,
    caseId: 102,
    diagnosisText: 'Viral Fever',
    doctorNotes: 'Patient improving after previous treatment. Advised CBC and Dengue antigen test if fever persists.',
    diagnosisDate: '2026-09-10'
  },
  {
    diagnosisId: 303,
    caseId: 103,
    diagnosisText: 'Acute Viral Pyrexia with Upper Respiratory Tract Infection',
    doctorNotes: 'CBC and Dengue NS1 antigen ordered. Maintain oral hydration and sponge bath if temp > 101 F.',
    diagnosisDate: '2026-08-15'
  },
  {
    diagnosisId: 304,
    caseId: 104,
    diagnosisText: 'Newly Detected Type 2 Diabetes Mellitus with early Peripheral Neuropathy',
    doctorNotes: 'Random blood sugar was 286 mg/dL. Ordered HbA1c, urine microalbumin and renal function test.',
    diagnosisDate: '2026-08-20'
  },
  {
    diagnosisId: 305,
    caseId: 105,
    diagnosisText: 'Acute Allergic Pharyngitis',
    doctorNotes: 'Avoid cold drinks and ice. Antihistamine started.',
    diagnosisDate: '2026-09-01'
  },
  {
    diagnosisId: 306,
    caseId: 106,
    diagnosisText: 'Acute Lumbar Muscle Sprain',
    doctorNotes: 'Ergonomic lumbar support advised. Avoid lifting heavy objects.',
    diagnosisDate: '2026-09-05'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    prescriptionId: 399,
    caseId: 99,
    prescriptionDate: '2026-07-15',
    doctorNotes: 'Multivitamin supplement for general health wellness.',
    medicines: [
      {
        itemId: 498,
        prescriptionId: 399,
        medicineName: 'Vitamin D',
        dosage: '60,000 IU',
        frequency: 'Once weekly',
        duration: '4 Weeks',
        instructions: 'After milk'
      }
    ]
  },
  {
    prescriptionId: 401,
    caseId: 101,
    prescriptionDate: '2026-08-20',
    doctorNotes: 'Take immediately on onset of migraine aura.',
    medicines: [
      {
        itemId: 501,
        prescriptionId: 401,
        medicineName: 'Paracetamol 500 mg',
        dosage: '500 mg',
        frequency: 'SOS (When needed)',
        duration: '3 Days',
        instructions: 'With full glass of water'
      }
    ]
  },
  {
    prescriptionId: 402,
    caseId: 102,
    prescriptionDate: '2026-09-10',
    doctorNotes: 'Take antipyretic after food. Complete course of antihistamine.',
    medicines: [
      {
        itemId: 502,
        prescriptionId: 402,
        medicineName: 'Paracetamol 500 mg',
        dosage: '500 mg',
        frequency: '1-1-1 (Thrice daily)',
        duration: '3 Days',
        instructions: 'After food'
      },
      {
        itemId: 503,
        prescriptionId: 402,
        medicineName: 'Cetirizine 10 mg',
        dosage: '10 mg',
        frequency: '0-0-1 (At bedtime)',
        duration: '5 Days',
        instructions: 'May cause drowsiness'
      }
    ]
  },
  {
    prescriptionId: 403,
    caseId: 103,
    prescriptionDate: '2026-08-15',
    doctorNotes: 'Rest and fluid therapy. Report if fever does not subside in 48 hours.',
    medicines: [
      {
        itemId: 504,
        prescriptionId: 403,
        medicineName: 'Tab. Paracetamol 650mg',
        dosage: '650 mg',
        frequency: '1-1-1 (Thrice daily)',
        duration: '3 Days',
        instructions: 'After food'
      },
      {
        itemId: 505,
        prescriptionId: 403,
        medicineName: 'Cetirizine 10 mg',
        dosage: '10 mg',
        frequency: '0-0-1 (At bedtime)',
        duration: '5 Days',
        instructions: 'May cause mild drowsiness'
      }
    ]
  },
  {
    prescriptionId: 404,
    caseId: 104,
    prescriptionDate: '2026-08-20',
    doctorNotes: 'Strict diabetic diet counseling provided. Walking 30 mins daily.',
    medicines: [
      {
        itemId: 507,
        prescriptionId: 404,
        medicineName: 'Tab. Metformin 500mg (Extended Release)',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        duration: '30 Days',
        instructions: 'With meals to minimize GI distress'
      },
      {
        itemId: 508,
        prescriptionId: 404,
        medicineName: 'Cap. Methylcobalamin + Alpha Lipoic Acid',
        dosage: '1 Capsule',
        frequency: '0-1-0 (Afternoon)',
        duration: '30 Days',
        instructions: 'For nerve tingling'
      }
    ]
  },
  {
    prescriptionId: 405,
    caseId: 105,
    prescriptionDate: '2026-09-01',
    doctorNotes: 'Symptomatic antipyretic for pharyngitis.',
    medicines: [
      {
        itemId: 509,
        prescriptionId: 405,
        medicineName: 'Paracetamol 650 mg',
        dosage: '650 mg',
        frequency: '1-0-1 (Twice daily)',
        duration: '3 Days',
        instructions: 'After meals'
      }
    ]
  },
  {
    prescriptionId: 406,
    caseId: 106,
    prescriptionDate: '2026-09-05',
    doctorNotes: 'Analgesic and anti-inflammatory relief.',
    medicines: [
      {
        itemId: 510,
        prescriptionId: 406,
        medicineName: 'Paracetamol 500 mg',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily)',
        duration: '5 Days',
        instructions: 'After food'
      }
    ]
  }
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    followupId: 599,
    caseId: 99,
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-08-15',
    notes: 'General wellbeing and lifestyle review.',
    reason: 'Routine Annual Review',
    status: 'Completed'
  },
  {
    followupId: 601,
    caseId: 101,
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-08-27',
    notes: 'Check headache frequency and screen time reduction.',
    reason: 'Migraine followup',
    status: 'Completed'
  },
  {
    followupId: 602,
    caseId: 102,
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-09-15',
    notes: 'Review symptoms during follow-up.',
    reason: 'Viral Fever Recovery',
    status: 'Upcoming'
  },
  {
    followupId: 603,
    caseId: 103,
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    doctorName: 'Dr. Rajesh Kumar',
    followupDate: '2026-08-18',
    notes: 'Check CBC report and fever remission.',
    reason: 'Pyrexia Review',
    status: 'Completed'
  },
  {
    followupId: 604,
    caseId: 104,
    patientId: 'PAT-1003',
    patientName: 'Vikramaditya Sharma',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-09-20',
    notes: 'Review HbA1c lab report and titrate Metformin dosage.',
    reason: 'Diabetic Glycemic Control',
    status: 'Upcoming'
  },
  {
    followupId: 605,
    caseId: 102,
    patientId: 'PAT-1004',
    patientName: 'Clara Oswald',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-09-10',
    notes: 'Review morning fasting glucose logs.',
    reason: 'Type 2 Diabetes Assessment',
    status: 'Today'
  },
  {
    followupId: 606,
    caseId: 106,
    patientId: 'PAT-1007',
    patientName: 'Amit Shah',
    doctorName: 'Dr. Sarah Jenkins',
    followupDate: '2026-09-08',
    notes: 'Review lumbosacral mobility and tenderness.',
    reason: 'Lumbar Sprain Follow-up',
    status: 'Overdue'
  }
];

export const INITIAL_ROUTINE_CHECKUPS: RoutineCheckup[] = [
  // Rahul Patil - Routine Weekly Checking for Hypertension & Cardiac monitoring
  {
    checkupId: 'CHK-1001-W1',
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    mobile: '9876543210',
    scheduledDate: '2026-08-24',
    actualDate: '2026-08-24',
    weekNumber: 1,
    status: 'Completed',
    vitalSigns: {
      bp: '142/90 mmHg',
      pulse: '84 bpm',
      temp: '98.4 F',
      weight: '78.5 kg',
      bloodSugar: '128 mg/dL',
      spo2: '98%'
    },
    symptomsObserved: 'Slight morning fatigue, chest tightness decreasing on rest.',
    doctorNotes: 'BP slightly elevated. Advised low-sodium DASH diet and continuation of ACE inhibitor.',
    medicinesPrescribed: 'Tab Enalapril 5mg (1-0-1), Tab Aspirin 75mg (0-1-0)',
    missedAlertSent: false
  },
  {
    checkupId: 'CHK-1001-W2',
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    mobile: '9876543210',
    scheduledDate: '2026-08-31',
    actualDate: '2026-08-31',
    weekNumber: 2,
    status: 'Completed',
    vitalSigns: {
      bp: '130/84 mmHg',
      pulse: '76 bpm',
      temp: '98.6 F',
      weight: '78.0 kg',
      bloodSugar: '116 mg/dL',
      spo2: '99%'
    },
    symptomsObserved: 'Substernal pain resolved, sleeping well, mild pedal edema.',
    doctorNotes: 'Remarkable BP control improvement. Continue current regimen. Next checkup scheduled for next Monday.',
    medicinesPrescribed: 'Continue Tab Enalapril 5mg (1-0-1)',
    missedAlertSent: false
  },
  {
    checkupId: 'CHK-1001-W3',
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    mobile: '9876543210',
    scheduledDate: '2026-09-07',
    weekNumber: 3,
    status: 'Missed',
    symptomsObserved: 'Patient did not present to OPD clinic on scheduled Monday checking.',
    doctorNotes: 'Weekly appointment missed. Automated reminder SMS triggered to registered mobile 9876543210.',
    missedAlertSent: true,
    missedAlertSentAt: '2026-09-07 11:30 AM',
    missedAlertMessage: 'Dear Rahul Patil, you missed your scheduled weekly routine checkup on 2026-09-07 at City Hospital. Please visit clinic or contact (022) 2419-8000 immediately to reschedule your cardiac review.'
  },

  // Eleanor Davis - Weekly Post-Op & Vitals Checking
  {
    checkupId: 'CHK-1002-W1',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    mobile: '9823456789',
    scheduledDate: '2026-08-19',
    actualDate: '2026-08-19',
    weekNumber: 1,
    status: 'Completed',
    vitalSigns: {
      bp: '118/76 mmHg',
      pulse: '74 bpm',
      temp: '98.7 F',
      weight: '59 kg',
      spo2: '99%'
    },
    symptomsObserved: 'Surgical incision healing cleanly, no discharge or erythema.',
    doctorNotes: 'Wound dressing changed under sterile conditions. Suture removal scheduled next week.',
    medicinesPrescribed: 'Tab Amoxicillin-Clav 625mg, Tab Paracetamol 650mg PRN',
    missedAlertSent: false
  },
  {
    checkupId: 'CHK-1002-W2',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    mobile: '9823456789',
    scheduledDate: '2026-08-26',
    actualDate: '2026-08-26',
    weekNumber: 2,
    status: 'Completed',
    vitalSigns: {
      bp: '120/78 mmHg',
      pulse: '72 bpm',
      temp: '98.4 F',
      weight: '59.2 kg',
      spo2: '100%'
    },
    symptomsObserved: 'Sutures removed successfully. Good tissue approximation.',
    doctorNotes: 'Post-op recovery excellent. Advised light mobilization.',
    medicinesPrescribed: 'Topical silicone scar gel twice daily',
    missedAlertSent: false
  },
  {
    checkupId: 'CHK-1002-W3',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    mobile: '9823456789',
    scheduledDate: '2026-09-02',
    weekNumber: 3,
    status: 'Missed',
    symptomsObserved: 'Routine 3rd week follow-up check missed by patient.',
    doctorNotes: 'Overdue follow-up checkup. Missing notification dispatched to patient mobile 9823456789.',
    missedAlertSent: true,
    missedAlertSentAt: '2026-09-02 12:15 PM',
    missedAlertMessage: 'Dear Eleanor Davis, you missed your scheduled weekly routine checkup on 2026-09-02 at City Hospital. Please visit clinic or contact (022) 2419-8000 immediately to reschedule.'
  },

  // Clara Oswald - Weekly Diabetes Glycemic Monitoring
  {
    checkupId: 'CHK-1004-W1',
    patientId: 'PAT-1004',
    patientName: 'Clara Oswald',
    mobile: '9123456780',
    scheduledDate: '2026-09-01',
    actualDate: '2026-09-01',
    weekNumber: 1,
    status: 'Completed',
    vitalSigns: {
      bp: '116/74 mmHg',
      pulse: '78 bpm',
      temp: '98.5 F',
      weight: '54.5 kg',
      bloodSugar: '142 mg/dL (Fasting)',
      spo2: '99%'
    },
    symptomsObserved: 'No polyuria or polydipsia. Appetite normal.',
    doctorNotes: 'Baseline blood glucose logged. Initiated lifestyle modification and weekly monitoring.',
    medicinesPrescribed: 'Tab Metformin 500mg once daily with dinner',
    missedAlertSent: false
  },
  {
    checkupId: 'CHK-1004-W2',
    patientId: 'PAT-1004',
    patientName: 'Clara Oswald',
    mobile: '9123456780',
    scheduledDate: '2026-09-08',
    weekNumber: 2,
    status: 'Missed',
    symptomsObserved: 'Weekly fasting sugar check missed.',
    doctorNotes: 'Patient missed scheduled Tuesday glycemic checking. Automatic SMS alert sent.',
    missedAlertSent: true,
    missedAlertSentAt: '2026-09-08 10:45 AM',
    missedAlertMessage: 'Dear Clara Oswald, you missed your scheduled weekly routine checkup on 2026-09-08 at City Hospital. Please visit clinic or contact (022) 2419-8000 to check your blood sugar.'
  },

  // Vikramaditya Sharma - Post-ICU Pulmonary Care
  {
    checkupId: 'CHK-1003-W1',
    patientId: 'PAT-1003',
    patientName: 'Vikramaditya Sharma',
    mobile: '9765432198',
    scheduledDate: '2026-09-04',
    actualDate: '2026-09-04',
    weekNumber: 1,
    status: 'Completed',
    vitalSigns: {
      bp: '128/82 mmHg',
      pulse: '75 bpm',
      temp: '98.6 F',
      weight: '71 kg',
      spo2: '97%'
    },
    symptomsObserved: 'Incentive spirometry volume 1500cc. Mild exertion breathlessness.',
    doctorNotes: 'Chest clear bilaterally. Continue breathing exercises. Next checkup scheduled for Friday 2026-09-11.',
    medicinesPrescribed: 'Budecort Inhaler 200mcg (1 puff BD), Tab Montelukast 10mg HS',
    missedAlertSent: false
  }
];

export const INITIAL_SMS_MESSAGES: SmsMessage[] = [
  {
    smsId: 'SMS-8001',
    patientId: 'PAT-1001',
    patientName: 'Rahul Patil',
    mobileNumber: '9876543210',
    messageType: 'Missed Checkup Alert',
    messageText: 'Dear Rahul Patil, you missed your scheduled weekly routine checkup on 2026-09-07 at City Hospital. Please visit clinic or contact (022) 2419-8000 immediately to reschedule your cardiac review.',
    sentAt: '2026-09-07 11:30 AM',
    status: 'Delivered'
  },
  {
    smsId: 'SMS-8002',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Davis',
    mobileNumber: '9823456789',
    messageType: 'Missed Checkup Alert',
    messageText: 'Dear Eleanor Davis, you missed your scheduled weekly routine checkup on 2026-09-02 at City Hospital. Please visit clinic or contact (022) 2419-8000 immediately to reschedule.',
    sentAt: '2026-09-02 12:15 PM',
    status: 'Delivered'
  },
  {
    smsId: 'SMS-8003',
    patientId: 'PAT-1004',
    patientName: 'Clara Oswald',
    mobileNumber: '9123456780',
    messageType: 'Missed Checkup Alert',
    messageText: 'Dear Clara Oswald, you missed your scheduled weekly routine checkup on 2026-09-08 at City Hospital. Please visit clinic or contact (022) 2419-8000 to check your blood sugar.',
    sentAt: '2026-09-08 10:45 AM',
    status: 'Delivered'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    logId: 1001,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Login',
    tableName: 'users',
    recordId: 'USR-2',
    actionDateTime: '2026-09-10 08:30:15',
    details: 'Doctor authenticated at OPD Terminal 03'
  },
  {
    logId: 1002,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Add Patient',
    tableName: 'patients',
    recordId: 'PAT-1004',
    actionDateTime: '2026-09-10 08:45:22',
    details: 'Registered new outpatient: Clara Oswald (AB-)'
  },
  {
    logId: 1003,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Create Case',
    tableName: 'case_history',
    recordId: 'CASE-102',
    actionDateTime: '2026-09-10 09:12:08',
    details: 'Opened new clinical case for PAT-1001 (Rahul Patil) - Chief Complaint: Fever'
  },
  {
    logId: 1004,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Add Examination',
    tableName: 'examinations',
    recordId: 'EXAM-202',
    actionDateTime: '2026-09-10 09:18:40',
    details: 'Documented vitals: Temp 101.0 F, BP 118/76 mmHg, Pulse 92 bpm, Wt 65 kg'
  },
  {
    logId: 1005,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Add Diagnosis',
    tableName: 'diagnoses',
    recordId: 'DIAG-302',
    actionDateTime: '2026-09-10 09:22:15',
    details: 'Recorded diagnosis: Viral Fever with evening chills'
  },
  {
    logId: 1006,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Add Prescription',
    tableName: 'prescriptions',
    recordId: 'RX-402',
    actionDateTime: '2026-09-10 09:26:05',
    details: 'Prescribed 2 items: Paracetamol 500mg, Cetirizine 10mg'
  },
  {
    logId: 1007,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Add Follow-up',
    tableName: 'follow_ups',
    recordId: 'FOL-602',
    actionDateTime: '2026-09-10 09:28:44',
    details: 'Scheduled follow-up review for PAT-1001 on 2026-09-15'
  },
  {
    logId: 1008,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Upload Document',
    tableName: 'patient_documents',
    recordId: 'DOC-101',
    actionDateTime: '2026-09-10 09:40:19',
    details: 'Uploaded CBC Lab Report for PAT-1001 (Rahul Patil)'
  },
  {
    logId: 1009,
    userId: 1,
    userName: 'System Administrator',
    userRole: 'Admin',
    action: 'Archive Patient',
    tableName: 'patients',
    recordId: 'PAT-1005',
    actionDateTime: '2026-09-10 09:55:00',
    details: 'Moved Deepak Verma (PAT-1005) to soft-delete archive'
  },
  {
    logId: 1010,
    userId: 2,
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Doctor',
    action: 'Generate Report',
    tableName: 'reports',
    recordId: 'REP-ALL',
    actionDateTime: '2026-09-10 10:05:30',
    details: 'Generated complete clinical summary and medicine audit log'
  }
];

export const INITIAL_PATIENT_DOCUMENTS: PatientDocument[] = [
  {
    documentId: 'DOC-101',
    patientId: 'PAT-1001',
    documentName: 'Complete Blood Count (CBC) Differential Report',
    documentType: 'Lab Report',
    documentDate: '2026-09-10',
    description: 'Routine haematology panel for acute pyrexia triage. Platelets 220k, TLC 11,400.',
    filePath: 'records/PAT-1001/CBC_Report_20260910.pdf',
    fileSize: '342 KB',
    uploadedBy: 'Dr. Sarah Jenkins'
  },
  {
    documentId: 'DOC-102',
    patientId: 'PAT-1001',
    documentName: 'Brain MRI Contrast Neuro-imaging Scan',
    documentType: 'Radiology / X-Ray',
    documentDate: '2026-08-20',
    description: 'Neurological evaluation for recurrent migraine episodes. Normal cerebral parenchyma.',
    filePath: 'records/PAT-1001/MRI_Head_20260820.dcm',
    fileSize: '14.2 MB',
    uploadedBy: 'Dr. Sarah Jenkins'
  },
  {
    documentId: 'DOC-103',
    patientId: 'PAT-1002',
    documentName: 'Post-Operative Wound Healing & Discharge Summary',
    documentType: 'Discharge Summary',
    documentDate: '2026-08-26',
    description: 'Surgical incision clean and dry. Sutures removed without infection signs.',
    filePath: 'records/PAT-1002/PostOp_Summary_20260826.pdf',
    fileSize: '850 KB',
    uploadedBy: 'Dr. Rajesh Kumar'
  },
  {
    documentId: 'DOC-104',
    patientId: 'PAT-1003',
    documentName: '12-Lead Electrocardiogram (ECG) Rhythm Strip',
    documentType: 'Lab Report',
    documentDate: '2026-08-19',
    description: 'Bedside rhythm analysis for post-ICU pulmonary recovery patient.',
    filePath: 'records/PAT-1003/ECG_Trace_20260819.pdf',
    fileSize: '1.1 MB',
    uploadedBy: 'Dr. Sarah Jenkins'
  },
  {
    documentId: 'DOC-105',
    patientId: 'PAT-1004',
    documentName: 'HbA1c Glycated Hemoglobin & Fasting Lipid Panel',
    documentType: 'Lab Report',
    documentDate: '2026-09-01',
    description: 'HbA1c 8.4%, Fasting Blood Sugar 158 mg/dL. Baseline diabetic profile.',
    filePath: 'records/PAT-1004/HbA1c_Lipid_20260901.pdf',
    fileSize: '480 KB',
    uploadedBy: 'Dr. Rajesh Kumar'
  }
];

