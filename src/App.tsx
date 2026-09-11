/**
 * Patient Case-Taking Software
 * Desktop-Based Academic Engineering Project
 * Java Swing GUI • MySQL Database • JDBC Connectivity • MVC Architecture
 */

import React, { useState } from 'react';
import { DesktopSimulator } from './components/DesktopSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { AcademicGuide } from './components/AcademicGuide';
import { Stethoscope, Code2, GraduationCap, Monitor, Download } from 'lucide-react';
import { JAVA_PROJECT_FILES } from './data/javaSourceCode';
import JSZip from 'jszip';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [selectedFilePath, setSelectedFilePath] = useState<string>('view/DashboardView.java');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleOpenCodeForFile = (filePath?: string) => {
    if (filePath) setSelectedFilePath(filePath);
    setActiveTab('code');
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('PatientCaseTakingSoftware');

      JAVA_PROJECT_FILES.forEach((f) => {
        rootFolder?.file(f.path, f.code);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PatientCaseTakingSoftware-Java-Swing-MVC.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate ZIP:', e);
      alert('Failed to generate ZIP file. Please try copying files directly from the Code view.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Global Academic Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-sky-500 text-slate-950 rounded-lg shadow-sm">
              <Stethoscope className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">Patient Case-Taking Software</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-950 text-sky-300 border border-sky-700/60">
                  Java Swing + MySQL MVC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                Academic Engineering Project • Desktop GUI • JDBC PreparedStatements
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'simulator'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop Simulator</span>
                <span className="sm:hidden">App</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'code'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Java MVC Code (20+ Files)</span>
                <span className="sm:hidden">Code</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'guide'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Academic Guide & Viva</span>
                <span className="sm:hidden">Guide</span>
              </button>
            </div>

            {/* Direct ZIP Export */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
              title="Download full project folder ready for NetBeans / IntelliJ / VS Code"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Packaging...' : 'Download .zip'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-2 sm:p-4 md:p-6">
        {activeTab === 'simulator' && (
          <DesktopSimulator onSwitchToCode={handleOpenCodeForFile} />
        )}

        {activeTab === 'code' && (
          <div className="max-w-7xl mx-auto">
            <CodeExplorer
              initialFilePath={selectedFilePath}
              onOpenSimulator={() => setActiveTab('simulator')}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="max-w-5xl mx-auto">
            <AcademicGuide onOpenCode={handleOpenCodeForFile} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-3 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            Patient Case-Taking Software • Third-Year Computer Engineering Project
          </span>
          <div className="flex items-center gap-4 text-[11px]">
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
