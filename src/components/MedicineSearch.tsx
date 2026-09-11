import React, { useState } from 'react';
import { Prescription, Patient, CaseHistory } from '../types';
import {
  Pill,
  Search,
  User,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  CheckCircle2,
  FileText,
  Filter,
  BarChart2
} from 'lucide-react';

interface Props {
  prescriptions: Prescription[];
  cases: CaseHistory[];
  patients: Patient[];
  onViewCase?: (caseId: number) => void;
  onViewPatientTimeline?: (patientId: string) => void;
}

export const MedicineSearch: React.FC<Props> = ({
  prescriptions,
  cases,
  patients,
  onViewCase,
  onViewPatientTimeline
}) => {
  const [activeMode, setActiveMode] = useState<'medicine_search' | 'patient_history'>('medicine_search');
  const [searchTerm, setSearchTerm] = useState('Paracetamol');
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-1001');

  // Flatten all medicine items with case and patient metadata
  const allPrescriptionItems = prescriptions.flatMap((p) => {
    const parentCase = cases.find((c) => c.caseId === p.caseId);
    const patient = parentCase ? patients.find((pat) => pat.patientId === parentCase.patientId) : undefined;

    return p.medicines.map((m) => ({
      ...m,
      prescriptionId: p.prescriptionId,
      caseId: p.caseId,
      date: p.prescriptionDate || parentCase?.visitDate || '2026-09-10',
      doctorNotes: p.doctorNotes,
      doctorName: parentCase?.doctorName || 'Dr. Sarah Jenkins',
      patientId: parentCase?.patientId || 'PAT-1001',
      patientName: patient?.name || 'Unknown Patient',
      patientAge: patient?.age,
      patientGender: patient?.gender,
      chiefComplaint: parentCase?.chiefComplaint
    }));
  });

  // Filtered by medicine name
  const filteredItems = allPrescriptionItems.filter((item) =>
    item.medicineName.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Unique patients for this medicine
  const uniquePatientsCount = new Set(filteredItems.map((i) => i.patientId)).size;

  // Selected patient's full prescription history
  const selectedPatient = patients.find((p) => p.patientId === selectedPatientId) || patients[0];
  const patientPrescriptions = prescriptions
    .filter((p) => {
      const parentCase = cases.find((c) => c.caseId === p.caseId);
      return parentCase && parentCase.patientId === selectedPatient?.patientId;
    })
    .sort((a, b) => new Date(b.prescriptionDate).getTime() - new Date(a.prescriptionDate).getTime());

  const quickMeds = ['Paracetamol', 'Enalapril', 'Metformin', 'Cetirizine', 'Aspirin', 'Pantoprazole', 'Amoxicillin'];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-900 text-white rounded-xl shadow-md">
              <Pill className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Prescription History & Medicine Search</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Pharmacovigilance & Formulary Audit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cross-patient medication search and longitudinal drug exposure tracking
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMode('medicine_search')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'medicine_search'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Search by Medicine
            </button>
            <button
              onClick={() => setActiveMode('patient_history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'patient_history'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Patient Prescription History
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Search Controls */}
        {activeMode === 'medicine_search' && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type drug name (e.g., Paracetamol, Enalapril, Metformin)..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 font-medium"
                />
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Quick:</span>
                {quickMeds.map((med) => (
                  <button
                    key={med}
                    onClick={() => setSearchTerm(med)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition ${
                      searchTerm.toLowerCase() === med.toLowerCase()
                        ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>

            {/* Aggregated Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-purple-50/60 p-2.5 rounded-lg border border-purple-200">
                <span className="text-[10px] text-purple-700 font-semibold block">Total Encounters</span>
                <span className="text-base font-bold text-purple-950 font-mono">{filteredItems.length}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Unique Patients Prescribed</span>
                <span className="text-base font-bold text-slate-900 font-mono">{uniquePatientsCount}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Query Term</span>
                <span className="text-xs font-bold text-slate-800 truncate block">"{searchTerm || 'All'}"</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Primary Formulary Status</span>
                <span className="text-xs font-bold text-emerald-700">Essential Drug List</span>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Patient Selector */}
        {activeMode === 'patient_history' && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Select Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
            >
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientId} - {p.name} ({p.gender}, {p.age}y)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeMode === 'medicine_search' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-sm">
                Prescription Records Matching "{searchTerm}" ({filteredItems.length} found)
              </span>
            </div>
            <span className="text-xs text-slate-400">Longitudinal Clinical Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Date & Case</th>
                  <th className="py-3 px-4">Medicine Prescribed</th>
                  <th className="py-3 px-4">Dosage & Regimen</th>
                  <th className="py-3 px-4">Duration & Instructions</th>
                  <th className="py-3 px-4">Prescribing Doctor</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No prescription logs found matching "{searchTerm}". Try another generic medicine name.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{item.patientName}</span>
                        <span className="font-mono text-[11px] text-sky-700">{item.patientId}</span> •{' '}
                        <span className="text-[11px] text-slate-500">{item.patientAge}y / {item.patientGender}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-bold text-slate-800">{item.date}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">Case #{item.caseId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-purple-950 block text-xs">{item.medicineName}</span>
                        {item.chiefComplaint && (
                          <span className="text-[10px] text-slate-500 italic block truncate max-w-xs">
                            For: {item.chiefComplaint}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-900 block">{item.dosage}</span>
                        <span className="text-[11px] text-slate-600 font-medium">Frequency: {item.frequency}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{item.duration}</span>
                        <span className="text-[11px] text-slate-500 italic">{item.instructions}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{item.doctorName}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onViewPatientTimeline && (
                          <button
                            onClick={() => onViewPatientTimeline(item.patientId)}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] transition"
                          >
                            Timeline
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mode 2: Patient Chronological Prescription History */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                Rx
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Complete Longitudinal Prescription Archive: {selectedPatient.name}
                </h3>
                <p className="text-xs text-slate-500">
                  ID: {selectedPatient.patientId} • Blood Group: {selectedPatient.bloodGroup} • Allergies: {selectedPatient.allergiesSummary || 'NKDA'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
              {patientPrescriptions.length} Prescription Encounters
            </span>
          </div>

          {patientPrescriptions.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center text-slate-400 border border-slate-200">
              No prescriptions recorded for this patient yet.
            </div>
          ) : (
            patientPrescriptions.map((rx) => {
              const parentCase = cases.find((c) => c.caseId === rx.caseId);

              return (
                <div key={rx.prescriptionId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold">
                        {rx.prescriptionDate}
                      </span>
                      <span className="font-bold text-slate-900">Case #{rx.caseId}</span>
                      {parentCase && (
                        <span className="text-slate-500 font-medium">({parentCase.chiefComplaint})</span>
                      )}
                    </div>
                    <span className="text-slate-600">
                      Prescribing Doctor: <span className="font-semibold text-slate-800">{parentCase?.doctorName || 'Dr. Jenkins'}</span>
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                            <th className="py-1 px-2">#</th>
                            <th className="py-1 px-2">Medicine Name</th>
                            <th className="py-1 px-2">Dosage</th>
                            <th className="py-1 px-2">Frequency</th>
                            <th className="py-1 px-2">Duration</th>
                            <th className="py-1 px-2">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rx.medicines.map((med, mIdx) => (
                            <tr key={mIdx} className="hover:bg-slate-50/60">
                              <td className="py-1.5 px-2 text-slate-400 font-mono">{mIdx + 1}</td>
                              <td className="py-1.5 px-2 font-bold text-purple-950">{med.medicineName}</td>
                              <td className="py-1.5 px-2 font-mono">{med.dosage}</td>
                              <td className="py-1.5 px-2">{med.frequency}</td>
                              <td className="py-1.5 px-2 font-semibold text-slate-700">{med.duration}</td>
                              <td className="py-1.5 px-2 text-slate-600">{med.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {rx.doctorNotes && (
                      <p className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                        Doctor Directions: "{rx.doctorNotes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
