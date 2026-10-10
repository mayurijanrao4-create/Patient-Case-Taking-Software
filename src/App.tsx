/**
 * Patient Case-Taking Software
 * Desktop-Based Academic Engineering Project
 * Java Swing GUI • MySQL Database • JDBC Connectivity • MVC Architecture
 */

import React from 'react';
import { DesktopSimulator } from './components/DesktopSimulator';
import { Stethoscope } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Global Academic Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-sky-500 text-slate-950 rounded-lg shadow-sm">
              <Stethoscope className="w-5 h-5 font-bold" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-wide text-white">
              Patient Case-Taking Software
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-0">
        <DesktopSimulator onSwitchToCode={() => {}} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-3 text-center text-xs pb-16 sm:pb-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            Patient Case-Taking Software • Third-Year Computer Engineering Project
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px]">
            <span>GUI: Java Swing (JFrame / JTable)</span>
            <span>•</span>
            <span>DB: MySQL 8.x (3NF Normalized)</span>
            <span>•</span>
            <span>Pattern: MVC + DAO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
