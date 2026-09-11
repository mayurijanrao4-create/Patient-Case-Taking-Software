import React, { useState } from 'react';
import { PatientDocument, Patient } from '../types';
import { generateSingleDocumentPdf } from '../utils/pdfGenerator';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  User,
  Plus,
  X,
  FileCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  documents: PatientDocument[];
  patients: Patient[];
  onUploadDocument: (doc: PatientDocument) => void;
  selectedPatientId?: string;
}

export const PatientDocumentsView: React.FC<Props> = ({
  documents,
  patients,
  onUploadDocument,
  selectedPatientId = 'PAT-1001'
}) => {
  const [currentPatientId, setCurrentPatientId] = useState<string>(selectedPatientId || 'PAT-1001');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'Lab Report' | 'Radiology / X-Ray' | 'Discharge Summary' | 'Prescription Scan' | 'Other'>('Lab Report');
  const [docDescription, setDocDescription] = useState('');
  const [docDate, setDocDate] = useState('2026-09-10');

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<PatientDocument | null>(null);

  const patient = patients.find((p) => p.patientId === currentPatientId) || patients[0];

  const patientDocs = documents.filter((d) => d.patientId === (patient?.patientId || ''));

  const filteredDocs = patientDocs.filter((d) => {
    if (selectedCategory !== 'All' && d.documentType !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.documentName.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: PatientDocument = {
      documentId: `DOC-${100 + documents.length + 1}`,
      patientId: patient.patientId,
      documentName: docName.trim(),
      documentType: docType,
      documentDate: docDate,
      description: docDescription.trim() || 'Attached to patient health record dossier.',
      filePath: `records/${patient.patientId}/${docName.replace(/\s+/g, '_')}.pdf`,
      fileSize: '420 KB',
      uploadedBy: 'Dr. Sarah Jenkins'
    };

    onUploadDocument(newDoc);
    setIsUploadOpen(false);
    setDocName('');
    setDocDescription('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Radiology / X-Ray':
        return <ImageIcon className="w-5 h-5 text-indigo-500" />;
      case 'Discharge Summary':
        return <FileCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md">
              <FileText className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Patient Document & Diagnostic Repository</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  {patientDocs.length} Documents Attached
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage digital lab findings, radiology imaging, external hospital discharge summaries, and ECG strips
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={currentPatientId}
              onChange={(e) => setCurrentPatientId(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 shadow-sm"
            >
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.patientId} - {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Attach New Document</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Category:</span>
            {['All', 'Lab Report', 'Radiology / X-Ray', 'Discharge Summary', 'Prescription Scan'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title..."
              className="w-full pl-9 pr-3 py-1 text-xs rounded border border-slate-300 bg-slate-50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Document Grid / Table */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Documents Uploaded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No diagnostic reports or scans have been attached to {patient.name}'s medical record under this category.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="mt-4 px-3.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.documentId}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      {getTypeIcon(doc.documentType)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {doc.documentType}
                      </span>
                      <span className="font-mono text-[10px] text-sky-700 font-bold">{doc.documentId}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{doc.fileSize || '350 KB'}</span>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">{doc.documentName}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {doc.description || 'Clinical diagnostic documentation attached to record.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{doc.documentDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => generateSingleDocumentPdf(doc, patient)}
                    className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 transition"
                    title="Download Report in .pdf format"
                  >
                    <Download className="w-3 h-3 text-emerald-600" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-[11px] flex items-center gap-1 transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">Attach Document to {patient.name}</h3>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Title / Investigation Name: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. 12-Lead Electrocardiogram (ECG) Report"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Category:</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs"
                  >
                    <option value="Lab Report">Lab Report (Pathology/Hematology)</option>
                    <option value="Radiology / X-Ray">Radiology / X-Ray / CT / MRI</option>
                    <option value="Discharge Summary">Discharge Summary / Transfer</option>
                    <option value="Prescription Scan">Prescription Scan</option>
                    <option value="Other">Other Diagnostic Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Date:</label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-slate-50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Findings / Description:</label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Summary of lab values or radiologist notes..."
                  className="w-full px-3 py-1.5 rounded border border-slate-300 bg-slate-50 text-xs"
                />
              </div>

              {/* Simulated File Selector */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="font-semibold text-slate-700 text-xs">Simulated File Attachment</p>
                <p className="text-[11px] text-slate-500">Supported formats: PDF, DICOM, JPEG, PNG (Simulated storage)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm"
                >
                  Save & Attach Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="font-bold text-sm">{previewDoc.documentName}</h3>
                  <p className="text-[11px] text-slate-300">{previewDoc.documentType} • {previewDoc.documentDate}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Simulated Medical Document Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-slate-50">
              {/* Header inside document */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">CITY HEALTHCARE MEMORIAL HOSPITAL</h4>
                  <p className="text-[10px] text-slate-500 font-mono">DEPARTMENT OF DIAGNOSTIC PATHOLOGY & RADIOLOGY</p>
                </div>
                <div className="text-right text-[11px]">
                  <span className="font-mono text-slate-500">Ref: {previewDoc.documentId}</span>
                  <p className="font-bold text-slate-900">Patient: {patient.name} ({patient.patientId})</p>
                </div>
              </div>

              {/* Document details */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-3 text-xs text-slate-800">
                <div className="border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Investigation Findings & Technical Notes:
                  </span>
                  <p className="mt-1 font-medium leading-relaxed">{previewDoc.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 bg-slate-50 p-3 rounded">
                  <div>
                    <span className="font-bold text-slate-700 block">Uploaded By:</span>
                    <span>{previewDoc.uploadedBy || 'Dr. Sarah Jenkins'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">File Storage Path:</span>
                    <span className="font-mono">{previewDoc.filePath || 'records/archive.pdf'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">File Size:</span>
                    <span>{previewDoc.fileSize || '342 KB'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Integrity Hash:</span>
                    <span className="font-mono">SHA256: 8f4e2...a19c</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-[11px]">
                  <p className="font-bold">Verified Electronic Signature:</p>
                  <p className="italic mt-0.5">Digitally signed and sealed by Chief Medical Officer under Section 65B IE Act.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => generateSingleDocumentPdf(previewDoc, patient)}
                className="px-3.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                title="Download this investigation report directly in .pdf format"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.pdf)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 font-semibold text-xs"
              >
                Print Report
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded bg-slate-800 text-white font-semibold text-xs"
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
