import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
  Smartphone,
  Search,
  FileDown,
  Clock,
  Plus,
  RefreshCw,
  Bell,
  Phone,
  Activity,
  User,
  HeartPulse,
  MessageSquare,
  Sparkles,
  Edit3,
  X
} from 'lucide-react';
import { Patient, RoutineCheckup, SmsMessage, CaseHistory, Examination, Diagnosis, Prescription } from '../types';
import { generatePatientRecordPdf } from '../utils/pdfGenerator';

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  routineCheckups: RoutineCheckup[];
  setRoutineCheckups: React.Dispatch<React.SetStateAction<RoutineCheckup[]>>;
  smsLogs: SmsMessage[];
  setSmsLogs: React.Dispatch<React.SetStateAction<SmsMessage[]>>;
  cases: CaseHistory[];
  examinations: Examination[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  onOpenPatientHistory?: (patientId: string) => void;
  showNotification: (title: string, message: string, type: 'info' | 'warning' | 'error') => void;
}

export const RoutineCheckupManagement: React.FC<Props> = ({
  patients,
  setPatients,
  routineCheckups,
  setRoutineCheckups,
  smsLogs,
  setSmsLogs,
  cases,
  examinations,
  diagnoses,
  prescriptions,
  showNotification
}) => {
  // Search & Filter State
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.patientId || 'PAT-1001');
  const [activeTab, setActiveTab] = useState<'timeline' | 'missed_alerts' | 'sms_log'>('timeline');

  // Modal for New Weekly Checkup Entry
  const [isAddCheckupOpen, setIsAddCheckupOpen] = useState(false);
  const [newBp, setNewBp] = useState('120/80 mmHg');
  const [newPulse, setNewPulse] = useState('76 bpm');
  const [newTemp, setNewTemp] = useState('98.6 F');
  const [newWeight, setNewWeight] = useState('70 kg');
  const [newSugar, setNewSugar] = useState('110 mg/dL');
  const [newSymptoms, setNewSymptoms] = useState('Routine weekly evaluation. Vitals stable.');
  const [newDoctorNotes, setNewDoctorNotes] = useState('Continuing current clinical therapy. Next review in 7 days.');
  const [newMedicines, setNewMedicines] = useState('');

  // Modal for Editing Existing Routine Checkup Entry
  const [editingCheckup, setEditingCheckup] = useState<RoutineCheckup | null>(null);
  const [editStatus, setEditStatus] = useState<'Scheduled' | 'Completed' | 'Missed'>('Completed');
  const [editScheduledDate, setEditScheduledDate] = useState('');
  const [editActualDate, setEditActualDate] = useState('');
  const [editBp, setEditBp] = useState('120/80 mmHg');
  const [editPulse, setEditPulse] = useState('76 bpm');
  const [editTemp, setEditTemp] = useState('98.6 F');
  const [editWeight, setEditWeight] = useState('70 kg');
  const [editSugar, setEditSugar] = useState('110 mg/dL');
  const [editSymptoms, setEditSymptoms] = useState('');
  const [editDoctorNotes, setEditDoctorNotes] = useState('');

  // Modal for Simulated Mobile Phone SMS
  const [simulatedSms, setSimulatedSms] = useState<{
    isOpen: boolean;
    patientName: string;
    mobile: string;
    messageText: string;
    sentAt: string;
  } | null>(null);

  // Selected Patient
  const selectedPatient = patients.find((p) => p.patientId === selectedPatientId) || patients[0];

  // Filter patients by Name (Case-insensitive substring search as requested)
  const filteredPatients = patients.filter((p) => {
    const term = patientSearchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.patientId.toLowerCase().includes(term) ||
      p.mobile.includes(term)
    );
  });

  // History for current selected patient
  const patientCheckups = routineCheckups
    .filter((c) => c.patientId === selectedPatientId)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  // Missed Checkups across all patients
  const missedCheckups = routineCheckups.filter((c) => c.status === 'Missed');

  // Send Missed Checkup SMS Handler
  const handleSendMissedSms = (checkup: RoutineCheckup) => {
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

    const smsText = `Dear ${patient.name}, you missed your scheduled weekly routine checkup on ${checkup.scheduledDate} at City Healthcare Memorial Hospital. Please visit the clinic or contact us at (022) 2419-8000 immediately to reschedule your checkup. Your continuous monitoring is our top priority!`;

    // 1. Update checkup record
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

    // 2. Add to SMS dispatch audit log
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

    // 3. Open simulated mobile phone preview
    setSimulatedSms({
      isOpen: true,
      patientName: patient.name,
      mobile: recipientMobile,
      messageText: smsText,
      sentAt: nowStr
    });

    showNotification(
      'SMS Alert Dispatched',
      `Missing checkup alert message sent to registered mobile number ${recipientMobile} for patient ${patient.name}.`,
      'info'
    );
  };

  // Automated Batch Scanner: Scans for overdue checkups and auto-sends missing messages
  const handleScanAndAutoSendMissed = () => {
    const today = new Date().toISOString().split('T')[0];
    let count = 0;

    const updatedCheckups = routineCheckups.map((c) => {
      // If checkup scheduled date has passed and is not completed
      if (c.scheduledDate < today && c.status !== 'Completed') {
        const patient = patients.find((p) => p.patientId === c.patientId);
        const mobile = patient?.mobile || c.mobile;
        const nowStr = new Date().toLocaleString();
        const smsText = `Dear ${c.patientName}, you missed your scheduled weekly routine checkup on ${c.scheduledDate} at City Hospital. Please visit clinic or call (022) 2419-8000 to reschedule immediately.`;

        if (!c.missedAlertSent) {
          count++;
          const newSms: SmsMessage = {
            smsId: `SMS-${Date.now().toString().slice(-4)}-${count}`,
            patientId: c.patientId,
            patientName: c.patientName,
            mobileNumber: mobile,
            messageType: 'Missed Checkup Alert',
            messageText: smsText,
            sentAt: nowStr,
            status: 'Delivered'
          };
          setSmsLogs((prev) => [newSms, ...prev]);
        }

        return {
          ...c,
          status: 'Missed' as const,
          missedAlertSent: true,
          missedAlertSentAt: c.missedAlertSentAt || nowStr,
          missedAlertMessage: smsText
        };
      }
      return c;
    });

    setRoutineCheckups(updatedCheckups);
    showNotification(
      'Batch Missed Checkup Scan Complete',
      `Identified ${missedCheckups.length} overdue checkup(s). Missing alert messages verified and sent to all registered mobile numbers.`,
      'info'
    );
  };

  // Add a new routine weekly visit
  const handleAddNewWeeklyVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const today = new Date().toISOString().split('T')[0];
    const nextWeekNum = patientCheckups.length + 1;
    const newCheckupId = `CHK-${selectedPatient.patientId.replace('PAT-', '')}-W${nextWeekNum}`;

    const newRecord: RoutineCheckup = {
      checkupId: newCheckupId,
      patientId: selectedPatient.patientId,
      patientName: selectedPatient.name,
      mobile: selectedPatient.mobile,
      scheduledDate: today,
      actualDate: today,
      weekNumber: nextWeekNum,
      status: 'Completed',
      vitalSigns: {
        bp: newBp,
        pulse: newPulse,
        temp: newTemp,
        weight: newWeight,
        bloodSugar: newSugar,
        spo2: '99%'
      },
      symptomsObserved: newSymptoms,
      doctorNotes: newDoctorNotes,
      medicinesPrescribed: newMedicines || 'Continue existing clinical prescription',
      missedAlertSent: false
    };

    // Calculate next weekly checkup date (7 days from now)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    setRoutineCheckups([...routineCheckups, newRecord]);

    // Update patient's next checkup date
    setPatients((prev) =>
      prev.map((p) =>
        p.patientId === selectedPatient.patientId
          ? {
              ...p,
              hasRoutineCheckup: true,
              lastCheckupDate: today,
              nextCheckupDate: nextDateStr
            }
          : p
      )
    );

    setIsAddCheckupOpen(false);
    showNotification(
      'Weekly Checkup Recorded',
      `Week ${nextWeekNum} checkup for ${selectedPatient.name} logged successfully. Next routine weekly checkup scheduled for ${nextDateStr}.`,
      'info'
    );
  };

  // Open Edit Routine Checkup Modal
  const handleStartEditCheckup = (chk: RoutineCheckup) => {
    setEditingCheckup(chk);
    setEditStatus(chk.status);
    setEditScheduledDate(chk.scheduledDate);
    setEditActualDate(chk.actualDate || (chk.status === 'Completed' ? new Date().toISOString().split('T')[0] : ''));
    setEditBp(chk.vitalSigns?.bp || '120/80 mmHg');
    setEditPulse(chk.vitalSigns?.pulse || '76 bpm');
    setEditTemp(chk.vitalSigns?.temp || '98.6 F');
    setEditWeight(chk.vitalSigns?.weight || '70 kg');
    setEditSugar(chk.vitalSigns?.bloodSugar || '110 mg/dL');
    setEditSymptoms(chk.symptomsObserved || '');
    setEditDoctorNotes(chk.doctorNotes || '');
  };

  // Save changes to existing routine checkup (Updates in-place, no duplicate)
  const handleSaveEditedCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCheckup) return;

    const updatedCheckup: RoutineCheckup = {
      ...editingCheckup,
      status: editStatus,
      scheduledDate: editScheduledDate || editingCheckup.scheduledDate,
      actualDate: editStatus === 'Completed' ? (editActualDate || new Date().toISOString().split('T')[0]) : undefined,
      vitalSigns: {
        bp: editBp,
        pulse: editPulse,
        temp: editTemp,
        weight: editWeight,
        bloodSugar: editSugar
      },
      symptomsObserved: editSymptoms,
      doctorNotes: editDoctorNotes
    };

    setRoutineCheckups((prev) =>
      prev.map((c) => (c.checkupId === editingCheckup.checkupId ? updatedCheckup : c))
    );

    // If marked Completed, update patient's lastCheckupDate
    if (editStatus === 'Completed') {
      setPatients((prev) =>
        prev.map((p) =>
          p.patientId === editingCheckup.patientId
            ? { ...p, lastCheckupDate: updatedCheckup.actualDate || p.lastCheckupDate }
            : p
        )
      );
    }

    setEditingCheckup(null);
    showNotification(
      'Routine Checkup Updated',
      `Routine checkup ${editingCheckup.checkupId} (Week ${editingCheckup.weekNumber}) updated successfully in database.`,
      'info'
    );
  };

  // Download PDF Record (Not in ZIP format)
  const handleDownloadPdf = (patient: Patient) => {
    const patientCases = cases.filter((c) => c.patientId === patient.patientId);
    const patientExams = examinations.filter((e) =>
      patientCases.some((c) => c.caseId === e.caseId)
    );
    const patientDiags = diagnoses.filter((d) =>
      patientCases.some((c) => c.caseId === d.caseId)
    );
    const patientRxs = prescriptions.filter((p) =>
      patientCases.some((c) => c.caseId === p.caseId)
    );
    const patientWeekly = routineCheckups.filter((c) => c.patientId === patient.patientId);

    generatePatientRecordPdf({
      patient,
      cases: patientCases,
      examinations: patientExams,
      diagnoses: patientDiags,
      prescriptions: patientRxs,
      routineCheckups: patientWeekly,
      smsLogs
    });

    showNotification(
      'PDF Generated & Downloaded',
      `Patient record for ${patient.name} (${patient.patientId}) has been downloaded directly in PDF format (not ZIP format).`,
      'info'
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Stats & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                Routine Weekly Checking & Missed Checkup SMS System
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Tracks ongoing weekly medical checking history. If any patient misses a scheduled checkup,
              the automated system dispatches an alert SMS directly to the mobile number taken during registration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleScanAndAutoSendMissed}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              title="Detect missed checkups and dispatch SMS to registered phone numbers"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Auto-Send Missed Checkup SMS</span>
            </button>

            {selectedPatient && (
              <button
                onClick={() => handleDownloadPdf(selectedPatient)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                title="Download complete record in clean PDF format (not in ZIP format)"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Record (.PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric KPI Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Enrolled Patients</span>
            <span className="text-base font-bold text-sky-400">{patients.length}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Completed Weekly Visits</span>
            <span className="text-base font-bold text-emerald-400">
              {routineCheckups.filter((c) => c.status === 'Completed').length}
            </span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Missed Checkups Overdue</span>
            <span className="text-base font-bold text-rose-400">{missedCheckups.length}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">SMS Dispatched to Mobile</span>
            <span className="text-base font-bold text-amber-300">{smsLogs.length}</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Left = Patient Search & Directory by Name, Right = Longitudinal History & Missed SMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (4 cols): Search by Patient Name */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Search Patient by Name</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {filteredPatients.length} found
              </span>
            </div>

            {/* Prominent Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={patientSearchTerm}
                onChange={(e) => setPatientSearchTerm(e.target.value)}
                placeholder="Type patient name (e.g. Robert, Eleanor, Clara)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              {patientSearchTerm && (
                <button
                  onClick={() => setPatientSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Patients List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                  No patients matching &ldquo;{patientSearchTerm}&rdquo;.
                </div>
              ) : (
                filteredPatients.map((p) => {
                  const pCheckups = routineCheckups.filter((c) => c.patientId === p.patientId);
                  const hasMissed = pCheckups.some((c) => c.status === 'Missed');
                  const isSelected = p.patientId === selectedPatientId;

                  return (
                    <div
                      key={p.patientId}
                      onClick={() => setSelectedPatientId(p.patientId)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                            {hasMissed && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                                Missed Checkup
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ID: {p.patientId} • {p.age}y / {p.gender} • {p.bloodGroup}
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="font-semibold text-slate-700">{p.mobile}</span>
                            <span className="text-[10px] text-slate-400">(Registered)</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              p.admissionType === 'IPD'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {p.admissionType || 'OPD'}
                          </span>
                        </div>
                      </div>

                      {/* Routine Checkup Status Line */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {p.routineCondition || 'Weekly Routine Checking'}
                        </span>
                        <span className="text-slate-700 font-medium">
                          Next: <span className="text-sky-700 font-bold">{p.nextCheckupDate || 'Scheduled'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Selected Patient History, Timeline, Missed Checkup SMS */}
        <div className="lg:col-span-8 space-y-3">
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Patient Header Dossier */}
              <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {selectedPatient.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono text-xs font-bold">
                      {selectedPatient.patientId}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                      Weekly Checking Enrolled
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                    <span>
                      <strong>Age/Gender:</strong> {selectedPatient.age}y / {selectedPatient.gender}
                    </span>
                    <span>
                      <strong>Blood Group:</strong>{' '}
                      <span className="text-rose-600 font-bold">{selectedPatient.bloodGroup}</span>
                    </span>
                    <span className="flex items-center gap-1 text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-medium">
                      <Phone className="w-3 h-3 text-sky-600" />
                      <span>Registered Mobile: <strong>{selectedPatient.mobile}</strong></span>
                    </span>
                    {selectedPatient.bedNumber && (
                      <span>
                        <strong>Bed:</strong> {selectedPatient.bedNumber} ({selectedPatient.wardName})
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Simple PDF Download Button (Requested) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPdf(selectedPatient)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                    title="Download complete clinical and weekly checkup history in PDF format (not in ZIP format)"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => setIsAddCheckupOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Log Weekly Visit</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: 1) All History & Weekly Timeline 2) Missed Checkup Alerts & SMS 3) SMS Audit Log */}
              <div className="px-4 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 text-xs">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-2.5 px-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'timeline'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>All Weekly Checking History ({patientCheckups.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('missed_alerts')}
                  className={`pb-2.5 px-2 font-semibold border-b-2 transition flex items-center gap-1.5 relative ${
                    activeTab === 'missed_alerts'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-rose-600" />
                  <span>Missed Checkups & SMS Action</span>
                  {patientCheckups.some((c) => c.status === 'Missed') && (
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('sms_log')}
                  className={`pb-2.5 px-2 font-semibold border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'sms_log'
                      ? 'border-sky-600 text-sky-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>SMS Gateway Audit Log</span>
                </button>
              </div>

              {/* TAB 1: ALL WEEKLY CHECKING HISTORY TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Chronological Routine Weekly Checking Record for {selectedPatient.name}:
                    </span>
                    <span className="text-slate-500">
                      Schedule: Weekly ({selectedPatient.preferredDay || 'Every 7 Days'})
                    </span>
                  </div>

                  {patientCheckups.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">No Weekly Checkups Recorded Yet</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Click &ldquo;+ Log Weekly Visit&rdquo; to record Week 1 vitals, symptoms, and doctor observations.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patientCheckups.map((chk) => {
                        const isCompleted = chk.status === 'Completed';
                        const isMissed = chk.status === 'Missed';

                        return (
                          <div
                            key={chk.checkupId}
                            className={`p-3.5 rounded-xl border transition ${
                              isMissed
                                ? 'bg-rose-50/60 border-rose-200'
                                : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isCompleted
                                      ? 'bg-emerald-600 text-white'
                                      : isMissed
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-sky-600 text-white'
                                  }`}
                                >
                                  {chk.weekNumber}
                                </span>
                                <div>
                                  <span className="text-xs font-bold text-slate-900">
                                    Week {chk.weekNumber} Routine Checking
                                  </span>
                                  <span className="text-[11px] text-slate-500 ml-2 font-mono">
                                    Ref: {chk.checkupId}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    isCompleted
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : isMissed
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-sky-100 text-sky-800'
                                  }`}
                                >
                                  {isMissed ? 'CHECKUP MISSED' : chk.status}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">
                                  {isCompleted
                                    ? `Attended: ${chk.actualDate}`
                                    : `Scheduled: ${chk.scheduledDate}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditCheckup(chk)}
                                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 shadow-2xs transition ml-1"
                                  title="Edit routine checkup details"
                                >
                                  <Edit3 className="w-3 h-3 text-sky-700" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </div>

                            {/* Vitals & Observations Grid */}
                            {isCompleted && chk.vitalSigns && (
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-medium">BP</span>
                                  <span className="font-bold text-slate-800 font-mono">
                                    {chk.vitalSigns.bp}
                                  </span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-medium">Pulse</span>
                                  <span className="font-bold text-slate-800 font-mono">
                                    {chk.vitalSigns.pulse}
                                  </span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-medium">Temp</span>
                                  <span className="font-bold text-slate-800 font-mono">
                                    {chk.vitalSigns.temp}
                                  </span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-medium">Weight</span>
                                  <span className="font-bold text-slate-800 font-mono">
                                    {chk.vitalSigns.weight}
                                  </span>
                                </div>
                                <div className="bg-white p-2 rounded border border-slate-200">
                                  <span className="text-[10px] text-slate-400 block font-medium">Blood Sugar</span>
                                  <span className="font-bold text-slate-800 font-mono">
                                    {chk.vitalSigns.bloodSugar || 'Normal'}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Clinical Symptoms & Progress */}
                            {chk.symptomsObserved && (
                              <div className="mt-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded border border-slate-200">
                                <span className="font-bold text-slate-800">Clinical Evaluation: </span>
                                {chk.symptomsObserved}
                              </div>
                            )}

                            {chk.doctorNotes && (
                              <div className="mt-1.5 text-xs text-sky-950 bg-sky-50/70 p-2.5 rounded border border-sky-200">
                                <span className="font-bold text-sky-900">Doctor&apos;s Advice & Treatment: </span>
                                {chk.doctorNotes}
                              </div>
                            )}

                            {/* If Missed: Show Alert Notice & One-click SMS dispatch */}
                            {isMissed && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Patient Missed This Scheduled Routine Checkup!</span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 mt-0.5">
                                    {chk.missedAlertSent ? (
                                      <span>
                                        Automated SMS notification dispatched to registered mobile{' '}
                                        <strong className="text-slate-900">{selectedPatient.mobile}</strong> at{' '}
                                        {chk.missedAlertSentAt}.
                                      </span>
                                    ) : (
                                      <span>
                                        No notification sent yet. Send missed reminder SMS to registered mobile{' '}
                                        <strong className="text-slate-900">{selectedPatient.mobile}</strong> now.
                                      </span>
                                    )}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSendMissedSms(chk)}
                                    className="px-2.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>{chk.missedAlertSent ? 'Resend SMS' : 'Send Missed SMS'}</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setSimulatedSms({
                                        isOpen: true,
                                        patientName: selectedPatient.name,
                                        mobile: selectedPatient.mobile,
                                        messageText:
                                          chk.missedAlertMessage ||
                                          `Dear ${selectedPatient.name}, you missed your scheduled weekly routine checkup on ${chk.scheduledDate} at City Hospital. Please visit clinic or contact (022) 2419-8000 to reschedule immediately.`,
                                        sentAt: chk.missedAlertSentAt || 'Just now'
                                      })
                                    }
                                    className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1 transition"
                                  >
                                    <Smartphone className="w-3 h-3" />
                                    <span>Phone Preview</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MISSED CHECKUPS & SMS ACTIONS */}
              {activeTab === 'missed_alerts' && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-slate-800">
                      All Overdue & Missed Routine Checkups (Across Hospital Patients)
                    </h4>
                    <span className="text-rose-600 font-semibold text-xs">
                      {missedCheckups.length} Missed Checkup(s)
                    </span>
                  </div>

                  {missedCheckups.length === 0 ? (
                    <div className="p-6 text-center bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      All routine weekly checkups are up to date! No missed visits currently detected.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {missedCheckups.map((chk) => {
                        const pat = patients.find((p) => p.patientId === chk.patientId);
                        const mobileNumber = pat?.mobile || chk.mobile;

                        return (
                          <div
                            key={chk.checkupId}
                            className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs">{chk.patientName}</span>
                                <span className="font-mono text-slate-500">({chk.patientId})</span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-200 text-rose-800">
                                  Week {chk.weekNumber} Missed
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-3">
                                <span>
                                  Scheduled: <strong className="text-rose-700">{chk.scheduledDate}</strong>
                                </span>
                                <span>
                                  Registered Mobile: <strong className="text-slate-900">{mobileNumber}</strong>
                                </span>
                              </div>
                              {chk.missedAlertSent && (
                                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>SMS alert delivered to {mobileNumber} on {chk.missedAlertSentAt}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditCheckup(chk)}
                                className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1 transition"
                                title="Edit checkup details or status"
                              >
                                <Edit3 className="w-3 h-3 text-sky-700" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleSendMissedSms(chk)}
                                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <Send className="w-3 h-3" />
                                <span>{chk.missedAlertSent ? 'Resend SMS' : 'Dispatch SMS'}</span>
                              </button>

                              <button
                                onClick={() =>
                                  setSimulatedSms({
                                    isOpen: true,
                                    patientName: chk.patientName,
                                    mobile: mobileNumber,
                                    messageText:
                                      chk.missedAlertMessage ||
                                      `Dear ${chk.patientName}, you missed your scheduled weekly routine checkup on ${chk.scheduledDate} at City Hospital. Please visit clinic or contact (022) 2419-8000 to reschedule immediately.`,
                                    sentAt: chk.missedAlertSentAt || 'Delivered'
                                  })
                                }
                                className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1 transition"
                              >
                                <Smartphone className="w-3 h-3" />
                                <span>Preview</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SMS DISPATCH AUDIT LOG */}
              {activeTab === 'sms_log' && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      SMS Gateway Delivery Logs (Messages sent to numbers taken during registration)
                    </span>
                    <span className="text-slate-500 text-[11px]">{smsLogs.length} total messages sent</span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px]">
                        <tr>
                          <th className="p-2 font-bold">SMS ID</th>
                          <th className="p-2 font-bold">Patient Name</th>
                          <th className="p-2 font-bold">Registered Mobile</th>
                          <th className="p-2 font-bold">Type</th>
                          <th className="p-2 font-bold">Dispatched At</th>
                          <th className="p-2 font-bold">Status</th>
                          <th className="p-2 font-bold text-right">Preview</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {smsLogs.map((s) => (
                          <tr key={s.smsId} className="hover:bg-slate-50">
                            <td className="p-2 font-mono text-slate-600">{s.smsId}</td>
                            <td className="p-2 font-bold text-slate-900">{s.patientName}</td>
                            <td className="p-2 font-mono text-sky-800 font-semibold">{s.mobileNumber}</td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                                {s.messageType}
                              </span>
                            </td>
                            <td className="p-2 text-slate-600 text-[11px]">{s.sentAt}</td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {s.status}
                              </span>
                            </td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() =>
                                  setSimulatedSms({
                                    isOpen: true,
                                    patientName: s.patientName,
                                    mobile: s.mobileNumber,
                                    messageText: s.messageText,
                                    sentAt: s.sentAt
                                  })
                                }
                                className="text-sky-700 hover:text-sky-900 font-semibold text-[11px] inline-flex items-center gap-1"
                              >
                                <Smartphone className="w-3 h-3" />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Please select a patient from the left panel to review their weekly routine checking history.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ADD NEW WEEKLY VISIT FORM */}
      {isAddCheckupOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Log Routine Weekly Checkup — Week {patientCheckups.length + 1}
                </h3>
                <p className="text-xs text-slate-500">
                  Recording weekly checking for <strong>{selectedPatient.name}</strong> ({selectedPatient.patientId})
                </p>
              </div>
              <button
                onClick={() => setIsAddCheckupOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewWeeklyVisit} className="space-y-3 text-xs">
              {/* Vitals inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pulse Rate</label>
                  <input
                    type="text"
                    value={newPulse}
                    onChange={(e) => setNewPulse(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Body Temp</label>
                  <input
                    type="text"
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Sugar</label>
                  <input
                    type="text"
                    value={newSugar}
                    onChange={(e) => setNewSugar(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptoms & Observations</label>
                <textarea
                  rows={2}
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor&apos;s Advice & Notes</label>
                <textarea
                  rows={2}
                  value={newDoctorNotes}
                  onChange={(e) => setNewDoctorNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medications Prescribed / Continued</label>
                <input
                  type="text"
                  placeholder="e.g. Tab Enalapril 5mg, Tab Aspirin 75mg"
                  value={newMedicines}
                  onChange={(e) => setNewMedicines(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddCheckupOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-bold"
                >
                  Save Weekly Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1B: EDIT EXISTING ROUTINE CHECKUP FORM */}
      {editingCheckup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-sky-700" />
                  <span>Edit Routine Checkup — Ref: {editingCheckup.checkupId}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Week {editingCheckup.weekNumber} for <strong>{editingCheckup.patientName}</strong> ({editingCheckup.patientId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCheckup(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCheckup} className="space-y-3 text-xs">
              {/* Checkup Status & Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Checkup Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold bg-white text-slate-800"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={editScheduledDate}
                    onChange={(e) => setEditScheduledDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Visit Date</label>
                  <input
                    type="date"
                    value={editActualDate}
                    onChange={(e) => setEditActualDate(e.target.value)}
                    disabled={editStatus !== 'Completed'}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Vitals inputs */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={editBp}
                    onChange={(e) => setEditBp(e.target.value)}
                    placeholder="120/80 mmHg"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pulse Rate</label>
                  <input
                    type="text"
                    value={editPulse}
                    onChange={(e) => setEditPulse(e.target.value)}
                    placeholder="76 bpm"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Body Temp</label>
                  <input
                    type="text"
                    value={editTemp}
                    onChange={(e) => setEditTemp(e.target.value)}
                    placeholder="98.6 F"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    placeholder="70 kg"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Sugar</label>
                  <input
                    type="text"
                    value={editSugar}
                    onChange={(e) => setEditSugar(e.target.value)}
                    placeholder="110 mg/dL"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              {/* Clinical evaluation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Symptoms Observed
                </label>
                <textarea
                  rows={2}
                  value={editSymptoms}
                  onChange={(e) => setEditSymptoms(e.target.value)}
                  placeholder="Record symptoms or patient reported status..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor's Instructions & Treatment Notes
                </label>
                <textarea
                  rows={2}
                  value={editDoctorNotes}
                  onChange={(e) => setEditDoctorNotes(e.target.value)}
                  placeholder="Prescription adjustments, clinical advice, or warnings..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCheckup(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Routine Checkup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REALISTIC SMARTPHONE SCREEN SIMULATING DELIVERED MISSED CHECKUP SMS */}
      {simulatedSms && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-[44px] p-3.5 max-w-[340px] w-full border-4 border-slate-700 shadow-2xl space-y-3 relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>

            {/* Phone Screen Viewport */}
            <div className="bg-slate-900 rounded-[32px] overflow-hidden flex flex-col h-[480px] border border-slate-800 text-white">
              {/* iOS Status Bar */}
              <div className="px-5 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>9:41</span>
                <span>5G • 100%</span>
              </div>

              {/* Messaging App Top Bar */}
              <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  CH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">City Care Hospital SMS</h4>
                  <p className="text-[10px] text-sky-400">
                    To: {simulatedSms.mobile} ({simulatedSms.patientName})
                  </p>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                <div className="text-center text-[10px] text-slate-400 font-medium">
                  {simulatedSms.sentAt} • Cellular SMS Direct
                </div>

                {/* Received SMS Bubble */}
                <div className="bg-slate-800 p-3.5 rounded-2xl rounded-tl-xs border border-slate-700 text-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase tracking-wide">
                    <AlertCircle className="w-3 h-3" />
                    <span>URGENT HEALTH NOTICE</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-200">
                    {simulatedSms.messageText}
                  </p>
                  <div className="text-[9px] text-slate-400 text-right pt-1 border-t border-slate-700/50">
                    ✓ Delivered to {simulatedSms.mobile}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[10px] text-sky-300">
                  ℹ️ This alert was automatically dispatched to the exact phone number captured during registration.
                </div>
              </div>

              {/* Bottom Close Button */}
              <div className="p-3 bg-slate-800 border-t border-slate-700 text-center">
                <button
                  onClick={() => setSimulatedSms(null)}
                  className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition"
                >
                  Close Mobile Simulator
                </button>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};
