export interface User {
  userId: number;
  username: string;
  password?: string;
  fullName: string;
  role: 'Admin' | 'Doctor';
  email: string;
}

export interface Patient {
  patientId: string; // e.g. "PAT-1001"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  address: string;
  bloodGroup: string;
  createdAt: string;
  admissionType?: 'OPD' | 'IPD';
  wardId?: string;
  wardName?: string;
  bedNumber?: string;
  admissionDate?: string;
  dischargeDate?: string;
  bedStatus?: 'Allocated' | 'Discharged' | 'None';
  status?: 'ACTIVE' | 'ARCHIVED';
  emergencyNotes?: string;
  allergiesSummary?: string;
  hasRoutineCheckup?: boolean;
  checkupFrequency?: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  routineCondition?: string;
  preferredDay?: string;
  nextCheckupDate?: string;
  lastCheckupDate?: string;
}

export interface Ward {
  wardId: string; // e.g. "WARD-ICU"
  wardName: string; // e.g. "Intensive Care Unit (ICU)"
  category: 'General' | 'ICU' | 'Emergency' | 'Pediatric' | 'Maternity' | 'Private';
  totalBeds: number;
  floor: string;
  nurseInCharge: string;
  contactExt: string;
  dailyRate: number;
  description: string;
}

export interface Bed {
  bedId: string; // e.g. "BED-ICU-01"
  bedNumber: string; // e.g. "ICU-01"
  wardId: string;
  wardName: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  admittingDoctor?: string;
  oxygenSupported: boolean;
  ventilatorAvailable: boolean;
}

export interface BedAllocation {
  allocationId: number;
  patientId: string;
  patientName: string;
  wardId: string;
  wardName: string;
  bedNumber: string;
  allocatedDate: string;
  dischargeDate?: string;
  status: 'Active' | 'Discharged';
  notes?: string;
}

export interface CaseHistory {
  caseId: number;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  symptoms: string;
  duration: string;
  pastHistory: string;
  allergy: string;
  familyHistory: string;
  currentMedication: string;
  doctorId: number;
  doctorName?: string;
  caseStatus?: 'Open' | 'Under Treatment' | 'Follow-up Required' | 'Completed' | 'Cancelled';
  doctorNotes?: string;
  followupInstructions?: string;
  handoverNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Examination {
  examId: number;
  caseId: number;
  temperature: string; // e.g. "98.6 F"
  bloodPressure: string; // e.g. "120/80 mmHg"
  pulseRate: string; // e.g. "72 bpm"
  weight: string; // e.g. "68 kg"
  height: string; // e.g. "172 cm"
  observation: string;
}

export interface Diagnosis {
  diagnosisId: number;
  caseId: number;
  diagnosisText: string;
  doctorNotes: string;
  diagnosisDate: string;
}

export interface PrescriptionMedicine {
  itemId: number;
  prescriptionId: number;
  medicineName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1 (Twice daily)"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "After food"
}

export interface Prescription {
  prescriptionId: number;
  caseId: number;
  prescriptionDate: string;
  doctorNotes: string;
  medicines: PrescriptionMedicine[];
  createdAt?: string;
}

export interface FollowUp {
  followupId: number;
  caseId: number;
  patientId?: string;
  patientName?: string;
  doctorName?: string;
  followupDate: string;
  notes: string;
  reason?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Missed' | 'Today' | 'Upcoming' | 'Overdue';
}

export interface CompleteCaseRecord {
  caseHistory: CaseHistory;
  examination?: Examination;
  diagnosis?: Diagnosis;
  prescription?: Prescription;
  followUp?: FollowUp;
}

export interface AuditLog {
  logId: number;
  userId: number;
  userName: string;
  userRole: 'Admin' | 'Doctor';
  action: string;
  tableName: string;
  recordId: string;
  actionDateTime: string;
  details?: string;
}

export interface PatientDocument {
  documentId: string; // e.g. "DOC-101"
  patientId: string;
  documentName: string;
  documentType: 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'Radiology / X-Ray' | 'Other Document';
  documentDate: string;
  description: string;
  filePath: string;
  fileSize?: string;
  uploadedBy?: string;
}

export interface RoutineCheckup {
  checkupId: string; // e.g. "CHK-1001-W1"
  patientId: string;
  patientName: string;
  mobile: string;
  scheduledDate: string; // YYYY-MM-DD
  actualDate?: string; // YYYY-MM-DD
  weekNumber: number; // 1, 2, 3...
  status: 'Completed' | 'Scheduled' | 'Missed' | 'Rescheduled';
  vitalSigns?: {
    bp: string;
    pulse: string;
    temp: string;
    weight: string;
    bloodSugar?: string;
    spo2?: string;
  };
  symptomsObserved?: string;
  doctorNotes?: string;
  medicinesPrescribed?: string;
  missedAlertSent: boolean;
  missedAlertSentAt?: string;
  missedAlertMessage?: string;
}

export interface SmsMessage {
  smsId: string;
  patientId: string;
  patientName: string;
  mobileNumber: string;
  messageType: 'Missed Checkup Alert' | 'Routine Checkup Reminder';
  messageText: string;
  sentAt: string;
  status: 'Delivered' | 'Sent';
}

