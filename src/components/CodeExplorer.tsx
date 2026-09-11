import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaFile } from '../data/javaSourceCode';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Terminal
} from 'lucide-react';
import JSZip from 'jszip';

interface Props {
  initialFilePath?: string;
  onOpenSimulator: () => void;
}

export const CodeExplorer: React.FC<Props> = ({ initialFilePath, onOpenSimulator }) => {
  const [selectedFile, setSelectedFile] = useState<JavaFile>(
    JAVA_PROJECT_FILES.find((f) => f.path === initialFilePath) || JAVA_PROJECT_FILES[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const filteredFiles = JAVA_PROJECT_FILES.filter((file) => {
    const matchesCat = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesSearch =
      !searchFilter.trim() ||
      file.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
      file.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      file.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      alert('Failed to generate ZIP file. Please try copying individual files.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-120px)] bg-slate-900 text-slate-100 rounded-lg overflow-hidden border border-slate-700 shadow-xl font-sans">
      {/* Top Banner */}
      <div className="bg-slate-800 px-5 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Java MVC Academic Project Source Code</h2>
            <p className="text-xs text-slate-400">
              Complete, runnable Java Swing + JDBC + MySQL classes without pseudo-code (NetBeans / IntelliJ / VS Code ready)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-sky-300 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Back to Swing Simulator
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            {isZipping ? 'Packaging Project...' : 'Download Full Project (.zip)'}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: File Navigator */}
        <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col">
          {/* Search & Category Tabs */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter files (e.g. DAO, View)..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 pl-7"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px]">
              {['all', 'database', 'model', 'dao', 'controller', 'view'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    categoryFilter === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-900">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs transition flex items-start gap-2 ${
                    isSelected
                      ? 'bg-sky-950 text-sky-200 border border-sky-700/60 font-medium'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  {file.category === 'database' ? (
                    <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : file.category === 'view' ? (
                    <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  ) : file.category === 'dao' ? (
                    <Terminal className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <FileCode className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  )}
                  <div className="overflow-hidden">
                    <div className="truncate font-mono font-semibold">{file.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Project Summary Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-200">20+ Source Files</span>: Ready for NetBeans & IntelliJ compile.
          </div>
        </div>

        {/* Right Area: Code Display */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File Header Bar */}
          <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-xs font-semibold text-sky-200">
                src/{selectedFile.path}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-slate-300">
                {selectedFile.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description & File Location Guidance */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              <strong className="text-slate-200 font-semibold">Purpose:</strong> {selectedFile.description}
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Place at: <code>src/{selectedFile.path}</code>
            </span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
            <pre className="whitespace-pre">
              {selectedFile.code.split('\n').map((line, index) => (
                <div key={index} className="table-row hover:bg-slate-900/60">
                  <span className="table-cell select-none text-slate-600 pr-4 text-right w-10 text-[11px]">
                    {index + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
