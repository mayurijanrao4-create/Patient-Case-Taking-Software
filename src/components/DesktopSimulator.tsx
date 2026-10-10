import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Patient,
  CaseHistory,
  Examination,
  Diagnosis,
  Prescription,
  FollowUp,
  PrescriptionMedicine,
  Ward,
  Bed,
  RoutineCheckup,
  SmsMessage,
  AuditLog,
  PatientDocument
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_CASES,
  INITIAL_EXAMINATIONS,
  INITIAL_DIAGNOSES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_FOLLOWUPS,
  INITIAL_WARDS,
  INITIAL_BEDS,
  INITIAL_ROUTINE_CHECKUPS,
  INITIAL_SMS_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_PATIENT_DOCUMENTS
} from '../data/initialData';
import { WardBedManagement } from './WardBedManagement';
import { RoutineCheckupManagement } from './RoutineCheckupManagement';
import { PatientTimeline } from './PatientTimeline';
import { VisitComparison } from './VisitComparison';
import { FollowUpManagement } from './FollowUpManagement';
import { MedicineSearch } from './MedicineSearch';
import { AuditLogView } from './AuditLogView';
import { PatientDocumentsView } from './PatientDocumentsView';
import { PatientQrCodeModal } from './PatientQrCodeModal';
import { EmergencyQuickViewModal } from './EmergencyQuickViewModal';
import { DatabaseStatusModal } from './DatabaseStatusModal';
import { generatePatientRecordPdf, generateHospitalAnalyticsReportPdf } from '../utils/pdfGenerator';
import {
  Stethoscope,
  UserPlus,
  Users,
  Search,
  FileText,
  Activity,
  Calendar,
  Pill,
  BarChart3,
  LogOut,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Bed as BedIcon,
  Smartphone,
  Monitor,
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  Maximize2,
  Wifi,
  Battery,
  Signal,
  FileDown,
  Bell,
  Clock,
  Send,
  MessageSquare,
  QrCode,
  AlertOctagon,
  Heart,
  RotateCcw,
  Archive,
  GitCompare,
  FolderOpen,
  Edit3,
  Lock,
  HelpCircle,
  Info,
  X,
  Zap
} from 'lucide-react';

export type ModuleType =
  | 'dashboard'
  | 'register'
  | 'manage'
  | 'wards'
  | 'search'
  | 'new_case'
  | 'history'
  | 'timeline'
  | 'comparison'
  | 'followups'
  | 'medicines'
  | 'documents'
  | 'audit_log'
  | 'reports'
  | 'database'
  | 'routine_sms';

interface FrameWrapperProps {
  deviceMode: 'desktop' | 'iphone' | 'fluid';
  currentUser: User | null;
  beds: Bed[];
  activeModule: ModuleType;
  setActiveModule: (m: ModuleType) => void;
  children: React.ReactNode;
}

