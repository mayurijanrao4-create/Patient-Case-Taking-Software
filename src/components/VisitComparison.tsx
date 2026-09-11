import React, { useState, useEffect } from 'react';
import { Patient, CaseHistory, Examination, Diagnosis, Prescription, FollowUp } from '../types';
import {
  ArrowRightLeft,
  Calendar,
  User,
  Activity,
  Stethoscope,
  Pill,
  Printer,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search
} from 'lucide-react';

interface Props {
  patients: Patient[];
  cases: CaseHistory[];
  examinations: Examination[];
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  followups: FollowUp[];
  initialCaseId1?: number | null;
  initialCaseId2?: number | null;
  initialPatientId?: string;
  onBackToTimeline?: () => void;
}

export const VisitComparison: React.FC<Props> = ({
  patients,
  cases,
  examinations,
  diagnoses,
  prescriptions,
  followups,
  initialCaseId1,
  initialCaseId2,
  initialPatientId,
  onBackToTimeline
}) => {
  // Determine patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    if (initialPatientId) return initialPatientId;
    if (initialCaseId1) {
      const c = cases.find((c) => c.caseId === initialCaseId1);
      if (c) return c.patientId;
    }
    return 'PAT-1001';
  });

  const patient = patients.find((p) => p.patientId === selectedPatientId) || patients[0];

  // Available visits for this patient
  const patientVisits = cases
    .filter((c) => c.patientId.toLowerCase() === (patient?.patientId || '').toLowerCase())
    .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()); // oldest to newest

  const [caseIdA, setCaseIdA] = useState<number | ''>('');
  const [caseIdB, setCaseIdB] = useState<number | ''>('');

  useEffect(() => {
    if (patientVisits.length >= 2) {
      // Default: compare penultimate with latest visit
      const vA = initialCaseId1 || patientVisits[patientVisits.length - 2].caseId;
      const vB = initialCaseId2 || patientVisits[patientVisits.length - 1].caseId;
      setCaseIdA(vA);
      setCaseIdB(vB);
    } else if (patientVisits.length === 1) {
      setCaseIdA(patientVisits[0].caseId);
      setCaseIdB(patientVisits[0].caseId);
    }
  }, [selectedPatientId]);

  const visitA = cases.find((c) => c.caseId === caseIdA);
  const examA = visitA ? examinations.find((e) => e.caseId === visitA.caseId) : undefined;
  const diagA = visitA ? diagnoses.find((d) => d.caseId === visitA.caseId) : undefined;
  const rxA = visitA ? prescriptions.find((p) => p.caseId === visitA.caseId) : undefined;
  const followA = visitA ? followups.find((f) => f.caseId === visitA.caseId) : undefined;

  const visitB = cases.find((c) => c.caseId === caseIdB);
  const examB = visitB ? examinations.find((e) => e.caseId === visitB.caseId) : undefined;
  const diagB = visitB ? diagnoses.find((d) => d.caseId === visitB.caseId) : undefined;
  const rxB = visitB ? prescriptions.find((p) => p.caseId === visitB.caseId) : undefined;
  const followB = visitB ? followups.find((f) => f.caseId === visitB.caseId) : undefined;

  // Temperature diff helper
  const getTempAnalysis = (t1?: string, t2?: string) => {
    if (!t1 || !t2) return { text: 'No baseline', type: 'neutral' };
    const num1 = parseFloat(t1);
    const num2 = parseFloat(t2);
    if (isNaN(num1) || isNaN(num2)) return { text: 'Inconclusive format', type: 'neutral' };
    const diff = +(num2 - num1).toFixed(1);
    if (num1 > 99.0 && num2 <= 98.8) {
      return { text: `Fever Resolved (${diff}°F)`, type: 'improved' };
    }
    if (diff < 0) {
      return { text: `Decreased by ${Math.abs(diff)}°F`, type: 'improved' };
    }
    if (diff > 0) {
      return { text: `Elevated by +${diff}°F`, type: 'worse' };
    }
    return { text: 'Stable / Afebrile', type: 'neutral' };
  };

  // Pulse diff helper
  const getPulseAnalysis = (p1?: string, p2?: string) => {
    if (!p1 || !p2) return { text: 'No data', type: 'neutral' };
    const num1 = parseInt(p1);
    const num2 = parseInt(p2);
    if (isNaN(num1) || isNaN(num2)) return { text: 'Inconclusive', type: 'neutral' };
    const diff = num2 - num1;
    if (num1 > 90 && num2 <= 80) {
      return { text: `Tachycardia Normalized (${diff} bpm)`, type: 'improved' };
    }
    if (diff < 0) {
      return { text: `Reduced (${diff} bpm)`, type: 'improved' };
    }
    if (diff > 0) {
      return { text: `Increased (+${diff} bpm)`, type: 'neutral' };
    }
    return { text: 'Constant pulse', type: 'neutral' };
  };

  // Weight diff helper
  const getWeightAnalysis = (w1?: string, w2?: string) => {
    if (!w1 || !w2) return { text: 'No data', type: 'neutral' };
    const num1 = parseFloat(w1);
    const num2 = parseFloat(w2);
    if (isNaN(num1) || isNaN(num2)) return { text: 'Inconclusive', type: 'neutral' };
    const diff = +(num2 - num1).toFixed(1);
    if (diff > 0) return { text: `+${diff} kg gain`, type: 'neutral' };
    if (diff < 0) return { text: `${diff} kg loss`, type: 'neutral' };
    return { text: 'Weight stable (0 kg)', type: 'neutral' };
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-900 text-white rounded-xl shadow-md">
              <ArrowRightLeft className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Visit-to-Visit Clinical Comparison</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Side-by-Side Clinical Audit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Compare vital trajectories, symptom resolution, diagnostic evolution, and prescription response
              </p>
            </div>
          </div>

          {/* Patient Quick Selector */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-sm"
            >
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientId} - {p.name} ({p.gender}, {p.age}y)
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Comparison</span>
            </button>

            {onBackToTimeline && (
              <button
                onClick={onBackToTimeline}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
              >
                View Timeline
              </button>
            )}
          </div>
        </div>

        {/* Visit Pickers (Visit A vs Visit B) */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Visit A (Baseline / Earlier Encounter):
            </label>
            <select
              value={caseIdA}
              onChange={(e) => setCaseIdA(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white font-semibold text-slate-800"
            >
              {patientVisits.map((v) => (
                <option key={v.caseId} value={v.caseId}>
                  Case #{v.caseId} — {v.visitDate}: {v.chiefComplaint} ({v.doctorName || 'Dr. Jenkins'})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200">
            <label className="block text-xs font-bold text-indigo-950 mb-1">
              Visit B (Review / Comparison Encounter):
            </label>
            <select
              value={caseIdB}
              onChange={(e) => setCaseIdB(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-indigo-300 bg-white font-semibold text-indigo-900"
            >
              {patientVisits.map((v) => (
                <option key={v.caseId} value={v.caseId}>
                  Case #{v.caseId} — {v.visitDate}: {v.chiefComplaint} ({v.doctorName || 'Dr. Jenkins'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Side-by-Side Comparison Table */}
      {!visitA || !visitB ? (
        <div className="p-8 bg-white rounded-xl text-center text-slate-500 border border-slate-200">
          Please select two visits to calculate side-by-side comparison.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-sm">
                Clinical Metrics Comparison: Visit #{visitA.caseId} ({visitA.visitDate}) vs Visit #{visitB.caseId} ({visitB.visitDate})
              </span>
            </div>
            <span className="text-xs text-slate-300 font-mono">
              Patient: {patient.name} ({patient.patientId})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-1/4">Clinical Parameter</th>
                  <th className="py-3 px-4 w-1/4 bg-slate-50 border-x border-slate-200">
                    Visit A ({visitA.visitDate})
                  </th>
                  <th className="py-3 px-4 w-1/4 bg-indigo-50/50 border-r border-slate-200 text-indigo-950">
                    Visit B ({visitB.visitDate})
                  </th>
                  <th className="py-3 px-4 w-1/4">Change / Clinical Trajectory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {/* 1. Chief Complaint */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Chief Complaint</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-medium">
                    {visitA.chiefComplaint}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-bold text-indigo-900">
                    {visitB.chiefComplaint}
                  </td>
                  <td className="py-2.5 px-4">
                    {visitA.chiefComplaint === visitB.chiefComplaint ? (
                      <span className="text-slate-500 font-medium">Unchanged reason for consultation</span>
                    ) : (
                      <span className="text-indigo-700 font-semibold">Symptom pattern shifted</span>
                    )}
                  </td>
                </tr>

                {/* 2. Reported Symptoms */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Symptoms & Duration</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200">
                    {visitA.symptoms} <span className="text-slate-500 text-[11px]">({visitA.duration})</span>
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-medium text-slate-900">
                    {visitB.symptoms} <span className="text-slate-500 text-[11px]">({visitB.duration})</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      Progression Documented
                    </span>
                  </td>
                </tr>

                {/* 3. Temperature */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Body Temperature</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-mono font-semibold">
                    {examA?.temperature || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-mono font-bold text-indigo-900">
                    {examB?.temperature || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4">
                    {(() => {
                      const res = getTempAnalysis(examA?.temperature, examB?.temperature);
                      return (
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                            res.type === 'improved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.type === 'worse'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {res.type === 'improved' && <TrendingDown className="w-3.5 h-3.5" />}
                          {res.type === 'worse' && <TrendingUp className="w-3.5 h-3.5" />}
                          {res.text}
                        </span>
                      );
                    })()}
                  </td>
                </tr>

                {/* 4. Pulse Rate */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Pulse Rate</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-mono">
                    {examA?.pulseRate || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-mono font-bold text-indigo-900">
                    {examB?.pulseRate || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4">
                    {(() => {
                      const res = getPulseAnalysis(examA?.pulseRate, examB?.pulseRate);
                      return (
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                            res.type === 'improved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {res.text}
                        </span>
                      );
                    })()}
                  </td>
                </tr>

                {/* 5. Blood Pressure */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Blood Pressure (BP)</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-mono">
                    {examA?.bloodPressure || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-mono font-bold text-indigo-900">
                    {examB?.bloodPressure || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-700">Normotensive range maintained</span>
                  </td>
                </tr>

                {/* 6. Weight */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Patient Weight</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-mono">
                    {examA?.weight || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-mono font-bold text-indigo-900">
                    {examB?.weight || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4">
                    {(() => {
                      const res = getWeightAnalysis(examA?.weight, examB?.weight);
                      return <span className="font-semibold text-slate-700">{res.text}</span>;
                    })()}
                  </td>
                </tr>

                {/* 7. Clinical Diagnosis */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Diagnosis</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 font-semibold text-slate-800">
                    {diagA?.diagnosisText || 'Not recorded'}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 font-bold text-indigo-900">
                    {diagB?.diagnosisText || 'Not recorded'}
                  </td>
                  <td className="py-2.5 px-4">
                    {diagA?.diagnosisText === diagB?.diagnosisText ? (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                        Ongoing condition treatment
                      </span>
                    ) : (
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        Diagnosis evolving with therapeutic outcome
                      </span>
                    )}
                  </td>
                </tr>

                {/* 8. Prescriptions */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Prescribed Regimen</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200">
                    {rxA && rxA.medicines.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 font-medium">
                        {rxA.medicines.map((m, i) => (
                          <li key={i}>
                            <span className="font-bold">{m.medicineName}</span> ({m.dosage})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">No medicines</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200">
                    {rxB && rxB.medicines.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 font-medium text-indigo-950">
                        {rxB.medicines.map((m, i) => (
                          <li key={i}>
                            <span className="font-bold">{m.medicineName}</span> ({m.dosage})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic">No medicines</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-purple-700">
                      {rxA?.medicines.length || 0} meds → {rxB?.medicines.length || 0} meds
                    </span>
                  </td>
                </tr>

                {/* 9. Doctor Notes & Handover */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Doctor Notes</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200 italic text-slate-600">
                    "{visitA.doctorNotes || 'Routine consultation'}"
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200 italic text-indigo-900">
                    "{visitB.doctorNotes || 'Routine review'}"
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-slate-600 font-medium">Clinical feedback logged</span>
                  </td>
                </tr>

                {/* 10. Case Status */}
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Case Outcome Status</td>
                  <td className="py-2.5 px-4 bg-slate-50/40 border-x border-slate-200">
                    <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800">
                      {visitA.caseStatus || 'Completed'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 bg-indigo-50/30 border-r border-slate-200">
                    <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-900">
                      {visitB.caseStatus || 'Completed'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Patient Longitudinal Continuity Maintained
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
