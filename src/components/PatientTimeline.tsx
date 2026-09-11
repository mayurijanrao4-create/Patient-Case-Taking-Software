import React, { useState } from 'react';
import { Patient, CaseHistory, Examination, Diagnosis, Prescription, FollowUp } from '../types';
import {
  Clock,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Activity,
  Stethoscope,
  Pill,
  ArrowRightLeft,
  FileDown,
  User,
  AlertCircle,
  CheckCircle2,
  Filter,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface Props {
  patients: Patient[];
  cases: CaseHistory[];
  examinations: Examination[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  followups: FollowUp[];
  selectedPatientId?: string;
  onSelectPatient: (patientId: string) => void;
  onCompareVisits: (caseId1: number, caseId2: number) => void;
  onDownloadPdf: (patient: Patient) => void;
}

export const PatientTimeline: React.FC<Props> = ({
  patients,
  cases,
  examinations,
  diagnoses,
  prescriptions,
  followups,
  selectedPatientId = 'PAT-1001',
  onSelectPatient,
  onCompareVisits,
  onDownloadPdf
}) => {
  const [patientSearch, setPatientSearch] = useState('');
  const [currentPatientId, setCurrentPatientId] = useState(selectedPatientId || 'PAT-1001');
  const [expandedCases, setExpandedCases] = useState<Record<number, boolean>>({});
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [dateFilterEnd, setDateFilterEnd] = useState('');

  // Selected patient
  const patient = patients.find(
    (p) => p.patientId.toLowerCase() === currentPatientId.toLowerCase()
  ) || patients[0];

  // Filtered patients for dropdown/search
  const filteredPatientList = patients.filter(
    (p) =>
      p.patientId.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.mobile.includes(patientSearch)
  );

  // Chronological visits for this patient (newest first)
  let patientVisits = cases
    .filter((c) => c.patientId.toLowerCase() === (patient?.patientId || '').toLowerCase())
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  if (dateFilterStart) {
    patientVisits = patientVisits.filter((v) => v.visitDate >= dateFilterStart);
  }
  if (dateFilterEnd) {
    patientVisits = patientVisits.filter((v) => v.visitDate <= dateFilterEnd);
  }

  const toggleExpand = (caseId: number) => {
    setExpandedCases((prev) => ({
      ...prev,
      [caseId]: prev[caseId] === undefined ? false : !prev[caseId]
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    patientVisits.forEach((v) => {
      all[v.caseId] = true;
    });
    setExpandedCases(all);
  };

  const collapseAll = () => {
    const all: Record<number, boolean> = {};
    patientVisits.forEach((v) => {
      all[v.caseId] = false;
    });
    setExpandedCases(all);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Under Treatment':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Follow-up Required':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Patient Selector & Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-900 text-white rounded-xl shadow-md">
              <Clock className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Patient Longitudinal Health Timeline</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  {patientVisits.length} Recorded Visits
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Chronological clinical progression across all Outpatient & Inpatient encounters
              </p>
            </div>
          </div>

          {/* Patient Quick Picker */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search patient by name / ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            <select
              value={patient?.patientId}
              onChange={(e) => {
                setCurrentPatientId(e.target.value);
                onSelectPatient(e.target.value);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 shadow-sm"
            >
              {filteredPatientList.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientId} - {p.name} ({p.gender}, {p.age}y, {p.bloodGroup})
                </option>
              ))}
            </select>

            {patient && (
              <button
                onClick={() => onDownloadPdf(patient)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Dossier (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Patient Identity Card Banner */}
        {patient && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs bg-slate-50/70 p-3 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Full Name</span>
              <span className="font-bold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Patient ID / Blood</span>
              <span className="font-mono font-bold text-sky-800">{patient.patientId}</span> •{' '}
              <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Age / Gender</span>
              <span className="font-medium text-slate-800">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Contact Mobile</span>
              <span className="font-mono text-slate-800">+91 {patient.mobile}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Known Allergies</span>
              <span className="font-semibold text-rose-700 truncate block">
                {patient.allergiesSummary || 'NKDA'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">Admission Category</span>
              <span className="font-semibold text-slate-700">
                {patient.admissionType === 'IPD' ? `IPD (${patient.bedNumber || 'Bed Assigned'})` : 'OPD Clinic'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Filter Visits:</span>
          </div>
          <input
            type="date"
            value={dateFilterStart}
            onChange={(e) => setDateFilterStart(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 text-xs bg-slate-50 text-slate-700 focus:outline-none"
            placeholder="From Date"
          />
          <span className="text-slate-400 font-medium">to</span>
          <input
            type="date"
            value={dateFilterEnd}
            onChange={(e) => setDateFilterEnd(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 text-xs bg-slate-50 text-slate-700 focus:outline-none"
            placeholder="To Date"
          />
          {(dateFilterStart || dateFilterEnd) && (
            <button
              onClick={() => {
                setDateFilterStart('');
                setDateFilterEnd('');
              }}
              className="text-[11px] text-sky-700 font-semibold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {patientVisits.length >= 2 && (
            <button
              onClick={() => onCompareVisits(patientVisits[1].caseId, patientVisits[0].caseId)}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
              title="Compare the most recent two visits side-by-side"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Compare Last 2 Visits</span>
            </button>
          )}
          <button
            onClick={expandAll}
            className="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      {patientVisits.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Clinical Encounters Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            There are no recorded clinical case encounters for this patient matching your filter criteria. Create a new case record to begin longitudinal tracking.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-indigo-400 before:to-slate-300">
          {patientVisits.map((visit, index) => {
            const isExpanded = expandedCases[visit.caseId] !== false; // default expanded
            const exam = examinations.find((e) => e.caseId === visit.caseId);
            const diag = diagnoses.find((d) => d.caseId === visit.caseId);
            const rx = prescriptions.find((p) => p.caseId === visit.caseId);
            const follow = followups.find((f) => f.caseId === visit.caseId);

            // Previous visit for quick diff button
            const prevVisit = patientVisits[index + 1];

            return (
              <div key={visit.caseId} className="relative group">
                {/* Timeline Circle Bullet */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white z-10 transition group-hover:scale-110 ${
                    index === 0 ? 'bg-sky-600 ring-4 ring-sky-100' : 'bg-slate-600'
                  }`}
                >
                  {patientVisits.length - index}
                </div>

                {/* Visit Timeline Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(visit.caseId)}
                    className="p-4 bg-slate-50/80 hover:bg-slate-100/70 cursor-pointer flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 transition"
                  >
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
                        {visit.visitDate}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {visit.chiefComplaint}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                          visit.caseStatus || 'Completed'
                        )}`}
                      >
                        {visit.caseStatus || 'Completed'}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white uppercase tracking-wider">
                          Latest Visit
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        Attending: <span className="font-semibold text-slate-700">{visit.doctorName || 'Dr. Sarah Jenkins'}</span>
                      </span>
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Card Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4 text-xs">
                      {/* Grid 1: Clinical Symptoms & History */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/50 p-3.5 rounded-lg border border-slate-200/70">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Reported Symptoms & Duration
                          </span>
                          <p className="font-medium text-slate-800 mt-1">
                            {visit.symptoms}{' '}
                            <span className="text-slate-500 font-normal">({visit.duration})</span>
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Past Medical History & Drug Allergies
                          </span>
                          <p className="font-medium text-slate-800 mt-1">
                            Past: {visit.pastHistory || 'None'} • Allergy: <span className="text-rose-700 font-semibold">{visit.allergy || 'NKDA'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Grid 2: Physical Examination Vitals */}
                      {exam && (
                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-2">
                            <Activity className="w-4 h-4 text-sky-600" />
                            <span>Physical Examination Vitals</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-[10px] text-slate-500 block">Temperature</span>
                              <span
                                className={`text-xs font-bold font-mono ${
                                  parseFloat(exam.temperature) > 99.5 ? 'text-rose-600' : 'text-slate-800'
                                }`}
                              >
                                {exam.temperature}
                              </span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                              <span className="text-xs font-bold font-mono text-slate-800">{exam.bloodPressure}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-[10px] text-slate-500 block">Pulse Rate</span>
                              <span className="text-xs font-bold font-mono text-slate-800">{exam.pulseRate}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-[10px] text-slate-500 block">Weight</span>
                              <span className="text-xs font-bold font-mono text-slate-800">{exam.weight}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-[10px] text-slate-500 block">Height</span>
                              <span className="text-xs font-bold font-mono text-slate-800">{exam.height}</span>
                            </div>
                          </div>
                          {exam.observation && (
                            <p className="text-[11px] text-slate-600 italic mt-2">
                              Obs: {exam.observation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Grid 3: Diagnosis & Doctor Notes */}
                      {diag && (
                        <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                              <Stethoscope className="w-4 h-4 text-emerald-700" />
                              <span>Clinical Diagnosis:</span>
                              <span className="text-emerald-900 font-extrabold">{diag.diagnosisText}</span>
                            </div>
                            <span className="text-[10px] text-emerald-800 font-mono">
                              Date: {diag.diagnosisDate}
                            </span>
                          </div>
                          {diag.doctorNotes && (
                            <p className="text-[11px] text-emerald-900 mt-1 italic">
                              "{diag.doctorNotes}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Doctor Clinical Notes & Handover Notes */}
                      {(visit.doctorNotes || visit.handoverNotes) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/50 border border-amber-200/80 rounded-lg p-3 text-amber-950">
                          {visit.doctorNotes && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                Doctor Clinical Notes:
                              </span>
                              <p className="text-xs mt-0.5 font-medium">{visit.doctorNotes}</p>
                            </div>
                          )}
                          {visit.handoverNotes && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                Next Doctor / Handover Instructions:
                              </span>
                              <p className="text-xs mt-0.5 font-medium">{visit.handoverNotes}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Grid 4: Prescriptions Summary */}
                      {rx && rx.medicines.length > 0 && (
                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                              <Pill className="w-4 h-4 text-purple-600" />
                              <span>Prescription ({rx.medicines.length} Medicines)</span>
                            </div>
                            {rx.doctorNotes && (
                              <span className="text-[11px] text-slate-500 italic">
                                Note: {rx.doctorNotes}
                              </span>
                            )}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                                  <th className="py-1 px-2">Medicine</th>
                                  <th className="py-1 px-2">Dosage</th>
                                  <th className="py-1 px-2">Frequency</th>
                                  <th className="py-1 px-2">Duration</th>
                                  <th className="py-1 px-2">Instructions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rx.medicines.map((m, mIdx) => (
                                  <tr key={mIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="py-1.5 px-2 font-bold text-slate-900">{m.medicineName}</td>
                                    <td className="py-1.5 px-2 font-mono">{m.dosage}</td>
                                    <td className="py-1.5 px-2">{m.frequency}</td>
                                    <td className="py-1.5 px-2 font-semibold text-slate-700">{m.duration}</td>
                                    <td className="py-1.5 px-2 text-slate-600">{m.instructions}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Bottom Footer of Card: Follow-up & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        {follow ? (
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-sky-600" />
                            <span className="font-semibold text-slate-700">Scheduled Follow-up:</span>
                            <span className="font-mono font-bold text-sky-900">{follow.followupDate}</span>
                            <span
                              className={`px-2 py-0.2 text-[10px] rounded-full font-semibold border ${
                                follow.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-sky-50 text-sky-700 border-sky-200'
                              }`}
                            >
                              {follow.status}
                            </span>
                            {follow.notes && (
                              <span className="text-slate-500 italic hidden sm:inline">
                                ({follow.notes})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No follow-up registered</span>
                        )}

                        {/* Quick Comparison with Previous Visit */}
                        {prevVisit && (
                          <button
                            onClick={() => onCompareVisits(prevVisit.caseId, visit.caseId)}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 flex items-center gap-1.5 transition"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Compare with Visit on {prevVisit.visitDate}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
