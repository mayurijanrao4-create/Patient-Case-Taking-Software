import React, { useState } from 'react';
import { Database, Server, CheckCircle2, RefreshCw, X, Activity, HardDrive, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tableCounts: Record<string, number>;
}

export const DatabaseStatusModal: React.FC<Props> = ({ isOpen, onClose, tableCounts }) => {
  const [latency, setLatency] = useState(12);
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('Just now');

  if (!isOpen) return null;

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatency(Math.floor(8 + Math.random() * 8));
      setIsPinging(false);
      setLastPingTime(new Date().toLocaleTimeString());
    }, 400);
  };

  const totalRecords = (Object.values(tableCounts) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">MySQL JDBC Database Connection Status</h3>
              <p className="text-[11px] text-slate-300">HikariCP Connection Pool • InnoDB Storage Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status Row */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute inset-0 opacity-75"></div>
              </div>
              <div>
                <span className="font-bold text-emerald-950 text-sm block">Database Connected (HEALTHY)</span>
                <p className="text-[11px] text-emerald-800 font-mono">
                  jdbc:mysql://localhost:3306/patient_case_db?useSSL=false
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-emerald-900 text-sm">{latency} ms</span>
              <button
                onClick={handlePing}
                disabled={isPinging}
                className="block text-[10px] text-emerald-700 font-bold hover:underline mt-0.5 ml-auto flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                <span>Ping Test</span>
              </button>
            </div>
          </div>

          {/* Connection Pool Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Active Connections</span>
              <span className="text-sm font-bold font-mono text-slate-900">2 / 10 Active</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Idle Connections</span>
              <span className="text-sm font-bold font-mono text-slate-900">8 Idle</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Max Pool Size</span>
              <span className="text-sm font-bold font-mono text-slate-900">20 Pool</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Total Schema Rows</span>
              <span className="text-sm font-bold font-mono text-emerald-700">{totalRecords} Rows</span>
            </div>
          </div>

          {/* Table Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-sky-600" />
                <span>Managed Database Tables ({Object.keys(tableCounts).length} Relational Entities)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Dialect: MySQL 8.0.35</span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2 px-3">Table Name</th>
                    <th className="py-2 px-3">Entity Description</th>
                    <th className="py-2 px-3 text-right">Row Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(tableCounts).map(([tbl, count]) => (
                    <tr key={tbl} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-3 font-mono font-bold text-sky-900">{tbl}</td>
                      <td className="py-1.5 px-3 text-slate-600 capitalize">{tbl.replace(/_/g, ' ')}</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-right text-slate-800">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Reference Note */}
          <div className="p-3 bg-slate-100 rounded-lg text-slate-700 text-[11px] flex items-start gap-2">
            <Terminal className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">JDBC Driver: </span>
              <code className="bg-white px-1 py-0.5 rounded text-[10px]">com.mysql.cj.jdbc.Driver</code>
              <p className="mt-0.5 text-slate-600">
                Managed by <code className="bg-white px-1 py-0.5 rounded text-[10px]">DBConnection.java</code> singleton with automatic auto-commit control for clinical transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
