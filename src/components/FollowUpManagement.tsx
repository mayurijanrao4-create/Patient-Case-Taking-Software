import React, { useState } from 'react';
import { FollowUp, Patient, SmsMessage, CaseHistory } from '../types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  XCircle,
  Search,
  User,
  Filter,
  RefreshCw,
  Plus,
  Phone,
  MessageSquare
} from 'lucide-react';

interface Props {
  followups: FollowUp[];
  patients: Patient[];
  cases: CaseHistory[];
  onUpdateFollowUp: (followupId: number, updates: Partial<FollowUp>) => void;
  onSendSmsReminder: (patient: Patient, followUp: FollowUp) => void;
  onViewPatientTimeline?: (patientId: string) => void;
}

export const FollowUpManagement: React.FC<Props> = ({
  followups,
  patients,
  cases,
  onUpdateFollowUp,
  onSendSmsReminder,
  onViewPatientTimeline
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    followup: FollowUp | null;
    newDate: string;
    newReason: string;
  }>({
    isOpen: false,
    followup: null,
    newDate: '',
    newReason: ''
  });

  const todayStr = '2026-09-10'; // Simulated system clinical date

  // Categorize followups
  const categorized = followups.map((f) => {
    const patient = patients.find((p) => p.patientId === f.patientId) ||
      (f.caseId ? patients.find((p) => p.patientId === cases.find((c) => c.caseId === f.caseId)?.patientId) : undefined);
    const patientName = f.patientName || patient?.name || 'Unknown Patient';
    const patientMobile = patient?.mobile || '9876543210';
    const patientId = f.patientId || patient?.patientId || 'PAT-1001';

    let category: 'today' | 'upcoming' | 'overdue' | 'completed' = 'upcoming';
    if (f.status === 'Completed') {
      category = 'completed';
    } else if (f.followupDate === todayStr) {
      category = 'today';
    } else if (f.followupDate < todayStr) {
      category = 'overdue';
    } else {
      category = 'upcoming';
    }

    return {
      ...f,
      patientId,
      patientName,
      patientMobile,
      category
    };
  });

  const todayCount = categorized.filter((f) => f.category === 'today').length;
  const upcomingCount = categorized.filter((f) => f.category === 'upcoming').length;
  const overdueCount = categorized.filter((f) => f.category === 'overdue').length;
  const completedCount = categorized.filter((f) => f.category === 'completed').length;

  let filtered = categorized;
  if (activeTab !== 'all') {
    filtered = filtered.filter((f) => f.category === activeTab);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (f) =>
        f.patientName.toLowerCase().includes(q) ||
        f.patientId.toLowerCase().includes(q) ||
        (f.reason && f.reason.toLowerCase().includes(q)) ||
        (f.notes && f.notes.toLowerCase().includes(q))
    );
  }

  const handleOpenReschedule = (f: FollowUp) => {
    setRescheduleModal({
      isOpen: true,
      followup: f,
      newDate: f.followupDate,
      newReason: f.reason || f.notes || ''
    });
  };

  const handleSaveReschedule = () => {
    if (!rescheduleModal.followup) return;
    onUpdateFollowUp(rescheduleModal.followup.followupId, {
      followupDate: rescheduleModal.newDate,
      reason: rescheduleModal.newReason,
      status: 'Scheduled'
    });
    setRescheduleModal({ isOpen: false, followup: null, newDate: '', newReason: '' });
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-900 text-white rounded-xl shadow-md">
              <Calendar className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Advanced Follow-Up Tracking</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  Simulated Date: {todayStr}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track appointments, overdue reviews, trigger instant SMS alerts, and reschedule patient follow-ups
              </p>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name / ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Follow-Ups ({categorized.length})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'today'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Follow-Ups</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-200 text-sky-950 font-mono">
              {todayCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'upcoming'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Follow-Ups</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-200 text-indigo-950 font-mono">
              {upcomingCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'overdue'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Overdue Follow-Ups</span>
            {overdueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono font-bold">
                {overdueCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>
      </div>

      {/* Follow-up Queue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Patient Details</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Clinical Reason / Notes</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No follow-ups found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const patient = patients.find((p) => p.patientId === item.patientId);

                  return (
                    <tr key={item.followupId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="font-bold text-slate-900 block">{item.patientName}</span>
                            <span className="font-mono text-[11px] text-sky-700">{item.patientId}</span> •{' '}
                            <span className="text-[11px] text-slate-500 font-mono">+91 {item.patientMobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span
                            className={`font-mono font-bold ${
                              item.category === 'overdue'
                                ? 'text-rose-600'
                                : item.category === 'today'
                                ? 'text-sky-700 font-extrabold'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.followupDate}
                          </span>
                        </div>
                        {item.category === 'today' && (
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 mt-0.5 inline-block">
                            Due Today
                          </span>
                        )}
                        {item.category === 'overdue' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-0.5 inline-block">
                            Past Due Date
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">
                          {item.reason || item.notes || 'Routine follow-up review'}
                        </p>
                        {item.notes && item.reason && item.notes !== item.reason && (
                          <p className="text-[11px] text-slate-500 italic truncate">{item.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.doctorName || 'Dr. Sarah Jenkins'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : item.status === 'Missed'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-sky-100 text-sky-800 border-sky-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'Completed' && (
                            <button
                              onClick={() => onUpdateFollowUp(item.followupId, { status: 'Completed' })}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] flex items-center gap-1 transition"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenReschedule(item)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-[11px] flex items-center gap-1 transition"
                            title="Reschedule Follow-up"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reschedule</span>
                          </button>

                          {patient && (
                            <button
                              onClick={() => onSendSmsReminder(patient, item)}
                              className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-[11px] flex items-center gap-1 transition"
                              title="Send SMS Reminder to registered mobile"
                            >
                              <Send className="w-3 h-3" />
                              <span>SMS</span>
                            </button>
                          )}

                          {onViewPatientTimeline && (
                            <button
                              onClick={() => onViewPatientTimeline(item.patientId)}
                              className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] transition"
                              title="View Patient Timeline"
                            >
                              Timeline
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Reschedule Follow-up Appointment</h3>
              <button
                onClick={() => setRescheduleModal({ isOpen: false, followup: null, newDate: '', newReason: '' })}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Follow-up Date:</label>
                <input
                  type="date"
                  value={rescheduleModal.newDate}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, newDate: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Reason / Notes:</label>
                <textarea
                  rows={3}
                  value={rescheduleModal.newReason}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, newReason: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g. Patient requested Monday morning slot for HbA1c review"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setRescheduleModal({ isOpen: false, followup: null, newDate: '', newReason: '' })}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