const FrameWrapper: React.FC<FrameWrapperProps> = ({
  deviceMode,
  currentUser,
  beds,
  activeModule,
  setActiveModule,
  children
}) => {
  if (deviceMode === 'iphone') {
    return (
      <div className="py-2 sm:py-8 px-1 sm:px-2 bg-slate-950 flex-1 flex flex-col items-center justify-center min-h-0 w-full">
        {/* iPhone 15 Pro Hardware Frame */}
        <div className="w-full max-w-[420px] rounded-2xl sm:rounded-[52px] p-2 sm:p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl border-2 sm:border-4 border-slate-600/80 relative ring-1 ring-slate-500/30">
          {/* Screen Viewport */}
          <div className="rounded-xl sm:rounded-[40px] overflow-hidden bg-slate-100 flex flex-col h-[calc(100vh-200px)] sm:h-[780px] max-h-[820px] shadow-inner relative border border-slate-950/40">
            {/* Dynamic Island & iOS Status Bar */}
            <div className="bg-slate-900 text-white pt-2.5 px-6 pb-2 select-none relative z-30">
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-tight">
                <span>9:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-between px-2.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <div className="flex items-center gap-0.5">
                    <Battery className="w-3.5 h-3.5 text-white" />
                    <span className="text-[9px]">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Hospital Mini Header */}
            <div className="bg-slate-800 text-white px-3.5 py-2 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-500 text-slate-950 rounded-md">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Patient Case-Taking</h3>
                  <p className="text-[10px] text-sky-200">
                    {currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Hospital Portal'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModule('wards')}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
              >
                <BedIcon className="w-2.5 h-2.5" />
                <span>{beds.filter((b) => b.status === 'Available').length} Beds</span>
              </button>
            </div>

            {/* Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              {children}
            </main>

            {/* iOS Mobile Bottom Navigation Bar */}
            <div className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] select-none z-30">
              <button
                onClick={() => setActiveModule('dashboard')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
                  activeModule === 'dashboard' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dash</span>
              </button>
              <button
                onClick={() => setActiveModule('wards')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium relative transition ${
                  activeModule === 'wards' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BedIcon className="w-4 h-4" />
                <span>Beds</span>
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
              <button
                onClick={() => setActiveModule('register')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
                  activeModule === 'register' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
              <button
                onClick={() => setActiveModule('manage')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
                  activeModule === 'manage' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Patients</span>
              </button>
              <button
                onClick={() => setActiveModule('new_case')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
                  activeModule === 'new_case' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>+ Case</span>
              </button>
              <button
                onClick={() => setActiveModule('routine_sms')}
                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded font-medium relative transition ${
                  activeModule === 'routine_sms' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Routine</span>
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="bg-slate-900 pb-1.5 pt-0.5">
              <div className="w-28 h-1 bg-slate-500/60 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center max-w-md text-xs text-slate-400">
          <p className="font-semibold text-slate-300">iPhone 15 Pro Mobile Viewport</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Simulating iOS handheld clinical rounds. Ward bed availability, allocation during registration, and case taking operate with full touch-friendly ergonomics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl w-full mx-auto pb-20 sm:pb-8 overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar for touchscreens / small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] select-none z-40 shadow-lg">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
            activeModule === 'dashboard' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dash</span>
        </button>
        <button
          onClick={() => setActiveModule('wards')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium relative transition ${
            activeModule === 'wards' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BedIcon className="w-4 h-4" />
          <span>Beds</span>
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
        <button
          onClick={() => setActiveModule('register')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
            activeModule === 'register' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Register</span>
        </button>
        <button
          onClick={() => setActiveModule('manage')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
            activeModule === 'manage' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patients</span>
        </button>
        <button
          onClick={() => setActiveModule('new_case')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium transition ${
            activeModule === 'new_case' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>+ Case</span>
        </button>
        <button
          onClick={() => setActiveModule('routine_sms')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded font-medium relative transition ${
            activeModule === 'routine_sms' ? 'text-sky-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Routine</span>
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>
      </div>
    </>
  );
};

interface Props {
  onSwitchToCode: (filePath?: string) => void;
}

export const DesktopSimulator: React.FC<Props> = ({ onSwitchToCode }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]); // Dr. Sarah Jenkins logged in by default for instant preview
  const [loginUsername, setLoginUsername] = useState('doctor');
  const [loginPassword, setLoginPassword] = useState('doctor123');
  const [loginRole, setLoginRole] = useState<UserRole>('Doctor');

  // Role-Based Access Control (RBAC) Permissions:
  // Available Roles: Doctor, Nurse, Receptionist, Admin
  const currentRole: UserRole = currentUser?.role || 'Doctor';
  const isDoctor = currentRole === 'Doctor' || currentRole === 'Admin';
  const isNurse = currentRole === 'Nurse';
  const isReceptionist = currentRole === 'Receptionist';

  // Specific Role Permissions:
  // Doctor:
  // - Can view patient details & case history
  // - Can manage examination details, diagnosis, prescriptions, follow-up
  // Nurse:
  // - Can view relevant patient info & case history
  // - Can update information required for nursing work (vitals, observations, routine checkups, ward notes)
  // - Cannot edit diagnosis (read-only)
  // - Cannot edit prescriptions (read-only)
  // - Cannot edit other doctor-only clinical information
  // Receptionist:
  // - Can manage patient registration & view/update basic demographic info
  // - Can manage appointment/registration-related information
  // - Cannot edit examination, diagnosis or prescription information
  const canManageRegistration = isReceptionist || isDoctor;
  const canEditDemographics = true; // All authenticated hospital roles can view and update basic demographic info
  const canManageExamination = isDoctor || isNurse; // Nurse manages nursing vitals/survey; Receptionist cannot
  const canManageDiagnosis = isDoctor; // Doctor only; Nurse & Receptionist read-only
  const canManagePrescription = isDoctor; // Doctor only; Nurse & Receptionist read-only
  const canManageFollowUp = isDoctor || isNurse || isReceptionist; // Follow-up dates/appointments
  const canManageClinicalEncounter = isDoctor || isNurse; // Clinical case entry

  const handleSelectRolePreset = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'Doctor') {
      setLoginUsername('doctor');
      setLoginPassword('doctor123');
    } else if (role === 'Nurse') {
      setLoginUsername('nurse');
      setLoginPassword('nurse123');
    } else if (role === 'Receptionist') {
      setLoginUsername('receptionist');
      setLoginPassword('recep123');
    } else if (role === 'Admin') {
      setLoginUsername('admin');
      setLoginPassword('admin123');
    }
  };

  // Device Display Mode (Desktop Workstation, iPhone 15 Pro, Fluid Responsive)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'iphone' | 'fluid'>('fluid');

  // Active module
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [activeNavDropdown, setActiveNavDropdown] = useState<'patients' | 'clinical' | 'system' | null>(null);

  // Database State (In-Memory JDBC Simulation)
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [wards, setWards] = useState<Ward[]>(INITIAL_WARDS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [cases, setCases] = useState<CaseHistory[]>(INITIAL_CASES);
  const [examinations, setExaminations] = useState<Examination[]>(INITIAL_EXAMINATIONS);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(INITIAL_DIAGNOSES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [followups, setFollowups] = useState<FollowUp[]>(INITIAL_FOLLOWUPS);
  const [routineCheckups, setRoutineCheckups] = useState<RoutineCheckup[]>(INITIAL_ROUTINE_CHECKUPS);
  const [smsLogs, setSmsLogs] = useState<SmsMessage[]>(INITIAL_SMS_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [patientDocuments, setPatientDocuments] = useState<PatientDocument[]>(INITIAL_PATIENT_DOCUMENTS);

  // New Modals and Comparison State
  const [comparisonCase1, setComparisonCase1] = useState<number | null>(null);
  const [comparisonCase2, setComparisonCase2] = useState<number | null>(null);
  const [emergencyPatient, setEmergencyPatient] = useState<Patient | null>(null);
  const [qrPatient, setQrPatient] = useState<Patient | null>(null);
  const [isDbStatusOpen, setIsDbStatusOpen] = useState<boolean>(false);
  const [patientArchiveFilter, setPatientArchiveFilter] = useState<'ACTIVE' | 'ARCHIVED' | 'ALL'>('ACTIVE');

  // User-Friendly Notification Toasts
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }>>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User-Friendly Global Spotlight Search & Help Modals
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K or / for search, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''))) {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsHelpOpen(false);
        setIsRoleSwitcherOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audit Log recording helper
  const logAuditEvent = (
    action: string,
    tableName: string,
    recordId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      logId: auditLogs.length + 1,
      userId: currentUser ? currentUser.userId : 2,
      userName: currentUser?.fullName || 'Dr. Sarah Jenkins',
      userRole: (currentUser?.role as any) || 'Doctor',
      action,
      tableName,
      recordId,
      actionDateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateFollowUp = (followupId: number, updates: Partial<FollowUp>) => {
    setFollowups((prev) =>
      prev.map((f) => (f.followupId === followupId ? { ...f, ...updates } : f))
    );
    logAuditEvent(
      'UPDATE_FOLLOWUP',
      'follow_ups',
      String(followupId),
      `Updated clinical follow-up #${followupId}: ${JSON.stringify(updates)}`
    );
    showJOptionPane('Follow-up Updated', `Follow-up #${followupId} successfully updated.`, 'info');
  };

  const handleSendSmsReminder = (patient: Patient, followUp: FollowUp) => {
    const newSms: SmsMessage = {
      smsId: `SMS-${Date.now()}`,
      patientId: patient.patientId,
      patientName: patient.name,
      mobileNumber: patient.mobile,
      messageType: 'Routine Checkup Reminder',
      messageText: `Dear ${patient.name}, this is an automated reminder for your clinical follow-up on ${followUp.followupDate} at City Healthcare Memorial Hospital. Contact (022) 2419-8000 for inquiries.`,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Delivered'
    };
    setSmsLogs((prev) => [newSms, ...prev]);
    logAuditEvent(
      'DISPATCH_SMS',
      'sms_delivery_logs',
      newSms.smsId,
      `Dispatched SMS reminder to ${patient.mobile} for follow-up #${followUp.followupId}`
    );
    showJOptionPane('SMS Reminder Sent', `SMS reminder dispatched to ${patient.name} (${patient.mobile}).`, 'info');
  };

  const handleUploadDocument = (doc: PatientDocument) => {
    setPatientDocuments((prev) => [doc, ...prev]);
    logAuditEvent(
      'UPLOAD_DOCUMENT',
      'patient_documents',
      String(doc.documentId),
      `Attached ${doc.documentType} "${doc.documentName}" for patient ${doc.patientId}`
    );
    showJOptionPane('Document Attached', `Document "${doc.documentName}" added to patient file repository.`, 'info');
  };

  // Modal / JOptionPane Message Dialog
  const [modalDialog, setModalDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showJOptionPane = (title: string, message: string, type: 'info' | 'warning' | 'error') => {
    setModalDialog({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setModalDialog({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    });
  };

  // ----------------------------------------------------
  // MODULE 1: LOGIN FORM LOGIC
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_USERS.find(
      (u) => u.username === loginUsername.trim() && u.password === loginPassword && u.role === loginRole
    );
    if (found) {
      setCurrentUser(found);
      setActiveModule('dashboard');
      logAuditEvent(
        'LOGIN',
        'users',
        String(found.userId),
        `Staff login successful: ${found.fullName} (${found.role})`
      );
      showJOptionPane('Login Successful', `Welcome, ${found.fullName}!\nAuthenticated Role: ${found.role}`, 'info');
    } else {
      showJOptionPane('Authentication Failed', `Invalid username, password, or role combination for '${loginUsername.trim()}'. Please verify that the selected role matches this staff account.`, 'error');
    }
  };

  const handleLogout = () => {
    showConfirmDialog('Confirm Logout', 'Are you sure you want to end this session and return to Login Screen?', () => {
      setCurrentUser(null);
      setActiveModule('dashboard');
      setModalDialog((prev) => ({ ...prev, isOpen: false }));
    });
  };

  // ----------------------------------------------------
  // MODULE 2: PATIENT REGISTRATION FORM STATE & HANDLERS
  // ----------------------------------------------------
  const [regPatientId, setRegPatientId] = useState('PAT-1005');
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regMobile, setRegMobile] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState('Select');

  // Inpatient & Ward Bed Allocation Fields
  const [regAdmissionType, setRegAdmissionType] = useState<'OPD' | 'IPD'>('OPD');
  const [regWardId, setRegWardId] = useState<string>('WARD-GWM');
  const [regBedId, setRegBedId] = useState<string>('BED-GWM-02');
  const [regAdmissionReason, setRegAdmissionReason] = useState<string>('');

  // Routine Weekly Checking Enrollment Fields
  const [regHasRoutineCheckup, setRegHasRoutineCheckup] = useState<boolean>(true);
  const [regCheckupFrequency, setRegCheckupFrequency] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly'>('Weekly');
  const [regRoutineCondition, setRegRoutineCondition] = useState<string>('General Clinical Review & Vitals');
  const [regPreferredDay, setRegPreferredDay] = useState<string>('Monday');

  // ----------------------------------------------------
  // BED MANAGEMENT & ALLOCATION HANDLERS
  // ----------------------------------------------------
  const handleAllocateBed = (bedId: string, patientId: string) => {
    const patient = patients.find((p) => p.patientId === patientId);
    const targetBed = beds.find((b) => b.bedId === bedId);
    if (!patient || !targetBed) return;
    const today = new Date().toISOString().split('T')[0];

    setBeds(
      beds.map((b) =>
        b.bedId === bedId
          ? {
              ...b,
              status: 'Occupied',
              patientId: patient.patientId,
              patientName: patient.name,
              admissionDate: today,
              admittingDoctor: currentUser?.fullName || 'Attending Doctor'
            }
          : b
      )
    );

    setPatients(
      patients.map((p) =>
        p.patientId === patientId
          ? {
              ...p,
              admissionType: 'IPD',
              wardId: targetBed.wardId,
              wardName: targetBed.wardName,
              bedNumber: targetBed.bedNumber,
              admissionDate: today,
              bedStatus: 'Allocated'
            }
          : p
      )
    );

    showJOptionPane(
      'Bed Allocated',
      `Patient ${patient.name} (${patient.patientId}) has been successfully admitted to Bed ${targetBed.bedNumber} in ${targetBed.wardName}.`,
      'info'
    );
  };

  const handleVacateBed = (bedId: string) => {
    const bed = beds.find((b) => b.bedId === bedId);
    if (!bed) return;
    showConfirmDialog(
      'Confirm Patient Discharge',
      `Are you sure you want to discharge patient "${bed.patientName || ''}" and vacate Bed ${bed.bedNumber} (${bed.wardName})? The bed will be marked for sanitization.`,
      () => {
        const today = new Date().toISOString().split('T')[0];
        setBeds(
          beds.map((b) =>
            b.bedId === bedId
              ? {
                  ...b,
                  status: 'Cleaning',
                  patientId: undefined,
                  patientName: undefined,
                  admissionDate: undefined,
                  admittingDoctor: undefined
                }
              : b
          )
        );

        if (bed.patientId) {
          setPatients(
            patients.map((p) =>
              p.patientId === bed.patientId
                ? {
                    ...p,
                    bedStatus: 'Discharged',
                    dischargeDate: today
                  }
                : p
            )
          );
        }

        setModalDialog((prev) => ({ ...prev, isOpen: false }));
        showJOptionPane(
          'Discharge Completed',
          `Bed ${bed.bedNumber} has been vacated and transferred to Housekeeping for sanitization.`,
          'info'
        );
      }
    );
  };

  const handleTransferBed = (currentBedId: string, targetBedId: string) => {
    const sourceBed = beds.find((b) => b.bedId === currentBedId);
    const targetBed = beds.find((b) => b.bedId === targetBedId);
    if (!sourceBed || !targetBed) return;
    const today = new Date().toISOString().split('T')[0];

    setBeds(
      beds.map((b) => {
        if (b.bedId === currentBedId) {
          return {
            ...b,
            status: 'Cleaning',
            patientId: undefined,
            patientName: undefined,
            admissionDate: undefined,
            admittingDoctor: undefined
          };
        }
        if (b.bedId === targetBedId) {
          return {
            ...b,
            status: 'Occupied',
            patientId: sourceBed.patientId,
            patientName: sourceBed.patientName,
            admissionDate: sourceBed.admissionDate || today,
            admittingDoctor: sourceBed.admittingDoctor
          };
        }
        return b;
      })
    );

    if (sourceBed.patientId) {
      setPatients(
        patients.map((p) =>
          p.patientId === sourceBed.patientId
            ? {
                ...p,
                wardId: targetBed.wardId,
                wardName: targetBed.wardName,
                bedNumber: targetBed.bedNumber
              }
            : p
        )
      );
    }

    showJOptionPane(
      'Patient Transferred',
      `Patient ${sourceBed.patientName} was transferred from Bed ${sourceBed.bedNumber} to Bed ${targetBed.bedNumber} (${targetBed.wardName}).`,
      'info'
    );
  };

  const handleSetBedStatus = (
    bedId: string,
    status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance'
  ) => {
    setBeds(beds.map((b) => (b.bedId === bedId ? { ...b, status } : b)));
    showJOptionPane('Bed Status Updated', `Bed status updated to ${status}.`, 'info');
  };

  const handleNavigateToRegister = (preWardId?: string, preBedId?: string) => {
    if (preWardId) {
      setRegAdmissionType('IPD');
      setRegWardId(preWardId);
      if (preBedId) {
        setRegBedId(preBedId);
      } else {
        const firstAvail = beds.find((b) => b.wardId === preWardId && b.status === 'Available');
        if (firstAvail) setRegBedId(firstAvail.bedId);
      }
    }
    setActiveModule('register');
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation 1: Empty Fields
    if (!regPatientId.trim()) {
      showJOptionPane('Validation Error', 'Patient ID cannot be empty!', 'warning');
      return;
    }
    if (!regName.trim()) {
      showJOptionPane('Validation Error', 'Patient Full Name cannot be empty!', 'warning');
      return;
    }
    if (!regAddress.trim()) {
      showJOptionPane('Validation Error', 'Patient Residential Address cannot be empty!', 'warning');
      return;
    }

    // Validation 2: Duplicate ID
    if (patients.some((p) => p.patientId.toLowerCase() === regPatientId.trim().toLowerCase())) {
      showJOptionPane('Validation Error', `Duplicate Patient ID: '${regPatientId}' is already registered in the system!`, 'error');
      return;
    }

    // Validation 3: Age check
    const ageNum = parseInt(regAge, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      showJOptionPane('Validation Error', 'Invalid Age! Age must be a positive integer between 1 and 125.', 'warning');
      return;
    }

    // Validation 4: 10-digit mobile number check
    if (!/^[0-9]{10}$/.test(regMobile.trim())) {
      showJOptionPane('Validation Error', 'Invalid Mobile Number! Mobile number must be exactly 10 numeric digits.', 'warning');
      return;
    }

    // Validation 5: Blood group
    if (regBloodGroup === 'Select') {
      showJOptionPane('Validation Error', 'Please select a valid Blood Group for the patient record.', 'warning');
      return;
    }

    // Inpatient Bed Allocation Validation
    let allocatedBedInfo: Bed | undefined;
    const todayStr = new Date().toISOString().split('T')[0];

    if (regAdmissionType === 'IPD') {
      if (!regBedId) {
        showJOptionPane('Bed Selection Required', 'Please select an available bed for Inpatient (IPD) admission!', 'warning');
        return;
      }
      allocatedBedInfo = beds.find((b) => b.bedId === regBedId);
      if (!allocatedBedInfo || allocatedBedInfo.status !== 'Available') {
        showJOptionPane('Bed Unavailable', 'The selected bed is no longer vacant. Please select another available bed.', 'warning');
        return;
      }
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const newPatient: Patient = {
      patientId: regPatientId.trim(),
      name: regName.trim(),
      age: ageNum,
      gender: regGender,
      mobile: regMobile.trim(),
      address: regAddress.trim(),
      bloodGroup: regBloodGroup,
      createdAt: todayStr,
      admissionType: regAdmissionType,
      wardId: allocatedBedInfo ? allocatedBedInfo.wardId : undefined,
      wardName: allocatedBedInfo ? allocatedBedInfo.wardName : undefined,
      bedNumber: allocatedBedInfo ? allocatedBedInfo.bedNumber : undefined,
      admissionDate: allocatedBedInfo ? todayStr : undefined,
      bedStatus: allocatedBedInfo ? 'Allocated' : 'None',
      hasRoutineCheckup: regHasRoutineCheckup,
      checkupFrequency: regCheckupFrequency,
      routineCondition: regRoutineCondition,
      preferredDay: regPreferredDay,
      nextCheckupDate: regHasRoutineCheckup ? nextDateStr : undefined
    };

    // If enrolled in routine weekly checking, schedule Week 1 checkup
    if (regHasRoutineCheckup) {
      const firstCheckup: RoutineCheckup = {
        checkupId: `CHK-${newPatient.patientId.replace('PAT-', '')}-W1`,
        patientId: newPatient.patientId,
        patientName: newPatient.name,
        mobile: newPatient.mobile,
        scheduledDate: nextDateStr,
        weekNumber: 1,
        status: 'Scheduled',
        symptomsObserved: `Scheduled ${regCheckupFrequency} routine checking evaluation.`,
        doctorNotes: `Monitoring condition: ${regRoutineCondition}. Reminder SMS active on registered mobile ${newPatient.mobile}.`,
        missedAlertSent: false
      };
      setRoutineCheckups((prev) => [firstCheckup, ...prev]);
    }

    // If bed allocated, update bed status in MySQL in-memory table
    if (allocatedBedInfo) {
      setBeds(
        beds.map((b) =>
          b.bedId === allocatedBedInfo!.bedId
            ? {
                ...b,
                status: 'Occupied',
                patientId: newPatient.patientId,
                patientName: newPatient.name,
                admissionDate: todayStr,
                admittingDoctor: currentUser?.fullName || 'Dr. Sarah Jenkins'
              }
            : b
        )
      );
    }

    setPatients([newPatient, ...patients]);

    const successMessage =
      regAdmissionType === 'IPD' && allocatedBedInfo
        ? `Patient "${newPatient.name}" (${newPatient.patientId}) was registered and admitted to ${allocatedBedInfo.wardName} (Bed ${allocatedBedInfo.bedNumber}) successfully!`
        : `Patient "${newPatient.name}" (${newPatient.patientId}) was registered successfully as Outpatient (OPD)!`;

    showJOptionPane('Registration & Admission Confirmed', successMessage, 'info');

    // Reset Form
    setRegPatientId(`PAT-${1000 + patients.length + 2}`);
    setRegName('');
    setRegAge('');
    setRegMobile('');
    setRegAddress('');
    setRegBloodGroup('Select');
    setRegGender('Male');
    setRegAdmissionReason('');
    setRegAdmissionType('OPD');
  };

  const handleFillDemoPatient = () => {
    const demoProfiles = [
      { name: 'Dr. Vikram Malhotra', age: '38', gender: 'Male' as const, blood: 'B+', mobile: '9820145672', address: 'B-402 Whispering Palms, Bandra West, Mumbai', condition: 'Essential Hypertension' },
      { name: 'Ananya Deshmukh', age: '29', gender: 'Female' as const, blood: 'O+', mobile: '9833412567', address: 'Flat 12, Gulmohar Enclave, Shivaji Park, Mumbai', condition: 'Type 1 Diabetes Mellitus' },
      { name: 'Rajesh Nair', age: '54', gender: 'Male' as const, blood: 'A+', mobile: '9845012389', address: '18 Seaside Villa, Worli Sea Face, Mumbai', condition: 'Post-CABG Cardiac Rehab' },
      { name: 'Pooja Sundaram', age: '41', gender: 'Female' as const, blood: 'AB+', mobile: '9876541230', address: '701 Green Meadows, Powai, Mumbai', condition: 'Bronchial Asthma' }
    ];
    const pick = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];
    const nextId = `PAT-${1000 + patients.length + 1}`;
    setRegPatientId(nextId);
    setRegName(pick.name);
    setRegAge(pick.age);
    setRegGender(pick.gender);
    setRegBloodGroup(pick.blood);
    setRegMobile(pick.mobile);
    setRegAddress(pick.address);
    setRegAdmissionType('IPD');
    setRegAdmissionReason(`Admitted for clinical monitoring and evaluation of ${pick.condition}`);
    setRegHasRoutineCheckup(true);
    setRegCheckupFrequency('Weekly');
    setRegPreferredDay('Monday');
    setRegRoutineCondition(pick.condition);
    showToast(`Sample profile for "${pick.name}" filled! Ready to save to database.`, 'info');
  };

  // ----------------------------------------------------
  // MODULE 3: PATIENT MANAGEMENT & SEARCH STATE
  // ----------------------------------------------------
  const [managementSearchQuery, setManagementSearchQuery] = useState('');
  const [managementSearchType, setManagementSearchType] = useState<'All' | 'Patient ID' | 'Name' | 'Mobile'>('All');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('PAT-1001');
  const [reportsSelectedPatientId, setReportsSelectedPatientId] = useState<string>('PAT-1001');

  const filteredPatients = patients.filter((p) => {
    // Soft Delete / Archive filtering
    const isArchived = p.status === 'ARCHIVED';
    if (patientArchiveFilter === 'ACTIVE' && isArchived) return false;
    if (patientArchiveFilter === 'ARCHIVED' && !isArchived) return false;

    if (!managementSearchQuery.trim()) return true;
    const q = managementSearchQuery.trim().toLowerCase();
    if (managementSearchType === 'Patient ID') return p.patientId.toLowerCase().includes(q);
    if (managementSearchType === 'Name') return p.name.toLowerCase().includes(q);
    if (managementSearchType === 'Mobile') return p.mobile.includes(q);
    return (
      p.patientId.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.mobile.includes(q) ||
      p.bloodGroup.toLowerCase().includes(q)
    );
  });

  const handleArchivePatient = (patientId: string) => {
    showConfirmDialog(
      'Archive Patient Record',
      `Move Patient ${patientId} to the Archive / Trash bin? The record will be hidden from routine lists but can be restored anytime.`,
      () => {
        setPatients((prev) =>
          prev.map((p) => (p.patientId === patientId ? { ...p, status: 'ARCHIVED' } : p))
        );
        logAuditEvent('Archive Patient', 'patients', patientId, `Soft-deleted/archived patient ${patientId}`);
        setModalDialog((prev) => ({ ...prev, isOpen: false }));
        showJOptionPane('Patient Archived', `Patient ${patientId} has been moved to Archives.`, 'info');
      }
    );
  };

  const handleRestorePatient = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.patientId === patientId ? { ...p, status: 'ACTIVE' } : p))
    );
    logAuditEvent('Restore Patient', 'patients', patientId, `Restored archived patient ${patientId}`);
    showJOptionPane('Patient Restored', `Patient ${patientId} has been restored to Active status.`, 'info');
  };

  const handleDeletePatient = (patientId: string) => {
    showConfirmDialog(
      'Confirm Permanent Deletion',
      `Are you sure you want to permanently delete Patient ${patientId}? This will delete all associated multi-visit case histories, examinations, diagnoses, and prescriptions via CASCADE!`,
      () => {
        setPatients(patients.filter((p) => p.patientId !== patientId));
        setCases(cases.filter((c) => c.patientId !== patientId));
        if (selectedPatientId === patientId) {
          setSelectedPatientId(patients[0]?.patientId || null);
        }
        logAuditEvent('Delete Patient', 'patients', patientId, `Permanently deleted patient ${patientId}`);
        setModalDialog((prev) => ({ ...prev, isOpen: false }));
        showJOptionPane('Record Deleted', `Patient ${patientId} and all child records were deleted.`, 'info');
      }
    );
  };

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleStartEditPatient = (p: Patient) => {
    setEditingPatient({ ...p });
  };

  const handleSaveEditedPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    if (!editingPatient.name.trim()) {
      showJOptionPane('Validation Error', 'Patient Full Name cannot be empty!', 'warning');
      return;
    }
    if (!editingPatient.address.trim()) {
      showJOptionPane('Validation Error', 'Residential Address cannot be empty!', 'warning');
      return;
    }
    if (!editingPatient.mobile.trim()) {
      showJOptionPane('Validation Error', 'Mobile Number cannot be empty!', 'warning');
      return;
    }

    const updatedPatient: Patient = {
      ...editingPatient,
      age: Number(editingPatient.age) || 0
    };

    // Update patient record in state (in-place update, NO duplicate created)
    setPatients((prev) =>
      prev.map((p) => (p.patientId === updatedPatient.patientId ? updatedPatient : p))
    );

    // Synchronize references across Beds, Checkups, Follow-ups
    setBeds((prev) =>
      prev.map((b) =>
        b.patientId === updatedPatient.patientId ? { ...b, patientName: updatedPatient.name } : b
      )
    );
    setRoutineCheckups((prev) =>
      prev.map((c) =>
        c.patientId === updatedPatient.patientId
          ? { ...c, patientName: updatedPatient.name, mobile: updatedPatient.mobile }
          : c
      )
    );
    setFollowups((prev) =>
      prev.map((f) =>
        f.patientId === updatedPatient.patientId ? { ...f, patientName: updatedPatient.name } : f
      )
    );

    logAuditEvent(
      'UPDATE_PATIENT',
      'patients',
      updatedPatient.patientId,
      `Updated demographics, bed, and routine schedule for ${updatedPatient.name} (${updatedPatient.patientId})`
    );

    showJOptionPane(
      'Patient Record Updated',
      `Patient details for "${updatedPatient.name}" (${updatedPatient.patientId}) updated successfully in database. No duplicate records created.`,
      'info'
    );

    setEditingPatient(null);
  };

  // ----------------------------------------------------
  // MODULE 4: NEW CASE-TAKING STATE & MEDICINE BUILDER
  // ----------------------------------------------------
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [casePatientId, setCasePatientId] = useState('PAT-1001');
  const [caseVisitDate, setCaseVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [caseChiefComplaint, setCaseChiefComplaint] = useState('');
  const [caseSymptoms, setCaseSymptoms] = useState('');
  const [caseDuration, setCaseDuration] = useState('');
  const [casePastHistory, setCasePastHistory] = useState('');
  const [caseAllergy, setCaseAllergy] = useState('');
  const [caseFamilyHistory, setCaseFamilyHistory] = useState('');
  const [caseCurrentMedication, setCaseCurrentMedication] = useState('');

  // Vitals
  const [examTemp, setExamTemp] = useState('98.6 F');
  const [examBP, setExamBP] = useState('120/80 mmHg');
  const [examPulse, setExamPulse] = useState('72 bpm');
  const [examWeight, setExamWeight] = useState('70 kg');
  const [examHeight, setExamHeight] = useState('170 cm');
  const [examObservation, setExamObservation] = useState('');

  // Diagnosis
  const [diagText, setDiagText] = useState('');
  const [diagNotes, setDiagNotes] = useState('');

  // Prescription Medicines list
  const [medItems, setMedItems] = useState<Omit<PrescriptionMedicine, 'itemId' | 'prescriptionId'>[]>([
    {
      medicineName: 'Tab. Paracetamol 650mg',
      dosage: '1 Tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      instructions: 'After meals'
    }
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1 (Twice daily)');
  const [newMedDuration, setNewMedDuration] = useState('5 days');
  const [newMedInstructions, setNewMedInstructions] = useState('After food');

  // Follow up
  const [followUpDate, setFollowUpDate] = useState('2026-09-28');
  const [followUpNotes, setFollowUpNotes] = useState('Review symptoms and vitals.');
  const [followUpStatus, setFollowUpStatus] = useState<'Scheduled' | 'Completed' | 'Cancelled' | 'Missed'>('Scheduled');
  const [caseStatus, setCaseStatus] = useState<'Completed' | 'Under Treatment' | 'Follow-up Required' | 'Open'>('Under Treatment');
  const [caseDoctorNotes, setCaseDoctorNotes] = useState('Patient responding favorably to initial therapy.');
  const [caseHandoverNotes, setCaseHandoverNotes] = useState('Review vitals and lab findings on next follow-up.');

  // Case Completeness calculation (20% each)
  const isHistoryComplete = !!caseChiefComplaint.trim() && !!caseSymptoms.trim();
  const isExamComplete = !!examTemp.trim() && !!examBP.trim() && !!examPulse.trim();
  const isDiagComplete = !!diagText.trim();
  const isPrescriptionComplete = medItems.length > 0;
  const isFollowUpComplete = !!followUpDate.trim();

  const caseCompletenessPercentage =
    (isHistoryComplete ? 20 : 0) +
    (isExamComplete ? 20 : 0) +
    (isDiagComplete ? 20 : 0) +
    (isPrescriptionComplete ? 20 : 0) +
    (isFollowUpComplete ? 20 : 0);

  // User-Friendly Clinical Presets (Quick Autofill for common cases)
  const CLINICAL_PRESETS = [
    {
      name: 'Viral Bronchitis',
      chiefComplaint: 'Persistent dry cough, mild fever, sore throat',
      symptoms: 'Non-productive cough, low-grade fever, rhinorrhea, malaise',
      duration: '4 days',
      pastHistory: 'No chronic respiratory illnesses',
      allergy: 'NKDA (No Known Drug Allergies)',
      temp: '99.4 F',
      bp: '118/76 mmHg',
      pulse: '80 bpm',
      weight: '68 kg',
      height: '172 cm',
      observation: 'Throat mildly erythematous; chest clear on auscultation, no wheezes or crackles.',
      diagnosis: 'Acute Viral Bronchitis (J20.9)',
      notes: 'Supportive symptomatic therapy; maintain warm fluid hydration; steam inhalation twice daily.',
      medicines: [
        { medicineName: 'Tab. Paracetamol 650mg', dosage: '1 Tablet', frequency: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'After meals for fever/bodyache' },
        { medicineName: 'Syp. Dextromethorphan (10mg/5ml)', dosage: '10 ml', frequency: '1-1-1 (Thrice daily)', duration: '5 days', instructions: 'Take with warm water before bed' },
        { medicineName: 'Tab. Cetirizine 10mg', dosage: '1 Tablet', frequency: '0-0-1 (At night)', duration: '5 days', instructions: 'May cause mild drowsiness' }
      ],
      followUpDays: '2026-10-12',
      followUpNotes: 'Return if fever spikes above 101F, dyspnea develops, or cough persists >10 days.'
    },
    {
      name: 'Type 2 Diabetes Review',
      chiefComplaint: 'Routine quarterly diabetic follow-up and prescription refill',
      symptoms: 'Mild afternoon fatigue; no polyuria, polydipsia, or blurred vision',
      duration: '3 months',
      pastHistory: 'Type 2 Diabetes Mellitus x 4 years, controlled on oral hypoglycemics',
      allergy: 'Penicillin allergy (skin rash)',
      temp: '98.4 F',
      bp: '124/82 mmHg',
      pulse: '74 bpm',
      weight: '74 kg',
      height: '168 cm',
      observation: 'Bipedal pulses intact; bilateral feet sensation intact on monofilament test; no ulcers.',
      diagnosis: 'Type 2 Diabetes Mellitus without complications (E11.9)',
      notes: 'Continue lifestyle modifications and daily 30-min walking. HbA1c scheduled.',
      medicines: [
        { medicineName: 'Tab. Metformin 500mg SR', dosage: '1 Tablet', frequency: '1-0-1 (Twice daily)', duration: '30 days', instructions: 'Take with or immediately after meals' },
        { medicineName: 'Tab. Glimepiride 1mg', dosage: '1 Tablet', frequency: '1-0-0 (Morning)', duration: '30 days', instructions: 'Take 15 mins before breakfast' }
      ],
      followUpDays: '2026-11-05',
      followUpNotes: 'Bring fasting and post-prandial blood sugar logbook + HbA1c lab report.'
    },
    {
      name: 'Hypertension Assessment',
      chiefComplaint: 'Occipital morning headache, routine blood pressure review',
      symptoms: 'Morning heaviness in head; no chest pain, palpitation, or dizziness',
      duration: '1 week',
      pastHistory: 'Primary Essential Hypertension diagnosed 2 years ago',
      allergy: 'NKDA',
      temp: '98.6 F',
      bp: '142/90 mmHg',
      pulse: '76 bpm',
      weight: '78 kg',
      height: '175 cm',
      observation: 'S1, S2 audible; no pedal edema; lungs clear to auscultation.',
      diagnosis: 'Primary Essential Hypertension (I10)',
      notes: 'Low sodium DASH diet advised. Regular home BP monitoring twice a week.',
      medicines: [
        { medicineName: 'Tab. Telmisartan 40mg', dosage: '1 Tablet', frequency: '1-0-0 (Morning)', duration: '30 days', instructions: 'Take with glass of water upon waking' },
        { medicineName: 'Tab. Amlodipine 5mg', dosage: '1 Tablet', frequency: '0-0-1 (Evening)', duration: '30 days', instructions: 'Evening post dinner' }
      ],
      followUpDays: '2026-10-19',
      followUpNotes: 'Repeat BP check; bring 7-day home blood pressure charting.'
    },
    {
      name: 'Acute Gastroenteritis',
      chiefComplaint: 'Watery loose motions, abdominal cramping, mild nausea',
      symptoms: '4-5 episodes of watery stools, nausea, mild low-grade fever, weakness',
      duration: '2 days',
      pastHistory: 'Ate outside street food 36 hours prior',
      allergy: 'NKDA',
      temp: '99.0 F',
      bp: '110/70 mmHg',
      pulse: '84 bpm',
      weight: '64 kg',
      height: '165 cm',
      observation: 'Tongue mildly dry; abdomen soft, mild diffuse peri-umbilical tenderness, bowel sounds active.',
      diagnosis: 'Acute Gastroenteritis, likely infectious (A09)',
      notes: 'Oral rehydration salts (ORS) 2-3 liters/day; light bland khichdi/banana diet; no dairy.',
      medicines: [
        { medicineName: 'Tab. Ofloxacin 200mg + Ornidazole 500mg', dosage: '1 Tablet', frequency: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'Take strictly after meals' },
        { medicineName: 'Sachet ORS Electrolyte Powder', dosage: '1 Sachet in 1L boiled water', frequency: 'As needed', duration: '3 days', instructions: 'Sip continuously after every loose motion' },
        { medicineName: 'Cap. Lactic Acid Bacillus (Probiotic)', dosage: '1 Capsule', frequency: '1-0-1', duration: '5 days', instructions: 'Between meals' }
      ],
      followUpDays: '2026-10-08',
      followUpNotes: 'Emergency review if unable to retain fluids, high fever, or blood in stool.'
    }
  ];

  const handleApplyClinicalPreset = (presetIndex: number) => {
    const preset = CLINICAL_PRESETS[presetIndex];
    if (!preset) return;
    setCaseChiefComplaint(preset.chiefComplaint);
    setCaseSymptoms(preset.symptoms);
    setCaseDuration(preset.duration);
    setCasePastHistory(preset.pastHistory);
    setCaseAllergy(preset.allergy);
    setExamTemp(preset.temp);
    setExamBP(preset.bp);
    setExamPulse(preset.pulse);
    setExamWeight(preset.weight);
    setExamHeight(preset.height);
    setExamObservation(preset.observation);
    setDiagText(preset.diagnosis);
    setDiagNotes(preset.notes);
    setMedItems(preset.medicines);
    setFollowUpDate(preset.followUpDays);
    setFollowUpNotes(preset.followUpNotes);
    setFollowUpStatus('Scheduled');
    showToast(`Loaded clinical preset: "${preset.name}". You can adjust any field.`, 'info');
  };

  const handleResetCaseForm = () => {
    setCaseChiefComplaint('');
    setCaseSymptoms('');
    setCaseDuration('');
    setCasePastHistory('');
    setCaseAllergy('');
    setCaseFamilyHistory('');
    setCaseCurrentMedication('');
    setExamObservation('');
    setDiagText('');
    setDiagNotes('');
    setMedItems([]);
    showToast('Case documentation fields cleared.', 'info');
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) {
      showJOptionPane('Prescription Warning', 'Please provide a Medicine Name before adding to prescription list!', 'warning');
      return;
    }
    setMedItems([
      ...medItems,
      {
        medicineName: newMedName.trim(),
        dosage: newMedDosage.trim() || '1 Tablet',
        frequency: newMedFreq,
        duration: newMedDuration.trim() || '3 days',
        instructions: newMedInstructions.trim() || 'After meals'
      }
    ]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleRemoveMedicine = (index: number) => {
    setMedItems(medItems.filter((_, i) => i !== index));
  };

  const QUICK_MEDICINES = [
    { name: 'Tab. Paracetamol 650mg', dosage: '1 Tablet', freq: '1-0-1 (Twice daily)', duration: '5 days', instructions: 'After meals for fever/pain' },
    { name: 'Cap. Amoxicillin 500mg', dosage: '1 Capsule', freq: '1-1-1 (Thrice daily)', duration: '7 days', instructions: 'After meals with water' },
    { name: 'Cap. Omeprazole 20mg', dosage: '1 Capsule', freq: '1-0-0 (Morning)', duration: '14 days', instructions: '30 mins before breakfast' },
    { name: 'Tab. Cetirizine 10mg', dosage: '1 Tablet', freq: '0-0-1 (Night)', duration: '5 days', instructions: 'At bedtime' },
    { name: 'Tab. Metformin 500mg SR', dosage: '1 Tablet', freq: '1-0-1 (Twice daily)', duration: '30 days', instructions: 'With meals' },
    { name: 'Tab. Amlodipine 5mg', dosage: '1 Tablet', freq: '1-0-0 (Morning)', duration: '30 days', instructions: 'Morning after food' },
    { name: 'Tab. Azithromycin 500mg', dosage: '1 Tablet', freq: '1-0-0 (Once daily)', duration: '3 days', instructions: '1 hr before meals' },
    { name: 'Tab. Ibuprofen 400mg', dosage: '1 Tablet', freq: '1-0-1 (Twice daily)', duration: '3 days', instructions: 'After meals for analgesia' }
  ];

  const handleQuickAddMedicine = (med: typeof QUICK_MEDICINES[0]) => {
    setMedItems((prev) => [
      ...prev,
      {
        medicineName: med.name,
        dosage: med.dosage,
        frequency: med.freq,
        duration: med.duration,
        instructions: med.instructions
      }
    ]);
    showToast(`Added ${med.name} to prescription list`, 'success');
  };

  const handleStartEditCase = (caseIdToEdit: number) => {
    const cs = cases.find((c) => c.caseId === caseIdToEdit);
    if (!cs) return;
    const exam = examinations.find((e) => e.caseId === caseIdToEdit);
    const diag = diagnoses.find((d) => d.caseId === caseIdToEdit);
    const presc = prescriptions.find((p) => p.caseId === caseIdToEdit);
    const follow = followups.find((f) => f.caseId === caseIdToEdit);

    setCasePatientId(cs.patientId);
    setCaseVisitDate(cs.visitDate);
    setCaseChiefComplaint(cs.chiefComplaint);
    setCaseSymptoms(cs.symptoms);
    setCaseDuration(cs.duration || '3 days');
    setCasePastHistory(cs.pastHistory || '');
    setCaseAllergy(cs.allergy || '');
    setCaseFamilyHistory(cs.familyHistory || '');
    setCaseCurrentMedication(cs.currentMedication || '');
    setCaseDoctorNotes(cs.doctorNotes || '');
    setCaseHandoverNotes(cs.handoverNotes || '');
    setCaseStatus(cs.caseStatus || 'Under Treatment');

    // Vitals
    setExamTemp(exam?.temperature || '98.6 F');
    setExamBP(exam?.bloodPressure || '120/80 mmHg');
    setExamPulse(exam?.pulseRate || '72 bpm');
    setExamWeight(exam?.weight || '70 kg');
    setExamHeight(exam?.height || '170 cm');
    setExamObservation(exam?.observation || '');

    // Diagnosis
    setDiagText(diag?.diagnosisText || '');
    setDiagNotes(diag?.doctorNotes || '');

    // Prescription
    if (presc && presc.medicines.length > 0) {
      setMedItems(
        presc.medicines.map((m) => ({
          medicineName: m.medicineName,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions
        }))
      );
    } else {
      setMedItems([
        {
          medicineName: 'Tab. Paracetamol 650mg',
          dosage: '1 Tablet',
          frequency: '1-0-1 (Twice daily)',
          duration: '3 days',
          instructions: 'After meals'
        }
      ]);
    }

    // Follow-up
    setFollowUpDate(follow?.followupDate || new Date().toISOString().split('T')[0]);
    setFollowUpNotes(follow?.notes || 'Follow-up review.');
    setFollowUpStatus((follow?.status as any) || 'Scheduled');

    setEditingCaseId(caseIdToEdit);
    setActiveModule('new_case');
  };

  const handleCancelEditCase = () => {
    setEditingCaseId(null);
    setCaseChiefComplaint('');
    setCaseSymptoms('');
    setCaseDuration('');
    setCasePastHistory('');
    setCaseAllergy('');
    setCaseFamilyHistory('');
    setCaseCurrentMedication('');
    setDiagText('');
    setDiagNotes('');
    setExamObservation('');
    setMedItems([
      {
        medicineName: 'Tab. Paracetamol 650mg',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice daily)',
        duration: '5 days',
        instructions: 'After meals'
      }
    ]);
  };

  const handleSaveCompleteCase = (e: React.FormEvent) => {
    e.preventDefault();

    if (isReceptionist) {
      showJOptionPane(
        'Action Restricted',
        'Receptionist role has read-only access to clinical examination and treatment records. Please use Patient Registration or Directory modules for demographic work.',
        'warning'
      );
      return;
    }

    // Validations
    if (!casePatientId.trim()) {
      showJOptionPane('Validation Error', 'Please choose a valid registered Patient ID!', 'warning');
      return;
    }
    const patientExists = patients.some((p) => p.patientId === casePatientId.trim());
    if (!patientExists) {
      showJOptionPane('Validation Error', `Patient ID '${casePatientId}' does not exist in database! Register patient first.`, 'error');
      return;
    }
    if (!caseChiefComplaint.trim()) {
      showJOptionPane('Validation Error', 'Chief Complaint cannot be empty!', 'warning');
      return;
    }
    if (!caseSymptoms.trim()) {
      showJOptionPane('Validation Error', 'Symptoms description cannot be empty!', 'warning');
      return;
    }
    // Diagnosis & Prescription are doctor-only requirements
    if (isDoctor && !diagText.trim()) {
      showJOptionPane('Validation Error', 'Clinical Diagnosis cannot be empty for Doctor record!', 'warning');
      return;
    }
    if (isDoctor && medItems.length === 0) {
      showJOptionPane('Validation Error', 'Prescription must contain at least one medicine item for Doctor record!', 'warning');
      return;
    }

    // Check if in EDIT MODE (updates existing record without duplicates)
    if (editingCaseId !== null) {
      const updatedCaseRecord: CaseHistory = {
        caseId: editingCaseId,
        patientId: casePatientId,
        visitDate: caseVisitDate,
        chiefComplaint: caseChiefComplaint,
        symptoms: caseSymptoms,
        duration: caseDuration || '3 days',
        pastHistory: casePastHistory || 'None',
        allergy: caseAllergy || 'NKDA (No known drug allergies)',
        familyHistory: caseFamilyHistory || 'None reported',
        currentMedication: caseCurrentMedication || 'None',
        doctorId: currentUser ? currentUser.userId : 2,
        doctorName: currentUser ? currentUser.fullName : 'Dr. Sarah Jenkins',
        doctorNotes: caseDoctorNotes,
        handoverNotes: caseHandoverNotes,
        caseStatus: caseStatus
      };

      setCases((prev) =>
        prev.map((c) => (c.caseId === editingCaseId ? updatedCaseRecord : c))
      );

      setExaminations((prev) => {
        const exists = prev.some((e) => e.caseId === editingCaseId);
        if (exists) {
          return prev.map((e) =>
            e.caseId === editingCaseId
              ? {
                  ...e,
                  temperature: examTemp,
                  bloodPressure: examBP,
                  pulseRate: examPulse,
                  weight: examWeight,
                  height: examHeight,
                  observation: examObservation || e.observation
                }
              : e
          );
        }
        return [
          ...prev,
          {
            examId: 200 + prev.length + 1,
            caseId: editingCaseId,
            temperature: examTemp,
            bloodPressure: examBP,
            pulseRate: examPulse,
            weight: examWeight,
            height: examHeight,
            observation: examObservation || 'Physical vitals recorded.'
          }
        ];
      });

      setDiagnoses((prev) => {
        const exists = prev.some((d) => d.caseId === editingCaseId);
        if (exists) {
          return prev.map((d) =>
            d.caseId === editingCaseId
              ? {
                  ...d,
                  diagnosisText: canManageDiagnosis ? (diagText || d.diagnosisText) : d.diagnosisText,
                  doctorNotes: canManageDiagnosis ? (diagNotes || d.doctorNotes) : d.doctorNotes,
                  diagnosisDate: caseVisitDate
                }
              : d
          );
        }
        return [
          ...prev,
          {
            diagnosisId: 300 + prev.length + 1,
            caseId: editingCaseId,
            diagnosisText: diagText || 'Pending Attending Physician Evaluation',
            doctorNotes: diagNotes || 'Nursing intake vitals recorded.',
            diagnosisDate: caseVisitDate
          }
        ];
      });

      if (canManagePrescription) {
        setPrescriptions((prev) => {
          const existing = prev.find((p) => p.caseId === editingCaseId);
          const pId = existing ? existing.prescriptionId : 400 + prev.length + 1;
          const updatedMeds: PrescriptionMedicine[] = medItems.map((m, idx) => ({
            itemId: 500 + pId * 10 + idx,
            prescriptionId: pId,
            ...m
          }));

          if (existing) {
            return prev.map((p) =>
              p.caseId === editingCaseId
                ? {
                    ...p,
                    prescriptionDate: caseVisitDate,
                    medicines: updatedMeds
                  }
                : p
            );
          }
          return [
            ...prev,
            {
              prescriptionId: pId,
              caseId: editingCaseId,
              prescriptionDate: caseVisitDate,
              doctorNotes: 'Take medicines regularly with warm water.',
              medicines: updatedMeds
            }
          ];
        });
      }

      setFollowups((prev) => {
        const exists = prev.some((f) => f.caseId === editingCaseId);
        if (exists) {
          return prev.map((f) =>
            f.caseId === editingCaseId
              ? {
                  ...f,
                  followupDate: followUpDate,
                  notes: followUpNotes,
                  status: followUpStatus
                }
              : f
          );
        }
        return [
          ...prev,
          {
            followupId: 600 + prev.length + 1,
            caseId: editingCaseId,
            patientId: casePatientId,
            patientName: patients.find((p) => p.patientId === casePatientId)?.name,
            followupDate: followUpDate,
            reason: `Follow-up review for ${caseChiefComplaint}`,
            notes: followUpNotes,
            status: followUpStatus,
            doctorName: currentUser ? currentUser.fullName : 'Dr. Sarah Jenkins'
          }
        ];
      });

      logAuditEvent(
        'UPDATE_CASE',
        'case_history',
        String(editingCaseId),
        `Updated encounter #${editingCaseId} for patient ${casePatientId} with latest exam, diagnosis, medicines, and follow-up`
      );

      const savedCaseId = editingCaseId;
      setEditingCaseId(null);
      setSelectedCaseId(savedCaseId);
      setHistoryPatientQuery(casePatientId);
      showJOptionPane(
        'Case Record Updated',
        `Encounter Record #${savedCaseId} for Patient ${casePatientId} has been updated successfully in the database. No duplicate records created.`,
        'info'
      );
      setActiveModule('history');
      return;
    }

    const newCaseId = 100 + cases.length + 1;
    const newExamId = 200 + examinations.length + 1;
    const newDiagId = 300 + diagnoses.length + 1;
    const newPrescId = 400 + prescriptions.length + 1;
    const newFollowupId = 600 + followups.length + 1;

    const newCaseRecord: CaseHistory = {
      caseId: newCaseId,
      patientId: casePatientId,
      visitDate: caseVisitDate,
      chiefComplaint: caseChiefComplaint,
      symptoms: caseSymptoms,
      duration: caseDuration || '3 days',
      pastHistory: casePastHistory || 'None',
      allergy: caseAllergy || 'NKDA (No known drug allergies)',
      familyHistory: caseFamilyHistory || 'None reported',
      currentMedication: caseCurrentMedication || 'None',
      doctorId: currentUser ? currentUser.userId : 2,
      doctorName: currentUser ? currentUser.fullName : 'Dr. Sarah Jenkins',
      doctorNotes: caseDoctorNotes,
      handoverNotes: caseHandoverNotes,
      caseStatus: caseStatus
    };

    const newExamRecord: Examination = {
      examId: newExamId,
      caseId: newCaseId,
      temperature: examTemp,
      bloodPressure: examBP,
      pulseRate: examPulse,
      weight: examWeight,
      height: examHeight,
      observation: examObservation || 'Conscious, oriented, systemic examination within normal limits.'
    };

    const newDiagRecord: Diagnosis = {
      diagnosisId: newDiagId,
      caseId: newCaseId,
      diagnosisText: diagText,
      doctorNotes: diagNotes || 'Prescription instructions and lifestyle modifications explained.',
      diagnosisDate: caseVisitDate
    };

    const newPrescRecord: Prescription = {
      prescriptionId: newPrescId,
      caseId: newCaseId,
      prescriptionDate: caseVisitDate,
      doctorNotes: 'Take medicines regularly with warm water.',
      medicines: medItems.map((m, idx) => ({
        itemId: 500 + prescriptions.length * 10 + idx,
        prescriptionId: newPrescId,
        ...m
      }))
    };

    const newFollowRecord: FollowUp = {
      followupId: newFollowupId,
      caseId: newCaseId,
      patientId: casePatientId,
      patientName: patients.find((p) => p.patientId === casePatientId)?.name,
      followupDate: followUpDate,
      reason: `Follow-up review for ${caseChiefComplaint}`,
      notes: followUpNotes,
      status: followUpStatus,
      doctorName: currentUser ? currentUser.fullName : 'Dr. Sarah Jenkins'
    };

    // Commit Transaction
    setCases([newCaseRecord, ...cases]);
    setExaminations([newExamRecord, ...examinations]);
    setDiagnoses([newDiagRecord, ...diagnoses]);
    setPrescriptions([newPrescRecord, ...prescriptions]);
    setFollowups([newFollowRecord, ...followups]);

    // Audit Logging
    logAuditEvent('Create Case', 'case_history', String(newCaseId), `Case #${newCaseId} created for patient ${casePatientId} with diagnosis "${diagText}"`);
    logAuditEvent('Add Examination', 'examinations', String(newExamId), `Vitals recorded: BP ${examBP}, Pulse ${examPulse}, Temp ${examTemp}`);
    logAuditEvent('Add Diagnosis', 'diagnoses', String(newDiagId), `Assessment: ${diagText}`);
    logAuditEvent('Add Prescription', 'prescriptions', String(newPrescId), `Prescribed ${medItems.length} medication items`);
    logAuditEvent('Add Follow-up', 'follow_ups', String(newFollowupId), `Follow-up scheduled for ${followUpDate}`);

    setSelectedPatientId(casePatientId);
    showJOptionPane(
      'Case Saved Successfully',
      `Transaction Committed! New Case Record #${newCaseId} registered for Patient ${casePatientId} with Physical Examination, Diagnosis, Prescription, and Follow-up. Case Documentation Completeness: ${caseCompletenessPercentage}%.`,
      'info'
    );

    setActiveModule('timeline');
  };

  // ----------------------------------------------------
  // MODULE 5: CASE HISTORY MULTI-VISIT EXPLORER
  // ----------------------------------------------------
  const [historyPatientQuery, setHistoryPatientQuery] = useState('PAT-1001');
  const [historyNameSearch, setHistoryNameSearch] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(101);

  const currentHistoryPatient = patients.find(
    (p) => p.patientId.toLowerCase() === historyPatientQuery.trim().toLowerCase()
  );
  const patientCaseList = cases.filter(
    (c) => c.patientId.toLowerCase() === historyPatientQuery.trim().toLowerCase()
  );
  const patientRoutineCheckups = routineCheckups
    .filter((c) => c.patientId.toLowerCase() === historyPatientQuery.trim().toLowerCase())
    .sort((a, b) => a.weekNumber - b.weekNumber);
  const activeCaseRecord = cases.find((c) => c.caseId === selectedCaseId);
  const activeExamRecord = examinations.find((e) => e.caseId === selectedCaseId);
  const activeDiagRecord = diagnoses.find((d) => d.caseId === selectedCaseId);
  const activePrescRecord = prescriptions.find((p) => p.caseId === selectedCaseId);
  const activeFollowRecord = followups.find((f) => f.caseId === selectedCaseId);

  const handleDownloadPdfForPatient = (targetPatient?: Patient) => {
    const p = targetPatient || currentHistoryPatient;
    if (!p) return;

    const patientCases = cases.filter((c) => c.patientId === p.patientId);
    const patientExams = examinations.filter((e) => patientCases.some((c) => c.caseId === e.caseId));
    const patientDiags = diagnoses.filter((d) => patientCases.some((c) => c.caseId === d.caseId));
    const patientRxs = prescriptions.filter((p) => patientCases.some((c) => c.caseId === p.caseId));
    const patientWeekly = routineCheckups.filter((c) => c.patientId === p.patientId);
    const patientFollowups = followups.filter((f) => patientCases.some((c) => c.caseId === f.caseId));
    const patientDocs = patientDocuments.filter((d) => d.patientId === p.patientId);

    generatePatientRecordPdf({
      patient: p,
      cases: patientCases,
      examinations: patientExams,
      diagnoses: patientDiags,
      prescriptions: patientRxs,
      routineCheckups: patientWeekly,
      smsLogs,
      followups: patientFollowups,
      patientDocuments: patientDocs
    });

    logAuditEvent(
      'DOWNLOAD_PDF',
      'patients',
      p.patientId,
      `Exported simple PDF clinical dossier for ${p.name} (${p.patientId})`
    );

    showJOptionPane(
      'Patient Record Downloaded (.PDF)',
      `Clinical history and routine weekly checkups for ${p.name} (${p.patientId}) downloaded directly in PDF format (not in ZIP format).`,
      'info'
    );
  };

  const handleDownloadHospitalReport = (
    type: 'Comprehensive' | 'Wards' | 'Checkups' | 'Census' = 'Comprehensive'
  ) => {
    let title = 'CLINICAL ANALYTICS & OPERATIONAL SUMMARY REPORT';
    if (type === 'Wards') title = 'INPATIENT WARD OCCUPANCY & BED ALLOCATION REPORT';
    if (type === 'Checkups') title = 'ROUTINE WEEKLY CHECKUPS & SMS DISPATCH AUDIT REPORT';
    if (type === 'Census') title = 'REGISTERED PATIENTS CLINICAL CENSUS DIRECTORY';

    generateHospitalAnalyticsReportPdf({
      reportTitle: title,
      reportType: type,
      patients,
      cases,
      examinations,
      diagnoses,
      prescriptions,
      followups,
      wards,
      beds,
      routineCheckups,
      smsLogs,
      generatedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Dr. Sarah Jenkins, M.D.'
    });

    logAuditEvent(
      'DOWNLOAD_REPORT_PDF',
      'system',
      'REPORTS',
      `Exported ${type} hospital report in official .pdf format`
    );

    showJOptionPane(
      'Hospital Report Downloaded (.pdf)',
      `Official ${type} Hospital Report has been successfully generated and downloaded directly in Adobe Acrobat Portable Document Format (.pdf).`,
      'info'
    );
  };

  const handleQuickSendMissedSms = (checkup: RoutineCheckup) => {
    const patient = patients.find((p) => p.patientId === checkup.patientId);
    if (!patient) return;
    const recipientMobile = patient.mobile || checkup.mobile;
    const nowStr = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const smsText = `Dear ${patient.name}, you missed your scheduled weekly routine checkup on ${checkup.scheduledDate} at City Hospital. Please visit clinic or contact (022) 2419-8000 immediately to reschedule.`;

    setRoutineCheckups((prev) =>
      prev.map((c) =>
        c.checkupId === checkup.checkupId
          ? {
              ...c,
              missedAlertSent: true,
              missedAlertSentAt: nowStr,
              missedAlertMessage: smsText
            }
          : c
      )
    );

    const newSmsLog: SmsMessage = {
      smsId: `SMS-${Date.now().toString().slice(-4)}`,
      patientId: patient.patientId,
      patientName: patient.name,
      mobileNumber: recipientMobile,
      messageType: 'Missed Checkup Alert',
      messageText: smsText,
      sentAt: nowStr,
      status: 'Delivered'
    };
    setSmsLogs((prev) => [newSmsLog, ...prev]);

    showJOptionPane(
      'SMS Alert Dispatched',
      `Missed checkup alert message sent to registered mobile number ${recipientMobile} for patient ${patient.name}.`,
      'info'
    );
  };

  return (
    <div className="w-full flex flex-col bg-slate-100 min-h-screen text-slate-800 antialiased font-sans">
      {/* Device View Mode Switcher Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-30">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider hidden sm:inline">
            Device View:
          </span>
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center gap-0.5">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-xs ${
                deviceMode === 'desktop'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop PC (Swing)</span>
            </button>
            <button
              onClick={() => setDeviceMode('iphone')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-xs ${
                deviceMode === 'iphone'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone 15 Pro</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition text-xs ${
                deviceMode === 'fluid'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fluid Mobile / PWA</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('wards')}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition"
            title="Inspect Ward Bed Availability"
          >
            <BedIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {beds.filter((b) => b.status === 'Available').length} / {beds.length} Beds Available
            </span>
          </button>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Wards: <span className="text-slate-200 font-semibold">{wards.length}</span> (ICU, Emergency, Gen, Ped, Private)
          </span>
        </div>
      </div>

      {/* Top Application Bar - Styled as Authentic Swing / Java Window */}
      <header className="bg-slate-800 text-slate-100 border-b border-slate-700 select-none">
        {/* Window Title Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-xs gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 inline-block shadow-sm shrink-0"></span>
            <span className="font-semibold text-slate-200 tracking-wide truncate text-[11px] sm:text-xs">
              Patient Case-Taking Software
              <span className="hidden md:inline"> — Clinical Workstation</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* User-Friendly Quick Search (Ctrl+K) */}
            <button
              onClick={() => setIsSpotlightOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-[11px] transition shadow-xs"
              title="Search patients or medications (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline px-1 py-0.2 bg-slate-900 text-slate-400 rounded text-[9px] font-mono border border-slate-700">
                Ctrl+K
              </kbd>
            </button>

            {/* Quick Help & Shortcuts */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="User Guide & System Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            </button>

            <button
              onClick={() => setIsDbStatusOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] sm:text-[11px] font-mono transition shadow-xs"
              title="Click to inspect MySQL JDBC Connection, Latency & Pool Health"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline font-semibold">MySQL 8.0: Connected (12ms)</span>
              <span className="sm:hidden font-semibold">MySQL (12ms)</span>
            </button>

            <button
              onClick={() => {
                const targetPatient = patients.find((p) => p.patientId === (selectedPatientId || 'PAT-1001')) || patients[0];
                setEmergencyPatient(targetPatient);
              }}
              className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-[11px] font-semibold transition"
              title="Immediate Emergency Triage Quick View for Selected Patient"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>🚨 Emergency Triage</span>
            </button>
          </div>
        </div>

        {/* Backdrop for closing active navigation dropdown */}
        {activeNavDropdown && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setActiveNavDropdown(null)}
          />
        )}

        {/* Java Swing JMenuBar - Reorganized Clean Navigation */}
        <div className="relative z-30 flex flex-wrap md:flex-nowrap items-center justify-between px-3 py-1 bg-slate-800 text-xs border-b border-slate-700 gap-2">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-0.5 md:pb-0 scrollbar-none">
            {/* 1. Dashboard */}
            <button
              onClick={() => {
                setActiveModule('dashboard');
                setActiveNavDropdown(null);
              }}
              className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                activeModule === 'dashboard'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* 2. Patients (Merged Menu: Directory, Registration, Documents) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!['register', 'manage', 'documents'].includes(activeModule)) {
                    setActiveModule('manage');
                  }
                  setActiveNavDropdown(activeNavDropdown === 'patients' ? null : 'patients');
                }}
                className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                  ['register', 'manage', 'documents'].includes(activeModule)
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Patients</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeNavDropdown === 'patients' ? 'rotate-180' : ''}`} />
              </button>

              {activeNavDropdown === 'patients' && (
                <div className="absolute left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-md shadow-2xl py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      setActiveModule('manage');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'manage' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>Patient Directory</span>
                    </div>
                    <span className="text-[10px] text-slate-400">View All</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('manage');
                      setActiveNavDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      <span>Patient Search</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Filter Records</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('register');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'register' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+ Register Patient</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">New Case</span>
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    onClick={() => {
                      setActiveModule('documents');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'documents' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Patient Documents</span>
                    </div>
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                      {patientDocuments.length}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Clinical Care (Merged Menu: New Case, History, Timeline, Comparison, Follow-ups, Medicines, Routine SMS) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!['new_case', 'history', 'timeline', 'comparison', 'followups', 'medicines', 'routine_sms'].includes(activeModule)) {
                    setActiveModule('new_case');
                  }
                  setActiveNavDropdown(activeNavDropdown === 'clinical' ? null : 'clinical');
                }}
                className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                  ['new_case', 'history', 'timeline', 'comparison', 'followups', 'medicines', 'routine_sms'].includes(activeModule)
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinical Care</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeNavDropdown === 'clinical' ? 'rotate-180' : ''}`} />
              </button>

              {activeNavDropdown === 'clinical' && (
                <div className="absolute left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-md shadow-2xl py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      setActiveModule('new_case');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'new_case' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>+ New Case Taking</span>
                    </div>
                    <span className="text-[10px] text-sky-400">Rx & Exam</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('history');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'history' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Multi-Visit History</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Dossiers</span>
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    onClick={() => {
                      setActiveModule('timeline');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'timeline' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Patient Timeline</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Trajectory</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('comparison');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'comparison' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GitCompare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Compare Visits</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Side-by-side</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('followups');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'followups' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Follow-up Reviews</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      {followups.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('medicines');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'medicines' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Prescription History</span>
                    </div>
                    <span className="text-[10px] text-slate-400">By Patient</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('medicines');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'medicines' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Pill className="w-3.5 h-3.5 text-rose-400" />
                      <span>Medicine-wise Search</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Rx cross-ref</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('routine_sms');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'routine_sms' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Routine Checks & SMS</span>
                    </div>
                    {routineCheckups.filter((c) => c.status === 'Missed').length > 0 && (
                      <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        {routineCheckups.filter((c) => c.status === 'Missed').length} Missed
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 4. Wards & Beds */}
            <button
              onClick={() => {
                setActiveModule('wards');
                setActiveNavDropdown(null);
              }}
              className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                activeModule === 'wards'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BedIcon className="w-3.5 h-3.5" />
              <span>Wards & Beds</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
                {beds.filter((b) => b.status === 'Available').length}
              </span>
            </button>

            {/* 5. Reports */}
            <button
              onClick={() => {
                setActiveModule('reports');
                setActiveNavDropdown(null);
              }}
              className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                activeModule === 'reports'
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Reports</span>
            </button>

            {/* 6. System (MySQL Tables, DB Health, Audit Log) */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!['database', 'audit_log'].includes(activeModule)) {
                    setActiveModule('database');
                  }
                  setActiveNavDropdown(activeNavDropdown === 'system' ? null : 'system');
                }}
                className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
                  ['database', 'audit_log'].includes(activeModule)
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>System</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeNavDropdown === 'system' ? 'rotate-180' : ''}`} />
              </button>

              {activeNavDropdown === 'system' && (
                <div className="absolute left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-md shadow-2xl py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      setActiveModule('audit_log');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'audit_log' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Clinical Audit Log</span>
                    </div>
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                      {auditLogs.length}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('manage');
                      setPatientArchiveFilter('ARCHIVED');
                      setActiveNavDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Archive className="w-3.5 h-3.5 text-amber-400" />
                      <span>Archived Records & Restore</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      {patients.filter((p) => p.status === 'ARCHIVED').length}
                    </span>
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    onClick={() => {
                      setActiveModule('database');
                      setActiveNavDropdown(null);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                      activeModule === 'database' ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-sky-400" />
                      <span>MySQL Tables (10)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Schema</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDbStatusOpen(true);
                      setActiveNavDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Database Status & Ping</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">Online</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 7. Logout and User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto md:ml-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* 1-Click Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700/80 hover:bg-slate-700 text-xs text-slate-200 transition border border-slate-600/70"
                    title="Click to quickly switch staff role to test RBAC permissions"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-semibold text-white hidden md:inline">{currentUser.fullName}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-900 text-sky-200 rounded">
                      {currentUser.role}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isRoleSwitcherOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-700 flex items-center justify-between">
                        <span>Switch Staff Role</span>
                        <span className="text-[9px] text-sky-400 font-mono">RBAC</span>
                      </div>
                      {INITIAL_USERS.map((u) => (
                        <button
                          key={u.userId}
                          onClick={() => {
                            setCurrentUser(u);
                            setIsRoleSwitcherOpen(false);
                            showToast(`Active staff switched to ${u.fullName} (${u.role})`, 'info');
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition ${
                            currentUser.userId === u.userId ? 'bg-sky-600/30 text-sky-300 font-bold' : 'text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400">{u.role}</div>
                          </div>
                          {currentUser.userId === u.userId && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded bg-rose-900/70 hover:bg-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-1 transition"
                  title="Sign out of current staff session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <span className="text-amber-300 text-xs font-medium">Session: Not Logged In</span>
            )}
          </div>
        </div>

        {/* Secondary Contextual Sub-Navigation Ribbon */}
        {['register', 'manage', 'documents'].includes(activeModule) && (
          <div className="bg-slate-850 px-3 py-1.5 border-b border-slate-700/80 flex items-center gap-2 text-xs overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-sky-400" /> Patients:
            </span>
            <button
              onClick={() => setActiveModule('manage')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'manage' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Patient Directory & Search
            </button>
            <button
              onClick={() => setActiveModule('register')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'register' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              + Register Patient
            </button>
            <button
              onClick={() => setActiveModule('documents')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'documents' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Patient Documents ({patientDocuments.length})
            </button>
          </div>
        )}

        {['new_case', 'history', 'timeline', 'comparison', 'followups', 'medicines', 'routine_sms'].includes(activeModule) && (
          <div className="bg-slate-850 px-3 py-1.5 border-b border-slate-700/80 flex items-center gap-2 text-xs overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-sky-400" /> Clinical Care:
            </span>
            <button
              onClick={() => setActiveModule('new_case')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'new_case' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              + New Case Taking
            </button>
            <button
              onClick={() => setActiveModule('history')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'history' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Multi-Visit History
            </button>
            <button
              onClick={() => setActiveModule('timeline')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'timeline' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Timeline Trajectory
            </button>
            <button
              onClick={() => setActiveModule('comparison')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'comparison' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Compare Visits
            </button>
            <button
              onClick={() => setActiveModule('followups')}
              className={`px-2 py-0.5 rounded text-xs transition flex items-center gap-1 ${
                activeModule === 'followups' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Follow-ups</span>
              <span className="px-1 text-[9px] rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {followups.length}
              </span>
            </button>
            <button
              onClick={() => setActiveModule('medicines')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'medicines' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Prescription & Medicine Search
            </button>
            <button
              onClick={() => setActiveModule('routine_sms')}
              className={`px-2 py-0.5 rounded text-xs transition flex items-center gap-1 ${
                activeModule === 'routine_sms' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Routine Checks & SMS</span>
              {routineCheckups.filter((c) => c.status === 'Missed').length > 0 && (
                <span className="px-1 text-[9px] rounded-full bg-rose-500/30 text-rose-300 font-mono font-bold">
                  {routineCheckups.filter((c) => c.status === 'Missed').length} Missed
                </span>
              )}
            </button>
          </div>
        )}

        {['database', 'audit_log'].includes(activeModule) && (
          <div className="bg-slate-850 px-3 py-1.5 border-b border-slate-700/80 flex items-center gap-2 text-xs overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-sky-400" /> System:
            </span>
            <button
              onClick={() => setActiveModule('audit_log')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'audit_log' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              Clinical Audit Trail
            </button>
            <button
              onClick={() => {
                setActiveModule('manage');
                setPatientArchiveFilter('ARCHIVED');
              }}
              className="px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <Archive className="w-3 h-3 text-amber-400" />
              <span>Archived Records & Restore</span>
            </button>
            <button
              onClick={() => setActiveModule('database')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                activeModule === 'database' ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' : 'text-slate-300 hover:text-white'
              }`}
            >
              MySQL Tables & Schemas
            </button>
            <button
              onClick={() => setIsDbStatusOpen(true)}
              className="px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <span>Database Status & Ping</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
          </div>
        )}
      </header>

      {/* Main Workspace Body with FrameWrapper */}
      <FrameWrapper
        deviceMode={deviceMode}
        currentUser={currentUser}
        beds={beds}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      >
        {!currentUser ? (
          /* =========================================================================
             LOGIN VIEW (SWING DIALOG)
             ========================================================================= */
          <div className="max-w-md mx-auto my-12 bg-white rounded-lg shadow-xl border border-slate-300 overflow-hidden">
            <div className="bg-sky-900 px-6 py-4 text-white flex items-center gap-3">
              <Stethoscope className="w-7 h-7 text-sky-300" />
              <div>
                <h1 className="font-bold text-lg leading-tight">Patient Case-Taking Software</h1>
                <p className="text-xs text-sky-200">Java Swing Desktop Application • MySQL Authentication</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded p-3 text-xs text-sky-950">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-sky-900">Hospital Staff Role Profiles (Click to Pre-fill):</p>
                  <span className="text-[10px] text-sky-600 font-mono">MySQL Seeded</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('Doctor')}
                    className={`text-left p-1.5 rounded border transition flex flex-col ${
                      loginRole === 'Doctor'
                        ? 'bg-blue-100/90 border-blue-400 font-bold text-blue-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-blue-800">1. Doctor</span>
                    <span className="text-[10px] text-slate-500 font-mono">doctor / doctor123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('Nurse')}
                    className={`text-left p-1.5 rounded border transition flex flex-col ${
                      loginRole === 'Nurse'
                        ? 'bg-emerald-100/90 border-emerald-400 font-bold text-emerald-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-emerald-800">2. Nurse</span>
                    <span className="text-[10px] text-slate-500 font-mono">nurse / nurse123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('Receptionist')}
                    className={`text-left p-1.5 rounded border transition flex flex-col ${
                      loginRole === 'Receptionist'
                        ? 'bg-amber-100/90 border-amber-400 font-bold text-amber-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-amber-800">3. Receptionist</span>
                    <span className="text-[10px] text-slate-500 font-mono">receptionist / recep123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRolePreset('Admin')}
                    className={`text-left p-1.5 rounded border transition flex flex-col ${
                      loginRole === 'Admin'
                        ? 'bg-purple-100/90 border-purple-400 font-bold text-purple-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-purple-800">4. Admin</span>
                    <span className="text-[10px] text-slate-500 font-mono">admin / admin123</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Role: <span className="text-rose-500">*</span>
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => handleSelectRolePreset(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 bg-white font-medium text-slate-800"
                >
                  <option value="Doctor">Doctor (Clinical Workstation & Prescriptions)</option>
                  <option value="Nurse">Nurse (Nursing Work, Vitals & Ward Care)</option>
                  <option value="Receptionist">Receptionist (Registration & Front-Desk Appointments)</option>
                  <option value="Admin">Admin (Hospital Administrator)</option>
                </select>

                {/* Role Description & Permission Summary */}
                <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  {loginRole === 'Doctor' && (
                    <p>
                      <strong className="text-blue-700">Doctor Permissions:</strong> Can view patient details & case history, record examination vitals, manage clinical diagnoses, write prescriptions, and schedule follow-ups.
                    </p>
                  )}
                  {loginRole === 'Nurse' && (
                    <p>
                      <strong className="text-emerald-700">Nurse Permissions:</strong> Can view patient records, update vital signs and nursing observations, and manage routine checkups. <em>Clinical diagnosis and prescriptions are read-only.</em>
                    </p>
                  )}
                  {loginRole === 'Receptionist' && (
                    <p>
                      <strong className="text-amber-700">Receptionist Permissions:</strong> Can register new patients, update demographic particulars, and schedule appointments. <em>Clinical examination, diagnosis, and prescriptions are read-only.</em>
                    </p>
                  )}
                  {loginRole === 'Admin' && (
                    <p>
                      <strong className="text-purple-700">Admin Permissions:</strong> Full system administration, database inspection, audit trail, and user management.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (Masked): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-sky-700 hover:bg-sky-850 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Workstation</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* =========================================================================
             AUTHENTICATED MODULES
             ========================================================================= */
          <div className="space-y-6">
            {/* Quick Status Bar */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-sky-100 text-sky-800">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {activeModule === 'dashboard' && 'Clinical Management Dashboard'}
                    {activeModule === 'register' && 'Patient Registration Module (CRUD)'}
                    {activeModule === 'manage' && 'Patient Records & Directory'}
                    {activeModule === 'timeline' && 'Patient Longitudinal Clinical Timeline & Vitals Trajectory'}
                    {activeModule === 'comparison' && 'Multi-Visit Case Side-by-Side Comparison'}
                    {activeModule === 'wards' && 'Inpatient Wards & Bed Allocation (IPD)'}
                    {activeModule === 'new_case' && 'Case Taking, Examination & Prescription Entry'}
                    {activeModule === 'history' && 'Multi-Visit Longitudinal Case History Explorer'}
                    {activeModule === 'followups' && 'Longitudinal Follow-up Management & Routine Tracker'}
                    {activeModule === 'medicines' && 'Medication Exposure & Cross-Patient Prescription Search'}
                    {activeModule === 'documents' && 'Patient Diagnostic Reports, Scans & Radiology Repository'}
                    {activeModule === 'audit_log' && 'Clinical Audit Trail & HIPAA/NABH Security Compliance'}
                    {activeModule === 'routine_sms' && 'Routine Checkup Schedules & Automated Missing Checkup SMS'}
                    {activeModule === 'reports' && 'Hospital Clinical Analytics & Reports'}
                    {activeModule === 'database' && 'Relational MySQL Database Inspector'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">
                      Logged in: <span className="font-semibold text-slate-800">{currentUser.fullName}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      currentRole === 'Doctor'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : currentRole === 'Nurse'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : currentRole === 'Receptionist'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-purple-100 text-purple-800 border-purple-300'
                    }`}>
                      Role: {currentRole}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      {isDoctor && '• Full Clinical Authority (Exam, Diagnosis, Rx, Follow-up)'}
                      {isNurse && '• Nursing Care (Vitals & Observations active • Diagnosis/Rx Read-Only)'}
                      {isReceptionist && '• Front Desk (Registration & Appointments active • Clinical Read-Only)'}
                      {currentRole === 'Admin' && '• System Administrator'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModule('new_case')}
                  className="px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> New Case Taking
                </button>
                <button
                  onClick={() => setActiveModule('register')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Patient
                </button>
              </div>
            </div>

            {/* User-Friendly Active Patient Context Banner */}
            {['new_case', 'history', 'timeline', 'comparison', 'followups', 'medicines', 'documents', 'routine_sms', 'manage'].includes(activeModule) && (() => {
              const activePatient = patients.find((p) => p.patientId === (selectedPatientId || 'PAT-1001')) || patients[0];
              if (!activePatient) return null;
              const initials = activePatient.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs border border-sky-200 shadow-xs shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{activePatient.name}</span>
                        <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                          {activePatient.patientId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activePatient.status === 'ARCHIVED'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : activePatient.wardName
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {activePatient.status === 'ARCHIVED'
                            ? 'Archived Record'
                            : activePatient.wardName
                            ? `Inpatient: ${activePatient.wardName} (Bed ${activePatient.bedNumber})`
                            : 'Outpatient (OPD)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span>{activePatient.age} yrs</span>
                        <span>·</span>
                        <span>{activePatient.gender}</span>
                        <span>·</span>
                        <span>Blood: <strong className="text-slate-700">{activePatient.bloodGroup}</strong></span>
                        <span>·</span>
                        <span>Phone: {activePatient.mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Switch Patient Quick Dropdown */}
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                      <label className="text-[11px] text-slate-600 font-semibold shrink-0">Active Patient:</label>
                      <select
                        value={activePatient.patientId}
                        onChange={(e) => {
                          const nextId = e.target.value;
                          setSelectedPatientId(nextId);
                          setCasePatientId(nextId);
                          setHistoryPatientQuery(nextId);
                          showToast(`Active patient set to ${nextId}`, 'info');
                        }}
                        className="text-xs bg-white border border-slate-300 rounded px-2 py-0.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-[180px] sm:max-w-[240px] truncate"
                      >
                        {patients.map((p) => (
                          <option key={p.patientId} value={p.patientId}>
                            {p.patientId} - {p.name} ({p.gender}, {p.age}y)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fast Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCasePatientId(activePatient.patientId);
                          setActiveModule('new_case');
                        }}
                        className={`px-2.5 py-1 rounded font-semibold text-xs flex items-center gap-1 transition ${
                          activeModule === 'new_case'
                            ? 'bg-sky-700 text-white'
                            : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                        }`}
                        title="Record a new visit/case for this patient"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Case</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatientId(activePatient.patientId);
                          setActiveModule('timeline');
                        }}
                        className={`px-2.5 py-1 rounded font-semibold text-xs flex items-center gap-1 transition ${
                          activeModule === 'timeline'
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title="View chronological clinical timeline"
                      >
                        <Activity className="w-3 h-3 text-emerald-600" />
                        <span>Timeline</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatientId(activePatient.patientId);
                          setActiveModule('comparison');
                        }}
                        className={`px-2.5 py-1 rounded font-semibold text-xs flex items-center gap-1 transition ${
                          activeModule === 'comparison'
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title="Compare multi-visit changes side-by-side"
                      >
                        <GitCompare className="w-3 h-3 text-indigo-600" />
                        <span>Compare</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDownloadPdfForPatient(activePatient);
                          showToast(`Generated PDF dossier for ${activePatient.name}`, 'success');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-1 transition"
                        title="Download complete multi-visit clinical record PDF"
                      >
                        <FileDown className="w-3 h-3 text-purple-600" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                      <button
                        onClick={() => setEmergencyPatient(activePatient)}
                        className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1 transition"
                        title="Open 10-second rapid emergency triage card"
                      >
                        <AlertOctagon className="w-3 h-3 text-rose-600" />
                        <span className="hidden sm:inline">Emergency</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* DASHBOARD MODULE */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                {/* Clinical Quick Action Bar */}
                <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-xs text-sky-200">
                      <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">Today's Clinical Quick Actions</h3>
                      <p className="text-xs text-sky-200">Instant shortcuts for rapid hospital workflows & case recording</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveModule('register')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Register Patient</span>
                    </button>
                    <button
                      onClick={() => {
                        setCasePatientId(selectedPatientId || 'PAT-1001');
                        setActiveModule('new_case');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>+ New Case Entry</span>
                    </button>
                    <button
                      onClick={() => setIsSpotlightOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-white/20"
                    >
                      <Search className="w-3.5 h-3.5 text-sky-300" />
                      <span>Search (Ctrl+K)</span>
                    </button>
                    <button
                      onClick={() => {
                        const target = patients.find((p) => p.patientId === (selectedPatientId || 'PAT-1001')) || patients[0];
                        setEmergencyPatient(target);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Emergency Triage</span>
                    </button>
                    <button
                      onClick={() => handleDownloadHospitalReport('Comprehensive')}
                      className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                    >
                      <FileDown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hospital Analytics PDF</span>
                    </button>
                  </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Patients</span>
                      <Users className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{patients.length}</div>
                    <div className="mt-1 text-[11px] text-emerald-600 font-medium">● Registered in MySQL Database</div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Ward Beds</span>
                      <BedIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">
                      {beds.filter((b) => b.status === 'Available').length} / {beds.length}
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-600 font-medium">● Vacant across {wards.length} wards</div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Clinical Cases</span>
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{cases.length}</div>
                    <div className="mt-1 text-[11px] text-slate-500">Longitudinal multi-visit logs</div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Prescriptions</span>
                      <Pill className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{prescriptions.length}</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {prescriptions.reduce((acc, p) => acc + p.medicines.length, 0)} medicine items prescribed
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Follow-ups</span>
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">
                      {followups.filter((f) => f.status === 'Scheduled').length}
                    </div>
                    <div className="mt-1 text-[11px] text-amber-600 font-medium">Scheduled reviews pending</div>
                  </div>
                </div>

                {/* Dashboard Navigation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div
                    onClick={() => setActiveModule('register')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-sky-50 text-sky-700 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">Register Patient</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Demographics, OPD/IPD choice & instant ward bed allocation</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                      <span>Launch Form</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('wards')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                        <BedIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">Ward & Bed Availability</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time occupancy, transfer, discharge & ward grid</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>Manage Wards ({beds.filter((b) => b.status === 'Available').length} Available)</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('manage')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">Manage Patients</h3>
                        <p className="text-xs text-slate-500 mt-0.5">JTable roster, bed badges, edit, delete & search filters</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-700">
                      <span>Browse Table</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('new_case')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">New Case Taking</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Symptoms, Physical Exam, Diagnosis & Prescription</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>Record Case</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('history')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">Patient Case History</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Complete multi-visit clinical records & previous Rx</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                      <span>Review Visits</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('routine_sms')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-50 text-rose-700 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition">
                            Routine Weekly Checks & SMS
                          </h3>
                          {routineCheckups.filter((c) => c.status === 'Missed').length > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-rose-100 text-rose-700 font-bold rounded-full">
                              {routineCheckups.filter((c) => c.status === 'Missed').length} Missed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Weekly visit history, name lookup, missed checkup alert SMS & PDF download
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-700">
                      <span>{routineCheckups.length} Checkups Logged • {smsLogs.length} SMS Dispatched</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('reports')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 text-purple-700 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">Reports & Analytics</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Date-wise counts, patient frequencies & summaries</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
                      <span>View Reports</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveModule('database')}
                    className="bg-white p-5 rounded-lg border border-slate-200 hover:border-sky-500 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-teal-50 text-teal-700 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">Database Inspector</h3>
                        <p className="text-xs text-slate-500 mt-0.5">View raw normalized tables and foreign key relations</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                      <span>Inspect Schema</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Recent Clinical Visits Table Preview */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Recent Patient Case Visits (Live MySQL Feed)</h3>
                    <button
                      onClick={() => setActiveModule('history')}
                      className="text-xs text-sky-700 hover:underline font-semibold"
                    >
                      View All in Multi-Visit Explorer →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Case ID</th>
                          <th className="px-4 py-2.5">Patient ID</th>
                          <th className="px-4 py-2.5">Patient Name</th>
                          <th className="px-4 py-2.5">Visit Date</th>
                          <th className="px-4 py-2.5">Chief Complaint</th>
                          <th className="px-4 py-2.5">Attending Doctor</th>
                          <th className="px-4 py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {cases.slice(0, 5).map((c) => {
                          const patient = patients.find((p) => p.patientId === c.patientId);
                          return (
                            <tr key={c.caseId} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-mono font-medium text-slate-800">#{c.caseId}</td>
                              <td className="px-4 py-3 font-mono text-sky-700 font-semibold">{c.patientId}</td>
                              <td className="px-4 py-3 font-medium text-slate-900">{patient?.name || 'Unknown'}</td>
                              <td className="px-4 py-3 text-slate-600">{c.visitDate}</td>
                              <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{c.chiefComplaint}</td>
                              <td className="px-4 py-3 text-slate-600">{c.doctorName || 'Dr. Sarah Jenkins'}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => {
                                    setHistoryPatientQuery(c.patientId);
                                    setSelectedCaseId(c.caseId);
                                    setActiveModule('history');
                                  }}
                                  className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded font-semibold text-[11px]"
                                >
                                  View Case
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PATIENT REGISTRATION MODULE */}
            {activeModule === 'register' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-3xl mx-auto overflow-hidden">
                <div className="px-6 py-4 bg-sky-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-5 h-5 text-sky-300" />
                    <h3 className="text-base font-bold">Patient Registration (New Inpatient / Outpatient)</h3>
                  </div>
                </div>

                <form onSubmit={handleRegisterPatient} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Patient ID */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient ID (Primary Key): <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regPatientId}
                        onChange={(e) => setRegPatientId(e.target.value)}
                        placeholder="e.g. PAT-1005"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Validated against duplicate primary key in MySQL</p>
                    </div>

                    {/* Patient Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Margaret Smith"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        placeholder="e.g. 42"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Must be a valid integer between 1 and 125</p>
                    </div>

                    {/* Gender Radio Buttons */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Gender (JRadioButton Group): <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={regGender === 'Male'}
                            onChange={() => setRegGender('Male')}
                          />
                          <span>Male</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={regGender === 'Female'}
                            onChange={() => setRegGender('Female')}
                          />
                          <span>Female</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Other"
                            checked={regGender === 'Other'}
                            onChange={() => setRegGender('Other')}
                          />
                          <span>Other</span>
                        </label>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number (10 Digits): <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Validated strictly via Regex ^[0-9]{'{10}'}$</p>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Blood Group (JComboBox): <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 bg-white"
                        required
                      >
                        <option value="Select">-- Select Blood Group --</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Address (JTextArea): <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      rows={2}
                      placeholder="e.g. 104 Blossom Heights, Near City Hospital"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  {/* INPATIENT ADMISSION & WARD BED ALLOCATION SECTION */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BedIcon className="w-4 h-4 text-sky-700" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                            Admission & Ward Bed Allocation
                          </h4>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {beds.filter((b) => b.status === 'Available').length} Beds Currently Vacant
                        </span>
                      </div>

                      {/* Admission Type Radio */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`flex items-center gap-2.5 p-3 rounded-md border cursor-pointer transition ${
                            regAdmissionType === 'OPD'
                              ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="admissionType"
                            value="OPD"
                            checked={regAdmissionType === 'OPD'}
                            onChange={() => setRegAdmissionType('OPD')}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <div>
                            <p className="text-xs">Outpatient (OPD)</p>
                            <p className="text-[11px] text-slate-500 font-normal">Doctor consultation only, no bed assigned</p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-2.5 p-3 rounded-md border cursor-pointer transition ${
                            regAdmissionType === 'IPD'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="admissionType"
                            value="IPD"
                            checked={regAdmissionType === 'IPD'}
                            onChange={() => setRegAdmissionType('IPD')}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs">Inpatient (IPD) - Hospitalize</p>
                            <p className="text-[11px] text-slate-500 font-normal">Allocate hospital ward bed immediately</p>
                          </div>
                        </label>
                      </div>

                      {/* When IPD is selected: Ward & Bed selectors */}
                      {regAdmissionType === 'IPD' && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 bg-white p-3.5 rounded border border-emerald-200/80">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Ward Selector */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Select Hospital Ward: <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={regWardId}
                                onChange={(e) => {
                                  const newWardId = e.target.value;
                                  setRegWardId(newWardId);
                                  const firstAvail = beds.find((b) => b.wardId === newWardId && b.status === 'Available');
                                  if (firstAvail) setRegBedId(firstAvail.bedId);
                                  else setRegBedId('');
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 bg-white"
                              >
                                {wards.map((w) => {
                                  const wardBeds = beds.filter((b) => b.wardId === w.wardId);
                                  const vacantCount = wardBeds.filter((b) => b.status === 'Available').length;
                                  return (
                                    <option key={w.wardId} value={w.wardId}>
                                      {w.wardName} ({vacantCount} vacant / {w.totalBeds} total)
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            {/* Bed Selector */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Allocate Vacant Bed: <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={regBedId}
                                onChange={(e) => setRegBedId(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                              >
                                {beds.filter((b) => b.wardId === regWardId && b.status === 'Available').length === 0 ? (
                                  <option value="">No beds available in this ward</option>
                                ) : (
                                  beds
                                    .filter((b) => b.wardId === regWardId && b.status === 'Available')
                                    .map((b) => (
                                      <option key={b.bedId} value={b.bedId}>
                                        Bed {b.bedNumber} (Room {b.roomNumber}) - ${b.dailyRate}/day
                                      </option>
                                    ))
                                )}
                              </select>
                            </div>
                          </div>

                          {/* Selected Bed Details Preview */}
                          {(() => {
                            const currentSelectedBed = beds.find((b) => b.bedId === regBedId);
                            if (!currentSelectedBed) {
                              return (
                                <div className="p-2.5 bg-amber-50 text-amber-800 rounded border border-amber-200 text-xs flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                  <span>⚠️ All beds in this ward are occupied! Please select a different ward.</span>
                                </div>
                              );
                            }
                            return (
                              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs">
                                    {currentSelectedBed.bedNumber}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">
                                      {currentSelectedBed.wardName} • Room {currentSelectedBed.roomNumber}
                                    </p>
                                    <p className="text-[11px] text-slate-600">
                                      Floor: {currentSelectedBed.floor} • Standard Bed Rate: ${currentSelectedBed.dailyRate}/day
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px]">
                                  {currentSelectedBed.hasOxygen && (
                                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-medium">
                                      Oxygen Support
                                    </span>
                                  )}
                                  {currentSelectedBed.hasVentilator && (
                                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-medium">
                                      Ventilator Ready
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                                    ✓ Available for Allocation
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROUTINE WEEKLY CHECKING & MISSED CHECKUP SMS ENROLLMENT */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-sky-50/70 p-4 rounded-lg border border-sky-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-800" />
                          <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                            Routine Weekly Checking & SMS Alert Registration
                          </h4>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold text-sky-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={regHasRoutineCheckup}
                            onChange={(e) => setRegHasRoutineCheckup(e.target.checked)}
                            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                          />
                          <span>Enroll in Routine Weekly Checking</span>
                        </label>
                      </div>

                      <p className="text-[11px] text-slate-600">
                        Tracks weekly clinical vitals and visits. If a checkup is missed, an automated alert SMS will be dispatched to the mobile number registered above (<strong>{regMobile || '10-digit mobile'}</strong>).
                      </p>

                      {regHasRoutineCheckup && (
                        <div className="mt-3 pt-3 border-t border-sky-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Checkup Frequency:</label>
                            <select
                              value={regCheckupFrequency}
                              onChange={(e) => setRegCheckupFrequency(e.target.value as any)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                            >
                              <option value="Weekly">Weekly (Every 7 Days)</option>
                              <option value="Bi-Weekly">Bi-Weekly (Every 14 Days)</option>
                              <option value="Monthly">Monthly (Every 30 Days)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Preferred Checkup Day:</label>
                            <select
                              value={regPreferredDay}
                              onChange={(e) => setRegPreferredDay(e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                            >
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">Clinical Purpose / Condition:</label>
                            <input
                              type="text"
                              value={regRoutineCondition}
                              onChange={(e) => setRegRoutineCondition(e.target.value)}
                              placeholder="e.g. Hypertension, Blood Sugar, Post-Op"
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs"
                            >
                            </input>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleFillDemoPatient}
                      className="w-full sm:w-auto px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      title="1-Click Auto-fill a realistic patient record with address, blood group, bed allocation and routine checks"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>⚡ Auto-fill Sample Patient</span>
                    </button>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setRegName('');
                          setRegAge('');
                          setRegMobile('');
                          setRegAddress('');
                          setRegBloodGroup('Select');
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition text-center"
                      >
                        Clear Form
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-initial px-5 sm:px-6 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded text-xs font-bold shadow transition text-center whitespace-nowrap"
                      >
                        Save Patient
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* PATIENT MANAGEMENT MODULE */}
            {activeModule === 'manage' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden space-y-4">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Filter:</span>
                    <div className="inline-flex rounded-md shadow-xs bg-slate-100 p-0.5 border border-slate-200">
                      <button
                        onClick={() => setPatientArchiveFilter('ACTIVE')}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                          patientArchiveFilter === 'ACTIVE'
                            ? 'bg-white text-slate-800 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Active ({patients.filter((p) => p.status !== 'ARCHIVED').length})
                      </button>
                      <button
                        onClick={() => setPatientArchiveFilter('ARCHIVED')}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                          patientArchiveFilter === 'ARCHIVED'
                            ? 'bg-white text-slate-800 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Archived ({patients.filter((p) => p.status === 'ARCHIVED').length})
                      </button>
                      <button
                        onClick={() => setPatientArchiveFilter('ALL')}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                          patientArchiveFilter === 'ALL'
                            ? 'bg-white text-slate-800 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({patients.length})
                      </button>
                    </div>

                    <select
                      value={managementSearchType}
                      onChange={(e) => setManagementSearchType(e.target.value as any)}
                      className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="All">All Fields</option>
                      <option value="Patient ID">Patient ID</option>
                      <option value="Name">Patient Name</option>
                      <option value="Mobile">Mobile Number</option>
                    </select>

                    <div className="relative">
                      <input
                        type="text"
                        value={managementSearchQuery}
                        onChange={(e) => setManagementSearchQuery(e.target.value)}
                        placeholder="Search patient name, ID, phone..."
                        className="text-xs px-3 py-1.5 pl-8 border border-slate-300 rounded w-48 sm:w-64 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModule('register')}
                      className="px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto p-2 sm:p-4">
                  <table className="w-full text-left text-xs border border-slate-200 rounded min-w-[700px]">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-3.5 py-2.5">Patient ID</th>
                        <th className="px-3.5 py-2.5">Name</th>
                        <th className="px-3.5 py-2.5">Age/Gender</th>
                        <th className="px-3.5 py-2.5">Mobile</th>
                        <th className="px-3.5 py-2.5">Blood Group</th>
                        <th className="px-3.5 py-2.5">Admission / Bed</th>
                        <th className="px-3.5 py-2.5">Routine Checks</th>
                        <th className="px-3.5 py-2.5">Visits</th>
                        <th className="px-3.5 py-2.5 text-right">Clinical Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                            No matching patient records found in MySQL database.
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((p) => {
                          const patientVisits = cases.filter((c) => c.patientId === p.patientId).length;
                          const patientBed = beds.find((b) => b.patientId === p.patientId && b.status === 'Occupied');
                          const isArchived = p.status === 'ARCHIVED';
                          const isSelected = selectedPatientId === p.patientId;
                          return (
                            <tr
                              key={p.patientId}
                              onClick={() => {
                                setSelectedPatientId(p.patientId);
                                setCasePatientId(p.patientId);
                                setHistoryPatientQuery(p.patientId);
                                showToast(`Active patient set to ${p.name} (${p.patientId})`, 'info');
                              }}
                              className={`cursor-pointer transition ${
                                isSelected
                                  ? 'bg-sky-50/90 ring-1 ring-sky-400/80 font-medium'
                                  : 'hover:bg-slate-50'
                              } ${isArchived ? 'bg-amber-50/40 opacity-75' : ''}`}
                            >
                              <td className="px-3.5 py-2.5 font-mono font-bold text-sky-800">
                                <div className="flex items-center gap-1.5">
                                  {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" title="Active working patient" />
                                  )}
                                  <span>{p.patientId}</span>
                                  {isSelected && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-sky-600 text-white font-bold">
                                      ACTIVE
                                    </span>
                                  )}
                                  {isArchived && (
                                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-200 text-amber-900 font-bold">
                                      ARCHIVED
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3.5 py-2.5 font-medium text-slate-900">{p.name}</td>
                              <td className="px-3.5 py-2.5">
                                {p.age} yrs • {p.gender}
                              </td>
                              <td className="px-3.5 py-2.5 font-mono">{p.mobile}</td>
                              <td className="px-3.5 py-2.5">
                                <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                                  {p.bloodGroup}
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5">
                                {patientBed ? (
                                  <div className="flex items-center gap-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] bg-sky-50 text-sky-800 border border-sky-200">
                                      <BedIcon className="w-3 h-3 text-sky-600" />
                                      {patientBed.bedNumber} ({patientBed.wardName})
                                    </span>
                                  </div>
                                ) : p.admissionType === 'IPD' && p.bedStatus === 'Discharged' ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-500 font-medium">
                                    Discharged IPD
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 font-medium">
                                    OPD Patient
                                  </span>
                                )}
                              </td>
                              <td className="px-3.5 py-2.5">
                                {p.hasRoutineCheckup ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                    {p.checkupFrequency || 'Weekly'} ({p.preferredDay || 'Mon'})
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">None</span>
                                )}
                              </td>
                              <td className="px-3.5 py-2.5">
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {patientVisits} visit(s)
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5 text-right space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setSelectedPatientId(p.patientId);
                                    setCasePatientId(p.patientId);
                                    setHistoryPatientQuery(p.patientId);
                                    showToast(`Active patient set to ${p.name}`, 'info');
                                  }}
                                  className={`px-2 py-1 rounded font-semibold text-[11px] transition inline-flex items-center gap-1 ${
                                    isSelected
                                      ? 'bg-sky-600 text-white font-bold shadow-2xs'
                                      : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300'
                                  }`}
                                  title="Set as active working patient across all clinical modules"
                                >
                                  {isSelected ? '✓ Active' : 'Select'}
                                </button>
                                <button
                                  onClick={() => handleStartEditPatient(p)}
                                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] transition inline-flex items-center gap-1 border border-amber-300"
                                  title="Edit Patient Details (Name, Age, Mobile, Ward/Bed, Routine Schedule)"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-800" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDownloadPdfForPatient(p)}
                                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold text-[11px] transition inline-flex items-center gap-1"
                                  title="Download Complete Patient Dossier in .pdf format"
                                >
                                  <FileDown className="w-3 h-3 text-emerald-700" />
                                  <span>PDF</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPatientId(p.patientId);
                                    setActiveModule('timeline');
                                  }}
                                  className="px-2 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded font-semibold text-[11px] transition"
                                  title="View Longitudinal Timeline & Vitals Trajectory"
                                >
                                  📈 Timeline
                                </button>
                                <button
                                  onClick={() => setEmergencyPatient(p)}
                                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-semibold text-[11px] transition"
                                  title="Emergency 10-Second Quick View Triage"
                                >
                                  🚨 Emergency
                                </button>
                                <button
                                  onClick={() => setQrPatient(p)}
                                  className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition"
                                  title="Generate Patient Digital Bedside QR Code"
                                >
                                  <QrCode className="w-3.5 h-3.5 inline" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPatientId(p.patientId);
                                    setActiveModule('documents');
                                  }}
                                  className="px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition"
                                  title="View Patient Scans & Diagnostic Documents"
                                >
                                  <FolderOpen className="w-3.5 h-3.5 inline" />
                                </button>
                                <button
                                  onClick={() => {
                                    setHistoryPatientQuery(p.patientId);
                                    setActiveModule('history');
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                                  title="View Multi-Visit Clinical History"
                                >
                                  History
                                </button>
                                <button
                                  onClick={() => {
                                    setCasePatientId(p.patientId);
                                    setActiveModule('new_case');
                                  }}
                                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-semibold text-[11px]"
                                  title="Record New Case"
                                >
                                  + Case
                                </button>
                                {isArchived ? (
                                  <button
                                    onClick={() => handleRestorePatient(p.patientId)}
                                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px]"
                                    title="Restore Patient from Archives"
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleArchivePatient(p.patientId)}
                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-semibold text-[11px]"
                                    title="Archive Patient Record (Soft Delete)"
                                  >
                                    Archive
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePatient(p.patientId)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-[11px]"
                                  title="Delete Patient Record Permanently"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* WARD & BED MANAGEMENT MODULE */}
            {activeModule === 'wards' && (
              <WardBedManagement
                wards={wards}
                beds={beds}
                patients={patients}
                onAllocateBed={handleAllocateBed}
                onVacateBed={handleVacateBed}
                onTransferBed={handleTransferBed}
                onSetBedStatus={handleSetBedStatus}
                onNavigateToRegister={handleNavigateToRegister}
              />
            )}

            {/* NEW CASE-TAKING MODULE */}
            {activeModule === 'new_case' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-sky-900 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold">Clinical Case-Taking & Prescription</h3>
                    <p className="text-xs text-sky-200">
                      Atomic Transaction: Patient → CaseHistory → Examination → Diagnosis → Prescription → FollowUp
                    </p>
                  </div>
                </div>

                {/* Dynamic Case Completeness Bar */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">Case Documentation Completeness:</span>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded font-mono ${
                          caseCompletenessPercentage === 100
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : caseCompletenessPercentage >= 60
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {caseCompletenessPercentage}% Complete
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isHistoryComplete ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        {isHistoryComplete ? '✓' : '○'} History
                      </span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isExamComplete ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        {isExamComplete ? '✓' : '○'} Vitals
                      </span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isDiagComplete ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        {isDiagComplete ? '✓' : '○'} Diagnosis
                      </span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isPrescriptionComplete ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        {isPrescriptionComplete ? '✓' : '○'} Rx ({medItems.length})
                      </span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isFollowUpComplete ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                        {isFollowUpComplete ? '✓' : '○'} Follow-up
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        caseCompletenessPercentage === 100
                          ? 'bg-emerald-600'
                          : caseCompletenessPercentage >= 60
                          ? 'bg-sky-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${caseCompletenessPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* User-Friendly Quick Clinical Presets (1-Click Autofill) */}
                <div className="bg-sky-50/70 px-6 py-2.5 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-sky-950 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Quick Clinical Templates:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {CLINICAL_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyClinicalPreset(idx)}
                        className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 rounded text-[11px] font-medium transition shadow-2xs flex items-center gap-1"
                        title={`Click to auto-populate ${preset.name} clinical case fields`}
                      >
                        <span>{preset.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleResetCaseForm}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px] transition ml-1"
                      title="Clear all form fields"
                    >
                      Clear Fields
                    </button>
                  </div>
                </div>

                {/* Step Progression Navigation Bar */}
                <div className="bg-slate-100/90 px-6 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-600 text-[11px]">Workflow Steps:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => document.getElementById('case-section-1')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-800 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>History</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('case-section-2')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-800 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>Vitals & Exam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('case-section-3')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-800 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>Diagnosis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('case-section-4')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-800 text-white flex items-center justify-center text-[10px]">4</span>
                      <span>Prescription</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById('case-section-5')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                    >
                      <span className="w-4 h-4 rounded-full bg-sky-800 text-white flex items-center justify-center text-[10px]">5</span>
                      <span>Follow-up</span>
                    </button>
                  </div>
                </div>

                {editingCaseId !== null && (
                  <div className="mx-6 mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-800 shrink-0" />
                      <div>
                        <span className="font-bold uppercase tracking-wide">Edit Mode Active: Encounter #{editingCaseId}</span>
                        <p className="text-slate-700 mt-0.5">
                          You are editing previously saved clinical history, physical examination vitals, diagnosis, medicines, and follow-up. Saving updates the existing record directly without creating duplicate entries.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEditCase}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 font-semibold text-xs transition"
                    >
                      Cancel Editing
                    </button>
                  </div>
                )}

                {/* Role Permission Guidance Banner */}
                <div className={`px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b ${
                  isDoctor
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : isNurse
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-white border border-slate-300">
                      Logged-in Role: {currentRole}
                    </span>
                    <span>
                      {isDoctor && 'Full Clinical Authority: Examination, Diagnosis, Prescription, and Follow-up are fully editable.'}
                      {isNurse && 'Nursing Work Authority: Vitals, examination survey, and nursing notes are enabled. Diagnosis and Prescriptions are read-only.'}
                      {isReceptionist && 'Front-Desk Authority: Registration and appointments are enabled. Clinical examination, diagnosis, and prescriptions are read-only.'}
                    </span>
                  </div>
                  {(!canManageDiagnosis || !canManagePrescription) && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Doctor-Only Fields Locked
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveCompleteCase} className="p-6 space-y-6">
                  {/* Step 1: Patient Selection & Symptoms */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">1</span>
                        <span>Patient Identification & Clinical Case History</span>
                      </div>
                      {isReceptionist && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                          Clinical Info: Read-Only for Receptionist
                        </span>
                      )}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Select Registered Patient: <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={casePatientId}
                          onChange={(e) => setCasePatientId(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white font-mono"
                        >
                          {patients.map((p) => (
                            <option key={p.patientId} value={p.patientId}>
                              {p.patientId} - {p.name} ({p.gender}, {p.age}y)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Visit Date (YYYY-MM-DD): <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={caseVisitDate}
                          onChange={(e) => setCaseVisitDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Symptoms Duration: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={caseDuration}
                          onChange={(e) => setCaseDuration(e.target.value)}
                          placeholder="e.g. 4 days / 2 weeks"
                          disabled={isReceptionist}
                          className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Chief Complaint:*
                        </label>
                        <input
                          type="text"
                          value={caseChiefComplaint}
                          onChange={(e) => setCaseChiefComplaint(e.target.value)}
                          placeholder="e.g. Severe throbbing headache, fever with evening chills, body aches"
                          disabled={isReceptionist}
                          className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Detailed Symptoms (JTextArea):*
                        </label>
                        <textarea
                          value={caseSymptoms}
                          onChange={(e) => setCaseSymptoms(e.target.value)}
                          rows={2}
                          placeholder="Describe symptom onset, character, radiation, relieving and aggravating factors..."
                          disabled={isReceptionist}
                          className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          required
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Past Medical History:</label>
                          <input
                            type="text"
                            value={casePastHistory}
                            onChange={(e) => setCasePastHistory(e.target.value)}
                            placeholder="e.g. HTN, Diabetes"
                            disabled={isReceptionist}
                            className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Known Allergies:</label>
                          <input
                            type="text"
                            value={caseAllergy}
                            onChange={(e) => setCaseAllergy(e.target.value)}
                            placeholder="e.g. Penicillin, Sulfa"
                            disabled={isReceptionist}
                            className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Family History:</label>
                          <input
                            type="text"
                            value={caseFamilyHistory}
                            onChange={(e) => setCaseFamilyHistory(e.target.value)}
                            placeholder="e.g. Paternal CAD"
                            disabled={isReceptionist}
                            className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Current Medication:</label>
                          <input
                            type="text"
                            value={caseCurrentMedication}
                            onChange={(e) => setCaseCurrentMedication(e.target.value)}
                            placeholder="e.g. Metformin 500mg"
                            disabled={isReceptionist}
                            className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${isReceptionist ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Physical Examination */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">2</span>
                        <span>Physical Examination & Vital Signs</span>
                      </div>
                      {!canManageExamination ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Doctor & Nurse Only (Read-Only for Receptionist)
                        </span>
                      ) : isNurse ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                          Nursing Vitals & Survey Active
                        </span>
                      ) : null}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Temperature (°F):</label>
                        <input
                          type="text"
                          value={examTemp}
                          onChange={(e) => setExamTemp(e.target.value)}
                          disabled={!canManageExamination}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Pressure (BP):</label>
                        <input
                          type="text"
                          value={examBP}
                          onChange={(e) => setExamBP(e.target.value)}
                          disabled={!canManageExamination}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pulse Rate (bpm):</label>
                        <input
                          type="text"
                          value={examPulse}
                          onChange={(e) => setExamPulse(e.target.value)}
                          disabled={!canManageExamination}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg):</label>
                        <input
                          type="text"
                          value={examWeight}
                          onChange={(e) => setExamWeight(e.target.value)}
                          disabled={!canManageExamination}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm):</label>
                        <input
                          type="text"
                          value={examHeight}
                          onChange={(e) => setExamHeight(e.target.value)}
                          disabled={!canManageExamination}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">General Clinical Observations:</label>
                      <input
                        type="text"
                        value={examObservation}
                        onChange={(e) => setExamObservation(e.target.value)}
                        placeholder="e.g. Mild pallor, no icterus, chest bilateral clear vesicular breath sounds"
                        disabled={!canManageExamination}
                        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${!canManageExamination ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                      />
                    </div>
                  </div>

                  {/* Step 3: Diagnosis */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">3</span>
                        <span>Clinical Diagnosis & Doctor Notes</span>
                      </div>
                      {!canManageDiagnosis && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Doctor Only (Read-Only for {currentRole})
                        </span>
                      )}
                    </h4>

                    {!canManageDiagnosis && (
                      <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Medical diagnoses and clinical notes are doctor-only and read-only for {currentRole}.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Medical Diagnosis:*
                        </label>
                        <input
                          type="text"
                          value={diagText}
                          onChange={(e) => setDiagText(e.target.value)}
                          placeholder="e.g. Acute Bronchitis with Reactive Airway Disease"
                          disabled={!canManageDiagnosis}
                          className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${!canManageDiagnosis ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-white'}`}
                          required={canManageDiagnosis}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Doctor Notes & Clinical Advice:
                        </label>
                        <input
                          type="text"
                          value={diagNotes}
                          onChange={(e) => setDiagNotes(e.target.value)}
                          placeholder="e.g. Steam inhalation TID, chest physiotherapy, avoid cold beverages"
                          disabled={!canManageDiagnosis}
                          className={`w-full px-3 py-2 text-sm border border-slate-300 rounded ${!canManageDiagnosis ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-white'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Prescription Medicines (Multiple Items) */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">4</span>
                        <span>Prescription (Multiple Medicines per Case Requirement)</span>
                      </div>
                      {!canManagePrescription && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Doctor Only (Read-Only for {currentRole})
                        </span>
                      )}
                    </h4>

                    {/* Add Medicine Row Form (Doctor Only) */}
                    {canManagePrescription ? (
                      <div className="space-y-3 mb-3">
                        {/* Quick Common Medications Chips */}
                        <div className="p-2.5 bg-sky-50/70 border border-sky-200/80 rounded-lg flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="text-[11px] font-bold text-sky-900 mr-1 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Quick Add Common Drugs:</span>
                          </span>
                          {QUICK_MEDICINES.map((med) => (
                            <button
                              key={med.name}
                              type="button"
                              onClick={() => handleQuickAddMedicine(med)}
                              className="px-2 py-1 rounded bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 text-[11px] font-semibold transition shadow-2xs flex items-center gap-1"
                              title={`Click to instantly add ${med.name} (${med.freq}, ${med.duration}) to Rx`}
                            >
                              <Plus className="w-2.5 h-2.5 text-sky-600" />
                              <span>{med.name.replace(/^(Tab\.|Cap\.|Syp\.)\s*/, '')}</span>
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end p-3 bg-white border border-slate-200 rounded">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Medicine Name:</label>
                          <input
                            type="text"
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            placeholder="e.g. Tab. Azithromycin 500mg"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dosage:</label>
                          <input
                            type="text"
                            value={newMedDosage}
                            onChange={(e) => setNewMedDosage(e.target.value)}
                            placeholder="e.g. 1 Tab"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Frequency:</label>
                          <select
                            value={newMedFreq}
                            onChange={(e) => setNewMedFreq(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                          >
                            <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                            <option value="0-1-0 (Afternoon)">0-1-0 (Afternoon)</option>
                            <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                            <option value="1-0-1 (Twice daily)">1-0-1 (Twice daily)</option>
                            <option value="1-1-1 (Thrice daily)">1-1-1 (Thrice daily)</option>
                            <option value="SOS (As needed)">SOS (As needed)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Duration:</label>
                          <input
                            type="text"
                            value={newMedDuration}
                            onChange={(e) => setNewMedDuration(e.target.value)}
                            placeholder="e.g. 5 days"
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={handleAddMedicine}
                            className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Drug
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Prescription regimen and pharmaceutical drug dispensing can only be managed by Doctors. (Read-Only for {currentRole})</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                          Clinician Protected
                        </span>
                      </div>
                    )}

                    {/* Medicines List Table */}
                    <div className="overflow-x-auto bg-white border border-slate-200 rounded">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Medicine Name</th>
                            <th className="px-3 py-2">Dosage</th>
                            <th className="px-3 py-2">Frequency</th>
                            <th className="px-3 py-2">Duration</th>
                            <th className="px-3 py-2">Instructions</th>
                            <th className="px-3 py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {medItems.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-3 py-4 text-center text-slate-400 text-xs">
                                No medicines prescribed in this encounter.
                              </td>
                            </tr>
                          ) : (
                            medItems.map((med, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                                <td className="px-3 py-2 font-bold text-slate-800">{med.medicineName}</td>
                                <td className="px-3 py-2">{med.dosage}</td>
                                <td className="px-3 py-2">{med.frequency}</td>
                                <td className="px-3 py-2">{med.duration}</td>
                                <td className="px-3 py-2 text-slate-600">{med.instructions}</td>
                                <td className="px-3 py-2 text-right">
                                  {canManagePrescription ? (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMedicine(idx)}
                                      className="text-rose-600 hover:text-rose-800 p-1"
                                      title="Remove this medicine"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-slate-400" /> Locked
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Step 5: Follow-Up Record */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">5</span>
                        <span>Follow-up Scheduling & Appointments</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Enabled for Doctor, Nurse & Receptionist
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date:</label>
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Review Clinical Notes:</label>
                        <input
                          type="text"
                          value={followUpNotes}
                          onChange={(e) => setFollowUpNotes(e.target.value)}
                          placeholder="e.g. Check temperature and CBC report"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Status:</label>
                        <select
                          value={followUpStatus}
                          onChange={(e) => setFollowUpStatus(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Missed">Missed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 6: Case Status & Handover Notes */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center text-[11px]">6</span>
                      Case Treatment Status & Inter-Doctor Handover Notes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Case Treatment Status:
                        </label>
                        <select
                          value={caseStatus}
                          onChange={(e) => setCaseStatus(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        >
                          <option value="Under Treatment">Under Treatment</option>
                          <option value="Follow-up Required">Follow-up Required</option>
                          <option value="Completed">Completed / Discharged</option>
                          <option value="Open">Open</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Attending Doctor Advice:
                        </label>
                        <input
                          type="text"
                          value={caseDoctorNotes}
                          onChange={(e) => setCaseDoctorNotes(e.target.value)}
                          placeholder="e.g. Patient stable, monitor temperature chart"
                          disabled={!canManageDiagnosis}
                          className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded ${!canManageDiagnosis ? 'bg-slate-100 cursor-not-allowed text-slate-600' : 'bg-white'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nursing & Clinical Handover Notes:
                        </label>
                        <input
                          type="text"
                          value={caseHandoverNotes}
                          onChange={(e) => setCaseHandoverNotes(e.target.value)}
                          placeholder="e.g. Check morning blood sugar before dose"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Case Completeness: <strong className="text-slate-800 font-mono">{caseCompletenessPercentage}%</strong>
                      {caseCompletenessPercentage < 100 && (
                        <span className="text-amber-700 ml-1.5">(Can still be saved as work-in-progress)</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {editingCaseId !== null && (
                        <button
                          type="button"
                          onClick={handleCancelEditCase}
                          className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm font-semibold transition"
                        >
                          Cancel
                        </button>
                      )}

                      {isReceptionist ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
                            🔒 Clinical submission restricted to Clinicians (Read-Only)
                          </span>
                          <button
                            type="button"
                            disabled
                            className="px-6 py-2.5 bg-slate-200 text-slate-500 rounded text-sm font-bold shadow-xs cursor-not-allowed flex items-center gap-2"
                            title="Receptionists can view records but cannot modify clinical examinations, diagnoses, or prescriptions."
                          >
                            <Lock className="w-4 h-4" /> Save Restricted (Receptionist)
                          </button>
                        </div>
                      ) : isNurse ? (
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-sm font-bold shadow-md transition flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {editingCaseId !== null
                            ? `Update Nursing Observations #${editingCaseId}`
                            : 'Save Nursing Observations & Vitals'}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={`px-6 py-2.5 text-white rounded text-sm font-bold shadow-md transition flex items-center gap-2 ${
                            editingCaseId !== null
                              ? 'bg-amber-600 hover:bg-amber-700'
                              : 'bg-sky-900 hover:bg-sky-800'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />{' '}
                          {editingCaseId !== null
                            ? `Update Existing Encounter #${editingCaseId} (No Duplicates)`
                            : 'Save Complete Case (PreparedStatement Transaction)'}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* MULTI-VISIT PATIENT CASE HISTORY MODULE */}
            {activeModule === 'history' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden space-y-4">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search by Patient Name */}
                    <div className="relative w-56 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={historyNameSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHistoryNameSearch(val);
                          const match = patients.find((p) =>
                            p.name.toLowerCase().includes(val.toLowerCase())
                          );
                          if (match) {
                            setHistoryPatientQuery(match.patientId);
                            const firstCase = cases.find((c) => c.patientId === match.patientId);
                            setSelectedCaseId(firstCase ? firstCase.caseId : null);
                          }
                        }}
                        placeholder="Search patient by name..."
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Or Select:</span>
                      <select
                        value={historyPatientQuery}
                        onChange={(e) => {
                          setHistoryPatientQuery(e.target.value);
                          const firstCase = cases.find((c) => c.patientId === e.target.value);
                          setSelectedCaseId(firstCase ? firstCase.caseId : null);
                        }}
                        className="text-xs px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
                      >
                        {patients.map((p) => (
                          <option key={p.patientId} value={p.patientId}>
                            {p.name} ({p.patientId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* PDF DOWNLOAD BUTTON (NOT ZIP FORMAT) */}
                    <button
                      onClick={() => handleDownloadPdfForPatient(currentHistoryPatient)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      title="Download complete medical record & weekly checking in simple PDF format"
                    >
                      <FileDown className="w-3.5 h-3.5" /> Download Record (.PDF)
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Case File
                    </button>
                  </div>
                </div>

                {/* Patient Summary Card */}
                {currentHistoryPatient ? (
                  <div className="px-6 py-3 bg-sky-50/70 border-y border-sky-100 flex flex-wrap items-center justify-between gap-4 text-xs text-sky-950">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-slate-500">Patient:</span>{' '}
                        <span className="font-bold text-slate-900">{currentHistoryPatient.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">ID:</span>{' '}
                        <span className="font-mono font-bold text-sky-800">{currentHistoryPatient.patientId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Demographics:</span> {currentHistoryPatient.age} yrs / {currentHistoryPatient.gender}
                      </div>
                      <div>
                        <span className="text-slate-500">Blood Group:</span>{' '}
                        <span className="font-bold text-rose-700">{currentHistoryPatient.bloodGroup}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Registered Mobile:</span>{' '}
                        <span className="font-mono font-bold text-slate-900">{currentHistoryPatient.mobile}</span>
                      </div>
                      {patientRoutineCheckups.length > 0 && (
                        <div>
                          <span className="text-slate-500">Routine Checking:</span>{' '}
                          <span className="font-semibold text-sky-900">
                            {currentHistoryPatient.checkupFrequency || 'Weekly'} ({currentHistoryPatient.preferredDay || 'Mon'})
                          </span>
                        </div>
                      )}
                      {patientRoutineCheckups.length === 0 && (
                        <div>
                          <span className="text-slate-500">Admission:</span>{' '}
                          <span className="font-medium text-slate-800">
                            {currentHistoryPatient.admissionType || 'Outpatient (OPD)'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStartEditPatient(currentHistoryPatient)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded font-semibold text-xs flex items-center gap-1 transition shadow-2xs"
                        title="Edit Patient Details (Name, Age, Gender, Address, Mobile, Ward, Routine Schedule)"
                      >
                        <Edit3 className="w-3 h-3 text-amber-800" />
                        <span>Edit Patient Info</span>
                      </button>
                      <div>
                        <span className="text-slate-500">Clinical Visits:</span>{' '}
                        <span className="font-bold text-emerald-700">{patientCaseList.length}</span>
                      </div>
                      {patientRoutineCheckups.length > 0 && (
                        <div>
                          <span className="text-slate-500">Weekly Checkups:</span>{' '}
                          <span className="font-bold text-sky-700">{patientRoutineCheckups.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">Please select a registered patient.</div>
                )}

                {/* ROUTINE WEEKLY CHECKING TIMELINE & VITALS SECTION FOR CURRENT PATIENT */}
                {currentHistoryPatient && patientRoutineCheckups.length > 0 && (
                  <div className="mx-4 p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50/40 border border-sky-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-800" />
                        <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
                          Routine Weekly Checking Log & Missed Alerts for {currentHistoryPatient.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveModule('routine_sms')}
                        className="text-xs text-sky-700 hover:underline font-semibold flex items-center gap-1"
                      >
                        Manage in Dedicated Weekly Checks Center →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                      {patientRoutineCheckups.map((chk) => (
                        <div
                          key={chk.checkupId}
                          className={`p-3 rounded border text-xs bg-white space-y-1.5 shadow-xs ${
                            chk.status === 'Missed'
                              ? 'border-rose-300 bg-rose-50/30'
                              : chk.status === 'Completed'
                              ? 'border-emerald-200'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">Week {chk.weekNumber} Checkup</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                chk.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : chk.status === 'Missed'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {chk.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600">
                            Scheduled: <span className="font-medium text-slate-800">{chk.scheduledDate}</span>
                            {chk.completedDate && (
                              <span> • Completed: <span className="text-emerald-700">{chk.completedDate}</span></span>
                            )}
                          </div>

                          {chk.vitalSigns && (
                            <div className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-150 font-mono text-slate-700">
                              BP: {chk.vitalSigns.bloodPressure || '-'} | Pulse: {chk.vitalSigns.pulseRate || '-'} | Temp: {chk.vitalSigns.temperature || '-'} | Wt: {chk.vitalSigns.weightKg ? `${chk.vitalSigns.weightKg}kg` : '-'}
                            </div>
                          )}

                          {chk.doctorNotes && (
                            <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                              "{chk.doctorNotes}"
                            </p>
                          )}

                          {chk.status === 'Missed' && (
                            <div className="pt-1 border-t border-rose-200 flex items-center justify-between text-[11px]">
                              <span className="text-rose-700 font-semibold flex items-center gap-1">
                                <Bell className="w-3 h-3" />
                                {chk.missedAlertSent
                                  ? `Alert SMS sent to ${currentHistoryPatient.mobile}`
                                  : `Alert not yet sent`}
                              </span>
                              <button
                                onClick={() => handleQuickSendMissedSms(chk)}
                                className="px-2 py-0.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                              >
                                <Send className="w-2.5 h-2.5" /> {chk.missedAlertSent ? 'Resend SMS' : 'Dispatch SMS'}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Master-Detail Multi-Visit Layout (SplitPane simulation) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                  {/* Left Column: Visits List */}
                  <div className="md:col-span-1 border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                      Previous Visits Timeline
                    </h4>
                    {patientCaseList.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3">No cases recorded yet for this patient.</p>
                    ) : (
                      <div className="space-y-2">
                        {patientCaseList.map((c) => (
                          <button
                            key={c.caseId}
                            onClick={() => setSelectedCaseId(c.caseId)}
                            className={`w-full text-left p-2.5 rounded text-xs transition border ${
                              selectedCaseId === c.caseId
                                ? 'bg-sky-800 text-white border-sky-800 font-semibold shadow-sm'
                                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono">Visit #{c.caseId}</span>
                              <span className="text-[10px] opacity-80">{c.visitDate}</span>
                            </div>
                            <div className="truncate text-[11px] mt-1 opacity-90">{c.chiefComplaint}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Complete Visit Details */}
                  <div className="md:col-span-3 border border-slate-200 rounded-lg p-5 bg-white space-y-5">
                    {activeCaseRecord ? (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-xs text-slate-500">CLINICAL ENCOUNTER REPORT</span>
                            <h3 className="text-base font-bold text-slate-900">
                              Visit #{activeCaseRecord.caseId} — {activeCaseRecord.visitDate}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditCase(activeCaseRecord.caseId)}
                              className={`px-3 py-1.5 border rounded font-bold text-xs flex items-center gap-1.5 transition shadow-2xs ${
                                isReceptionist
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                                  : isNurse
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                              }`}
                              title={isReceptionist ? 'View encounter record in read-only mode' : isNurse ? 'Update nursing vitals and observations' : 'Edit complete clinical encounter'}
                            >
                              {isReceptionist ? <Lock className="w-3.5 h-3.5 text-slate-600" /> : <Edit3 className="w-3.5 h-3.5 text-amber-800" />}
                              <span>{isReceptionist ? 'View Encounter Details' : isNurse ? 'Update Nursing Vitals' : 'Edit Encounter Record'}</span>
                            </button>
                            <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                              Physician: <span className="font-semibold">{activeCaseRecord.doctorName || 'Dr. Sarah Jenkins'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Symptoms & Complaints */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <span className="font-bold text-slate-700 block mb-1">Chief Complaint:</span>
                            <p className="text-slate-800">{activeCaseRecord.chiefComplaint}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded border border-slate-200">
                            <span className="font-bold text-slate-700 block mb-1">Symptoms & Duration:</span>
                            <p className="text-slate-800">
                              {activeCaseRecord.symptoms} ({activeCaseRecord.duration})
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50/50 p-3 rounded border border-slate-200">
                          <div>
                            <span className="text-slate-500 block">Past History:</span>
                            <span className="font-medium text-slate-800">{activeCaseRecord.pastHistory || 'None'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Allergies:</span>
                            <span className="font-medium text-rose-700">{activeCaseRecord.allergy || 'NKDA'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Family History:</span>
                            <span className="font-medium text-slate-800">{activeCaseRecord.familyHistory || 'None'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Current Meds:</span>
                            <span className="font-medium text-slate-800">{activeCaseRecord.currentMedication || 'None'}</span>
                          </div>
                        </div>

                        {/* Physical Examination */}
                        {activeExamRecord && (
                          <div className="border border-slate-200 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                                Physical Examination (Vitals)
                              </h5>
                              {canManageExamination ? (
                                <button
                                  onClick={() => handleStartEditCase(activeCaseRecord.caseId)}
                                  className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit Vitals
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-slate-400" /> Clinician Only
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-[10px] text-slate-400 block">Temperature</span>
                                <span className="font-semibold text-slate-800">{activeExamRecord.temperature}</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                                <span className="font-semibold text-slate-800">{activeExamRecord.bloodPressure}</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-[10px] text-slate-400 block">Pulse Rate</span>
                                <span className="font-semibold text-slate-800">{activeExamRecord.pulseRate}</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded">
                                <span className="text-[10px] text-slate-400 block">Weight / Height</span>
                                <span className="font-semibold text-slate-800">
                                  {activeExamRecord.weight} / {activeExamRecord.height}
                                </span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded col-span-2 sm:col-span-1">
                                <span className="text-[10px] text-slate-400 block">Status</span>
                                <span className="font-semibold text-emerald-700">Recorded</span>
                              </div>
                            </div>
                            {activeExamRecord.observation && (
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50/50 p-2 rounded">
                                <span className="font-semibold">Observation:</span> {activeExamRecord.observation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Diagnosis */}
                        {activeDiagRecord && (
                          <div className="border border-sky-100 bg-sky-50/40 rounded p-3 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-bold text-sky-950 uppercase tracking-wide text-[11px]">
                                Final Clinical Diagnosis
                              </h5>
                              {canManageDiagnosis ? (
                                <button
                                  onClick={() => handleStartEditCase(activeCaseRecord.caseId)}
                                  className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit Diagnosis
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-slate-400" /> Doctor Only
                                </span>
                              )}
                            </div>
                            <p className="text-slate-900 font-semibold text-sm">{activeDiagRecord.diagnosisText}</p>
                            {activeDiagRecord.doctorNotes && (
                              <p className="text-slate-600 text-xs mt-1">
                                <span className="font-medium">Physician Advice:</span> {activeDiagRecord.doctorNotes}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Prescription Table */}
                        {activePrescRecord && (
                          <div className="border border-slate-200 rounded overflow-hidden">
                            <div className="px-3 py-2 bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-between">
                              <span>Prescription Regimen (Rx)</span>
                              {canManagePrescription ? (
                                <button
                                  onClick={() => handleStartEditCase(activeCaseRecord.caseId)}
                                  className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit Prescription & Medicines
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-slate-400" /> Doctor Only
                                </span>
                              )}
                            </div>
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                                <tr>
                                  <th className="px-3 py-2">Medicine</th>
                                  <th className="px-3 py-2">Dosage</th>
                                  <th className="px-3 py-2">Frequency</th>
                                  <th className="px-3 py-2">Duration</th>
                                  <th className="px-3 py-2">Instructions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {activePrescRecord.medicines.map((m) => (
                                  <tr key={m.itemId} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 font-bold text-slate-800">{m.medicineName}</td>
                                    <td className="px-3 py-2">{m.dosage}</td>
                                    <td className="px-3 py-2">{m.frequency}</td>
                                    <td className="px-3 py-2">{m.duration}</td>
                                    <td className="px-3 py-2 text-slate-600">{m.instructions}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Follow Up */}
                        {activeFollowRecord && (
                          <div className="flex items-center justify-between p-3 rounded bg-amber-50/70 border border-amber-200 text-xs">
                            <div>
                              <span className="font-bold text-amber-900">Next Scheduled Follow-up:</span>{' '}
                              <span className="font-semibold text-slate-800">{activeFollowRecord.followupDate}</span>
                              <p className="text-slate-600 text-[11px] mt-0.5">{activeFollowRecord.notes}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleStartEditCase(activeCaseRecord.caseId)}
                                className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Edit Follow-up
                              </button>
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  activeFollowRecord.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                Status: {activeFollowRecord.status}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Select a visit from the left timeline to inspect complete clinical case records.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* REPORTS & ANALYTICS MODULE */}
            {activeModule === 'reports' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Clinical Analytics & System Reports</h3>
                    <p className="text-xs text-slate-500">Case frequencies, date-wise statistics, and roster reports (Direct .pdf export)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadHospitalReport('Comprehensive')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                      title="Download Full Hospital Operations & Clinical Report in .pdf format"
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Download Report (.pdf)</span>
                    </button>
                  </div>
                </div>

                {/* OFFICIAL PDF REPORT EXPORT CENTER */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                        <FileDown className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Official PDF Report Export Center</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            STANDARD .PDF FORMAT
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          All reports are generated directly with authentic <strong>.pdf</strong> file extension (compliant with ISO 32000-1 and hospital EHR archives).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Format: <span className="text-emerald-400 font-bold">.pdf (Direct Download)</span>
                      </span>
                    </div>
                  </div>

                  {/* 4 Report Types Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Report 1 */}
                    <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">Audit & KPI</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300">.pdf</span>
                        </div>
                        <h5 className="font-bold text-xs text-white mt-1">Hospital Operations Report</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Complete KPI audit: patient census, case encounters, ward occupancy rates & prescription volume.
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadHospitalReport('Comprehensive')}
                        className="w-full py-1.5 px-2.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download (.pdf)</span>
                      </button>
                    </div>

                    {/* Report 2 */}
                    <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Inpatient</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">.pdf</span>
                        </div>
                        <h5 className="font-bold text-xs text-white mt-1">Ward & Bed Occupancy Report</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Ward-by-ward breakdown of ICU, General & Pediatric beds, admitted patients and utilization %.
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadHospitalReport('Wards')}
                        className="w-full py-1.5 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download (.pdf)</span>
                      </button>
                    </div>

                    {/* Report 3 */}
                    <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">Registry</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">.pdf</span>
                        </div>
                        <h5 className="font-bold text-xs text-white mt-1">Patient Census Directory</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Complete patient roster with demographic details, blood groups, admission status and clinical visits.
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadHospitalReport('Census')}
                        className="w-full py-1.5 px-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download (.pdf)</span>
                      </button>
                    </div>

                    {/* Report 4 */}
                    <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Monitoring</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">.pdf</span>
                        </div>
                        <h5 className="font-bold text-xs text-white mt-1">Routine Checkups & SMS Log</h5>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Weekly routine checking compliance, missed appointments, and automated mobile SMS audit logs.
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadHospitalReport('Checkups')}
                        className="w-full py-1.5 px-2.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download (.pdf)</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Patient Dossier Direct Exporter */}
                  <div className="bg-slate-800/60 rounded-lg p-3.5 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-300 font-semibold">Download Patient Dossier (.pdf):</span>
                      <select
                        value={reportsSelectedPatientId}
                        onChange={(e) => setReportsSelectedPatientId(e.target.value)}
                        className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:ring-1 focus:ring-emerald-500"
                      >
                        {patients.map((p) => (
                          <option key={p.patientId} value={p.patientId}>
                            {p.name} ({p.patientId}) - {p.admissionType || 'OPD'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        const targetP = patients.find((p) => p.patientId === reportsSelectedPatientId);
                        if (targetP) handleDownloadPdfForPatient(targetP);
                      }}
                      className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Patient Record (.pdf)</span>
                    </button>
                  </div>
                </div>

                {/* Patient Visit Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3 tracking-wider">
                      Patient-Wise Case Distribution
                    </h4>
                    <div className="space-y-3">
                      {patients.map((p) => {
                        const visitCount = cases.filter((c) => c.patientId === p.patientId).length;
                        const pct = Math.min(100, (visitCount / Math.max(1, cases.length)) * 100);
                        return (
                          <div key={p.patientId} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-800">
                                {p.name} ({p.patientId})
                              </span>
                              <span className="font-mono text-slate-600">{visitCount} visits</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-sky-700 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3 tracking-wider">
                      Follow-up Completion Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-white p-3 rounded border border-slate-200 text-center">
                        <span className="text-2xl font-bold text-emerald-700">
                          {followups.filter((f) => f.status === 'Completed').length}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">Completed Reviews</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200 text-center">
                        <span className="text-2xl font-bold text-amber-600">
                          {followups.filter((f) => f.status === 'Scheduled').length}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">Upcoming Appointments</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-white rounded border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Prescriptions Dispensed:</span>
                        <span className="font-bold text-slate-800">{prescriptions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Doctors:</span>
                        <span className="font-bold text-slate-800">2 Physicians (Internal Med)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Storage Engine:</span>
                        <span className="font-mono font-semibold text-emerald-700">MySQL InnoDB (ACID Compliant)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RELATIONAL DATABASE INSPECTOR MODULE */}
            {activeModule === 'database' && (
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">MySQL Relational Tables (Normalized 3NF)</h3>
                    <p className="text-xs text-slate-500">
                      Live contents of <code>patient_case_db</code> mirroring the exact JDBC PreparedStatement schema
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">users</span>
                    <p className="text-slate-500 text-[11px] mt-1">{INITIAL_USERS.length} rows (Auth / RBAC)</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">patients</span>
                    <p className="text-slate-500 text-[11px] mt-1">{patients.length} rows (Primary Demographic)</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">case_history</span>
                    <p className="text-slate-500 text-[11px] mt-1">{cases.length} rows (1:N Patient Visits)</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">examinations</span>
                    <p className="text-slate-500 text-[11px] mt-1">{examinations.length} rows (Physical Vitals)</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">diagnoses</span>
                    <p className="text-slate-500 text-[11px] mt-1">{diagnoses.length} rows (Clinical Assessment)</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">prescriptions</span>
                    <p className="text-slate-500 text-[11px] mt-1">{prescriptions.length} headers</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">prescription_medicines</span>
                    <p className="text-slate-500 text-[11px] mt-1">
                      {prescriptions.reduce((acc, p) => acc + p.medicines.length, 0)} item rows (1:N)
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-mono font-bold text-sky-800">follow_ups</span>
                    <p className="text-slate-500 text-[11px] mt-1">{followups.length} rows (Reviews)</p>
                  </div>
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded">
                    <span className="font-mono font-bold text-rose-800">routine_checkups</span>
                    <p className="text-slate-500 text-[11px] mt-1">{routineCheckups.length} weekly records (1:N)</p>
                  </div>
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded">
                    <span className="font-mono font-bold text-sky-800">sms_delivery_logs</span>
                    <p className="text-slate-500 text-[11px] mt-1">{smsLogs.length} dispatched SMS logs</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto space-y-2">
                  <div className="text-emerald-400 font-bold">-- Referential Integrity & Foreign Key Structure:</div>
                  <div>patients (patient_id PK) &lt;--- (1:N) --- case_history (patient_id FK)</div>
                  <div>case_history (case_id PK) &lt;--- (1:1) --- examinations (case_id FK)</div>
                  <div>case_history (case_id PK) &lt;--- (1:1) --- diagnoses (case_id FK)</div>
                  <div>case_history (case_id PK) &lt;--- (1:1) --- prescriptions (case_id FK)</div>
                  <div>prescriptions (prescription_id PK) &lt;--- (1:N) --- prescription_medicines (prescription_id FK)</div>
                  <div>case_history (case_id PK) &lt;--- (1:1) --- follow_ups (case_id FK)</div>
                  <div className="text-sky-300">patients (patient_id PK) &lt;--- (1:N) --- routine_checkups (patient_id FK)</div>
                  <div className="text-sky-300">patients (patient_id PK) &lt;--- (1:N) --- sms_delivery_logs (patient_id FK)</div>
                </div>
              </div>
            )}

            {/* ROUTINE WEEKLY CHECKING & MISSED CHECKUP SMS MANAGEMENT MODULE */}
            {activeModule === 'routine_sms' && (
              <RoutineCheckupManagement
                patients={patients}
                setPatients={setPatients}
                routineCheckups={routineCheckups}
                setRoutineCheckups={setRoutineCheckups}
                smsLogs={smsLogs}
                setSmsLogs={setSmsLogs}
                cases={cases}
                examinations={examinations}
                diagnoses={diagnoses}
                prescriptions={prescriptions}
                onOpenPatientHistory={(patientId) => {
                  setHistoryPatientQuery(patientId);
                  setActiveModule('history');
                }}
                showNotification={showJOptionPane}
              />
            )}

            {/* PATIENT LONGITUDINAL TIMELINE & VITALS TRAJECTORY MODULE */}
            {activeModule === 'timeline' && (
              <PatientTimeline
                patients={patients}
                cases={cases}
                examinations={examinations}
                diagnoses={diagnoses}
                prescriptions={prescriptions}
                followups={followups}
                selectedPatientId={selectedPatientId || 'PAT-1001'}
                onSelectPatient={(pid) => setSelectedPatientId(pid)}
                onCompareVisits={(c1, c2) => {
                  setComparisonCase1(c1);
                  setComparisonCase2(c2);
                  setActiveModule('comparison');
                }}
                onDownloadPdf={(patient) => handleDownloadPdfForPatient(patient)}
              />
            )}

            {/* MULTI-VISIT CASE SIDE-BY-SIDE COMPARISON MODULE */}
            {activeModule === 'comparison' && (
              <VisitComparison
                patients={patients}
                cases={cases}
                examinations={examinations}
                diagnoses={diagnoses}
                prescriptions={prescriptions}
                followups={followups}
                initialCaseId1={comparisonCase1}
                initialCaseId2={comparisonCase2}
                initialPatientId={selectedPatientId || 'PAT-1001'}
                onBackToTimeline={() => setActiveModule('timeline')}
              />
            )}

            {/* LONGITUDINAL FOLLOW-UP REVIEWS & REVISIT TRACKER MODULE */}
            {activeModule === 'followups' && (
              <FollowUpManagement
                followups={followups}
                patients={patients}
                cases={cases}
                onUpdateFollowUp={handleUpdateFollowUp}
                onSendSmsReminder={handleSendSmsReminder}
                onViewPatientTimeline={(pid) => {
                  setSelectedPatientId(pid);
                  setActiveModule('timeline');
                }}
              />
            )}

            {/* MEDICATION EXPOSURE & CROSS-PATIENT PRESCRIPTION SEARCH */}
            {activeModule === 'medicines' && (
              <MedicineSearch
                prescriptions={prescriptions}
                cases={cases}
                patients={patients}
                initialPatientId={selectedPatientId || 'PAT-1001'}
                onViewCase={(cid) => {
                  const foundCase = cases.find((c) => c.caseId === cid);
                  if (foundCase) {
                    setHistoryPatientQuery(foundCase.patientId);
                    setSelectedCaseId(cid);
                    setActiveModule('history');
                  }
                }}
                onViewPatientTimeline={(pid) => {
                  setSelectedPatientId(pid);
                  setActiveModule('timeline');
                }}
              />
            )}

            {/* PATIENT DIAGNOSTIC REPORTS & RADIOLOGY REPOSITORY MODULE */}
            {activeModule === 'documents' && (
              <PatientDocumentsView
                documents={patientDocuments}
                patients={patients}
                onUploadDocument={handleUploadDocument}
                selectedPatientId={selectedPatientId || 'PAT-1001'}
              />
            )}

            {/* CLINICAL AUDIT TRAIL & SECURITY ACCESS LOG MODULE */}
            {activeModule === 'audit_log' && (
              <AuditLogView auditLogs={auditLogs} />
            )}
          </div>
        )}
      </FrameWrapper>

      {/* Database Connection & Schema Health Modal */}
      <DatabaseStatusModal
        isOpen={isDbStatusOpen}
        onClose={() => setIsDbStatusOpen(false)}
        tableCounts={{
          users: INITIAL_USERS.length,
          patients: patients.length,
          case_history: cases.length,
          examinations: examinations.length,
          diagnoses: diagnoses.length,
          prescriptions: prescriptions.length,
          prescription_medicines: prescriptions.reduce((acc, p) => acc + p.medicines.length, 0),
          follow_ups: followups.length,
          routine_checkups: routineCheckups.length,
          sms_delivery_logs: smsLogs.length,
          patient_documents: patientDocuments.length,
          audit_logs: auditLogs.length,
          wards: wards.length,
          beds: beds.length
        }}
      />

      {/* Edit Patient Demographic & Clinical Details Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-sky-900 text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Edit Patient Record: {editingPatient.name} ({editingPatient.patientId})</span>
              </span>
              <button
                onClick={() => setEditingPatient(null)}
                className="text-sky-200 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedPatient} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
                <strong>In-Place Database Update:</strong> Edits to this patient profile directly update the existing record with no duplicates. All related records (Beds, Routine Checks, Case Timeline) remain linked to <code>{editingPatient.patientId}</code>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient ID (Immutable Primary Key):</label>
                  <input
                    type="text"
                    value={editingPatient.patientId}
                    disabled
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-slate-100 font-mono text-slate-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *:</label>
                  <input
                    type="text"
                    required
                    value={editingPatient.name}
                    onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age (Years) *:</label>
                  <input
                    type="number"
                    min="0"
                    max="130"
                    required
                    value={editingPatient.age}
                    onChange={(e) => setEditingPatient({ ...editingPatient, age: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *:</label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *:</label>
                  <input
                    type="tel"
                    required
                    value={editingPatient.mobile}
                    onChange={(e) => setEditingPatient({ ...editingPatient, mobile: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group:</label>
                  <select
                    value={editingPatient.bloodGroup || 'O+'}
                    onChange={(e) => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address *:</label>
                <textarea
                  required
                  rows={2}
                  value={editingPatient.address}
                  onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Type:</label>
                  <select
                    value={editingPatient.admissionType || 'OPD'}
                    onChange={(e) => setEditingPatient({ ...editingPatient, admissionType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="OPD">Outpatient (OPD)</option>
                    <option value="IPD">Inpatient Ward (IPD)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Status:</label>
                  <select
                    value={editingPatient.status || 'ACTIVE'}
                    onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISCHARGED">DISCHARGED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Routine Checking Configuration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!editingPatient.hasRoutineCheckup}
                      onChange={(e) => setEditingPatient({ ...editingPatient, hasRoutineCheckup: e.target.checked })}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Enroll in Routine / Weekly Periodic Check-up Program</span>
                  </label>
                </div>

                {editingPatient.hasRoutineCheckup && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Frequency:</label>
                      <select
                        value={editingPatient.checkupFrequency || 'Weekly'}
                        onChange={(e) => setEditingPatient({ ...editingPatient, checkupFrequency: e.target.value as any })}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Preferred Day:</label>
                      <select
                        value={editingPatient.preferredDay || 'Mon'}
                        onChange={(e) => setEditingPatient({ ...editingPatient, preferredDay: e.target.value })}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-0.5">Clinical Condition:</label>
                      <input
                        type="text"
                        value={editingPatient.routineCondition || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, routineCondition: e.target.value })}
                        placeholder="e.g. Hypertension review"
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-slate-50 -mx-5 -mb-5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-1.5 border border-slate-300 rounded font-medium hover:bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-900 hover:bg-sky-800 text-white rounded font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes (Update Database)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Quick-View 10-Second Triage Modal */}
      {emergencyPatient && (
        <EmergencyQuickViewModal
          patient={emergencyPatient}
          cases={cases}
          examinations={examinations}
          diagnoses={diagnoses}
          prescriptions={prescriptions}
          isOpen={!!emergencyPatient}
          onClose={() => setEmergencyPatient(null)}
          onOpenQrModal={() => {
            const p = emergencyPatient;
            setEmergencyPatient(null);
            setQrPatient(p);
          }}
          onDownloadPdf={() => {
            handleDownloadPdfForPatient(emergencyPatient);
          }}
        />
      )}

      {/* Patient Digital Bedside QR Code Modal */}
      {qrPatient && (
        <PatientQrCodeModal
          patient={qrPatient}
          latestCase={cases.filter((c) => c.patientId === qrPatient.patientId).slice(-1)[0]}
          latestDiagnosis={diagnoses.filter((d) => cases.some((c) => c.caseId === d.caseId && c.patientId === qrPatient.patientId)).slice(-1)[0]}
          isOpen={!!qrPatient}
          onClose={() => setQrPatient(null)}
        />
      )}

      {/* JOptionPane Simulation Modal */}
      {modalDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                {modalDialog.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
                {modalDialog.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {modalDialog.type === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {modalDialog.type === 'confirm' && <AlertTriangle className="w-4 h-4 text-sky-400" />}
                {modalDialog.title}
              </span>
              <button
                onClick={() => setModalDialog((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 text-xs text-slate-700 space-y-2 whitespace-pre-line leading-relaxed">
              {modalDialog.message}
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              {modalDialog.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => setModalDialog((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-1.5 border border-slate-300 rounded font-medium hover:bg-slate-100 text-slate-700"
                  >
                    Cancel (No)
                  </button>
                  <button
                    onClick={() => modalDialog.onConfirm && modalDialog.onConfirm()}
                    className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded font-bold shadow-xs"
                  >
                    Confirm (Yes)
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModalDialog((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded font-bold shadow-xs"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Spotlight Quick Search Modal (Ctrl+K) */}
      {isSpotlightOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full overflow-hidden">
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
              <Search className="w-5 h-5 text-sky-600 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search patient by name, ID, phone, or search medicine..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
              />
              <kbd className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-mono shrink-0">
                ESC
              </kbd>
            </div>

            {/* Results Body */}
            <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100 text-xs">
              {/* Section 1: Matching Patients */}
              <div className="pb-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  Matching Patients
                </div>
                {(() => {
                  const q = spotlightQuery.trim().toLowerCase();
                  const matched = q
                    ? patients.filter(
                        (p) =>
                          p.name.toLowerCase().includes(q) ||
                          p.patientId.toLowerCase().includes(q) ||
                          p.mobile.includes(q) ||
                          p.bloodGroup.toLowerCase().includes(q)
                      )
                    : patients.slice(0, 4);

                  if (matched.length === 0) {
                    return <p className="text-slate-400 text-xs px-2 py-1">No matching patients found.</p>;
                  }

                  return (
                    <div className="space-y-1">
                      {matched.slice(0, 5).map((p) => (
                        <div
                          key={p.patientId}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-sky-50/80 transition group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">
                              {p.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                <span>{p.name}</span>
                                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                                  {p.patientId}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {p.age}y · {p.gender} · Blood {p.bloodGroup} · {p.mobile}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedPatientId(p.patientId);
                                setCasePatientId(p.patientId);
                                setActiveModule('new_case');
                                setIsSpotlightOpen(false);
                              }}
                              className="px-2 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold text-[10px] transition"
                            >
                              + Case
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatientId(p.patientId);
                                setActiveModule('timeline');
                                setIsSpotlightOpen(false);
                              }}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] transition"
                            >
                              Timeline
                            </button>
                            <button
                              onClick={() => {
                                setEmergencyPatient(p);
                                setIsSpotlightOpen(false);
                              }}
                              className="px-1.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[10px] transition"
                            >
                              <AlertOctagon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Section 2: Matching Prescribed Medications */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  Matching Medicines
                </div>
                {(() => {
                  const allMeds: string[] = Array.from(
                    new Set<string>(prescriptions.flatMap((p) => p.medicines.map((m) => m.medicineName)))
                  );
                  const q = spotlightQuery.trim().toLowerCase();
                  const matchedMeds: string[] = q
                    ? allMeds.filter((m) => m.toLowerCase().includes(q))
                    : allMeds.slice(0, 3);

                  if (matchedMeds.length === 0) {
                    return <p className="text-slate-400 text-xs px-2 py-1">No matching medicines found.</p>;
                  }

                  return (
                    <div className="space-y-1">
                      {matchedMeds.map((med) => (
                        <div
                          key={med}
                          onClick={() => {
                            setActiveModule('medicines');
                            setIsSpotlightOpen(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-sky-50/80 cursor-pointer transition text-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <Pill className="w-3.5 h-3.5 text-rose-500" />
                            <span className="font-medium">{med}</span>
                          </div>
                          <span className="text-[10px] text-sky-700 group-hover:underline">
                            Search Prescriptions →
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Section 3: Navigation Shortcuts */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                  Quick Navigation
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 px-1">
                  <button
                    onClick={() => {
                      setActiveModule('dashboard');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('manage');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Directory</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('register');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Register</span>
                  </button>
                  <button
                    onClick={() => {
                      setCasePatientId(selectedPatientId || 'PAT-1001');
                      setActiveModule('new_case');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>+ New Case</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('wards');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <BedIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wards & Beds</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('medicines');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Pill className="w-3.5 h-3.5 text-rose-500" />
                    <span>Med Search</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('followups');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Follow-ups</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModule('audit_log');
                      setIsSpotlightOpen(false);
                    }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-left font-medium text-slate-700 flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Audit Log</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between px-4">
              <span>Press <strong className="text-slate-600 font-mono">Ctrl+K</strong> or <strong className="text-slate-600 font-mono">/</strong> anytime to open search</span>
              <button
                onClick={() => setIsSpotlightOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Guide & Shortcuts Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm">System User Guide & Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs text-slate-700 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <span>⚡ Keyboard Shortcuts</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <span className="font-medium text-slate-800">Quick Global Search</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-600">
                      Ctrl + K
                    </kbd>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                    <span className="font-medium text-slate-800">Close Any Modal</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-600">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">📋 Core Clinical Workflows</h4>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-semibold text-slate-800">1. Recording a Multi-Visit Encounter</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Select or switch to any patient, click <strong>+ Case</strong>, or use <strong>Quick Clinical Templates</strong> to autofill common presentations. Completing all 5 steps commits an atomic multi-table transaction.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-semibold text-slate-800">2. Comparing Past Visits Side-by-Side</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Navigate to <strong>Clinical Care → Compare Visits</strong> to see changes in diagnosis, vital signs, and medications between any two encounters.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-semibold text-slate-800">3. Inpatient Bed Allocation & Transfers</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      In <strong>Wards & Beds</strong>, view live occupancy across General, ICU, and Pediatric wards. Click any available bed to allocate, or transfer between beds instantly.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-semibold text-slate-800">4. Pharmacovigilance & Medicine Search</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      In <strong>Clinical Care → Medicine-wise Search</strong>, type any partial medicine name (e.g., "Para") to cross-reference every patient who was prescribed that drug.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">🛡️ Role-Based Access Control (RBAC)</h4>
                <p className="text-slate-500 text-[11px]">
                  Use the <strong>Switch Staff Role</strong> dropdown in the top right to test different clinical permissions: Doctor (full clinical authority), Nurse (vitals & bedside care), Receptionist (front-desk & registration), Admin (audit & system management).
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded text-xs font-bold transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User-Friendly Floating Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-xl border text-xs flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-600/80 shadow-emerald-950/20'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 text-amber-100 border-amber-600/80 shadow-amber-950/20'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-600/80 shadow-rose-950/20'
                : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'error' && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
