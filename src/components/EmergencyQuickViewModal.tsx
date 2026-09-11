import React from 'react';
import { Patient, CaseHistory, Examination, Diagnosis, Prescription } from '../types';
import { AlertOctagon, Heart, ShieldAlert, Phone, MapPin, Pill, Activity, Stethoscope, X, Printer, QrCode, FileText } from 'lucide-react';

interface Props {
  patient: Patient | null;
  cases: CaseHistory[];
  examinations: Examination[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  isOpen: boolean;
  onClose: () => void;
  onOpenQrModal?: () => void;
  onDownloadPdf?: () => void;
}

export const EmergencyQuickViewModal: React.FC<Props> = ({
  patient,
  cases,
  examinations,
  diagnoses,
  prescriptions,
  isOpen,
  onClose,
  onOpenQrModal,
  onDownloadPdf
}) => {
  if (!isOpen || !patient) return null;

  // Find latest clinical visit data
  const patientCases = cases
    .filter((c) => c.patientId.toLowerCase() === patient.patientId.toLowerCase())
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  const latestCase = patientCases[0];
  const latestExam = latestCase ? examinations.find((e) => e.caseId === latestCase.caseId) : undefined;
  const latestDiag = latestCase ? diagnoses.find((d) => d.caseId === latestCase.caseId) : undefined;
  const latestPrescription = latestCase ? prescriptions.find((p) => p.caseId === latestCase.caseId) : undefined;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-rose-500/60 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Emergency High-Alert Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-rose-700 rounded-lg shadow animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/30 text-[10px] uppercase tracking-widest font-black text-rose-200 border border-white/20">
                  EMERGENCY TRIAGE VIEW
                </span>
                <span className="text-xs text-rose-100 font-mono">Patient ID: {patient.patientId}</span>
              </div>
              <h3 className="font-extrabold text-base leading-tight mt-0.5">{patient.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded transition"
            title="Close Emergency Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Emergency Information Grid */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: High Visibility Critical Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Blood Group Badge */}
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-lg shadow">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">Blood Group</span>
                <p className="text-2xl font-black text-rose-950 font-mono">{patient.bloodGroup}</p>
              </div>
            </div>

            {/* Age, Gender, Mobile */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demographics</span>
              <p className="text-base font-bold text-slate-900">
                {patient.age} Yrs • {patient.gender}
              </p>
              <p className="text-xs text-slate-600 font-mono flex items-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                +91 {patient.mobile}
              </p>
            </div>

            {/* Admission Status */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admission Status</span>
              <div>
                <span
                  className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                    patient.admissionType === 'IPD'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {patient.admissionType === 'IPD' ? `IPD: ${patient.bedNumber || 'Bed Assigned'}` : 'OPD Outpatient'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-1">
                {patient.wardName || 'Outpatient Clinic'}
              </p>
            </div>
          </div>

          {/* Row 2: Drug Allergies Alert (CRITICAL) */}
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-950 shadow-sm">
            <div className="flex items-center gap-2 font-black text-sm text-red-700">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>CONTRAINDICATIONS & KNOWN DRUG ALLERGIES</span>
            </div>
            <div className="mt-2 text-xs font-semibold bg-white p-3 rounded-lg border border-red-200 text-red-900">
              {patient.allergiesSummary || patient.emergencyNotes || 'No known drug allergies reported (NKDA).'}
            </div>
            <p className="text-[11px] text-red-700 mt-1.5 font-medium">
              ⚠️ Verify all injectable antibiotics and NSAIDs against documented hypersensitivity prior to administration.
            </p>
          </div>

          {/* Row 3: Latest Recorded Vital Signs */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Latest Baseline Vitals</span>
              </div>
              {latestCase && (
                <span className="text-[11px] text-slate-500 font-mono">
                  Recorded on: {latestCase.visitDate}
                </span>
              )}
            </div>

            {latestExam ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-semibold block">Blood Pressure</span>
                  <span className="text-sm font-bold font-mono text-slate-900">{latestExam.bloodPressure}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-semibold block">Pulse Rate</span>
                  <span className="text-sm font-bold font-mono text-slate-900">{latestExam.pulseRate}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-semibold block">Temperature</span>
                  <span className="text-sm font-bold font-mono text-rose-600">{latestExam.temperature}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-semibold block">Weight / Height</span>
                  <span className="text-sm font-bold font-mono text-slate-900">{latestExam.weight} / {latestExam.height}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No physical examination vitals recorded yet.</p>
            )}
          </div>

          {/* Row 4: Primary Diagnosis & Clinical Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Diagnosis */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 mb-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Active Diagnosis</span>
              </div>
              {latestDiag ? (
                <div>
                  <p className="text-xs font-bold text-slate-900">{latestDiag.diagnosisText}</p>
                  <p className="text-[11px] text-slate-600 mt-1 italic leading-relaxed">
                    "{latestDiag.doctorNotes}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No active clinical diagnosis registered.</p>
              )}
            </div>

            {/* Current Prescription Medications */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 mb-2">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>Ongoing Medications</span>
              </div>
              {latestPrescription && latestPrescription.medicines.length > 0 ? (
                <ul className="space-y-1 text-xs text-slate-700">
                  {latestPrescription.medicines.map((m, idx) => (
                    <li key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                      <span className="font-semibold">{m.medicineName}</span>
                      <span className="text-[10px] font-mono text-slate-500">{m.dosage} ({m.frequency})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No ongoing prescription medicines recorded.</p>
              )}
            </div>
          </div>

          {/* Emergency Address & Contact Note */}
          <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Residential Address: </span>
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onOpenQrModal && (
              <button
                onClick={onOpenQrModal}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <QrCode className="w-3.5 h-3.5 text-sky-600" />
                <span>Show Emergency QR</span>
              </button>
            )}
            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download PDF Dossier</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Triage Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
