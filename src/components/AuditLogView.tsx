import React, { useState } from 'react';
import { AuditLog } from '../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  User,
  Database,
  Clock,
  Printer,
  FileText,
  CheckCircle2,
  Lock,
  ArrowUpDown
} from 'lucide-react';

interface Props {
  auditLogs: AuditLog[];
}

export const AuditLogView: React.FC<Props> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Sorting: newest first
  const sortedLogs = [...auditLogs].sort(
    (a, b) => new Date(b.actionDateTime).getTime() - new Date(a.actionDateTime).getTime()
  );

  const filteredLogs = sortedLogs.filter((log) => {
    if (selectedRole !== 'All' && log.userRole !== selectedRole) return false;
    if (selectedAction !== 'All' && log.action !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.tableName.toLowerCase().includes(q) ||
        log.recordId.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const uniqueActions = ['All', ...Array.from(new Set(auditLogs.map((l) => l.action)))];

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'Login':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Add Patient':
      case 'Create Case':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Add Examination':
      case 'Add Diagnosis':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Add Prescription':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Archive Patient':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Restore Patient':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">System Security Audit Log</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  HIPAA / NABH Traceability
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all database transactions, user logins, patient edits, and clinical events
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit Trail</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, record ID, table, or details..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50"
            />
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none"
            >
              <option value="All">All User Roles (Doctor & Admin)</option>
              <option value="Doctor">Doctor Only</option>
              <option value="Admin">Admin Only</option>
            </select>
          </div>

          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none"
            >
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  Action: {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-sm">
              audit_logs Table ({filteredLogs.length} Events Logged)
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">schema: patient_case_db.audit_logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Table & Record</th>
                <th className="py-3 px-4">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records matching your search filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.logId}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-600">
                      #{log.logId}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.actionDateTime}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-slate-900 block">{log.userName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">
                      <span className="text-slate-800 font-bold">{log.tableName}</span>
                      <span className="text-slate-500 block">ID: {log.recordId}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-sm truncate">
                      {log.details || 'Standard clinical transaction'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Audit Log Record #{selectedLog.logId}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Timestamp:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedLog.actionDateTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Action:</span>
                  <span className="font-bold text-slate-900">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">User Name:</span>
                  <span className="font-bold text-slate-900">{selectedLog.userName} ({selectedLog.userRole})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Database Target:</span>
                  <span className="font-mono text-slate-900">{selectedLog.tableName} • {selectedLog.recordId}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Details:</span>
                <p className="p-3 bg-slate-100 rounded text-slate-800 font-mono text-[11px] leading-relaxed">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
