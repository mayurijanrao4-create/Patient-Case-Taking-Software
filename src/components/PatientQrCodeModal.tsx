import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Patient, CaseHistory, Diagnosis } from '../types';
import { QrCode, Printer, X, Download, ShieldAlert, Phone, Heart, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  patient: Patient;
  latestCase?: CaseHistory;
  latestDiagnosis?: Diagnosis;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientQrCodeModal: React.FC<Props> = ({
  patient,
  latestCase,
  latestDiagnosis,
  isOpen,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !patient) return;

    // Structured JSON Payload for Hospital Emergency Scanning
    const emergencyPayload = JSON.stringify({
      id: patient.patientId,
      name: patient.name,
      bloodGroup: patient.bloodGroup,
      age: patient.age,
      gender: patient.gender,
      mobile: patient.mobile,
      allergies: patient.allergiesSummary || patient.emergencyNotes || 'NKDA',
      diagnosis: latestDiagnosis?.diagnosisText || 'None',
      hospital: 'City Healthcare Memorial Hospital',
      emergencyHotline: '(022) 2419-8000'
    }, null, 2);

    QRCode.toDataURL(emergencyPayload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [isOpen, patient, latestCase, latestDiagnosis]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Patient_QR_${patient.patientId}_${patient.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-500 text-slate-950 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Patient Emergency Medical QR Code</h3>
              <p className="text-[11px] text-slate-300">
                Longitudinal Emergency Medical Card • {patient.patientId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
            title="Close Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Printable ID Card Layout */}
        <div className="p-5 space-y-4" ref={printRef}>
          {/* Card Frame */}
          <div className="rounded-xl border-2 border-slate-800 bg-gradient-to-b from-white to-slate-50 p-4 shadow-md relative overflow-hidden">
            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                  +
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                    CITY HEALTHCARE MEMORIAL HOSPITAL
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">EMERGENCY DIGITAL HEALTH DOSSIER</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                Blood: {patient.bloodGroup}
              </span>
            </div>

            {/* Content: QR Code + Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-3 items-center">
              {/* QR Visual */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${patient.name}`}
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR...
                  </div>
                )}
                <span className="text-[9px] font-mono text-slate-500 mt-1">Scan for Instant Vitals</span>
              </div>

              {/* Patient Core Attributes */}
              <div className="sm:col-span-7 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Patient Name</span>
                  <p className="font-bold text-slate-900 text-sm">{patient.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500">ID:</span>
                    <p className="font-mono font-bold text-sky-800">{patient.patientId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Age / Sex:</span>
                    <p className="font-medium text-slate-800">{patient.age} Yrs / {patient.gender}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500">Emergency Contact:</span>
                  <p className="font-mono font-medium text-slate-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    +91 {patient.mobile}
                  </p>
                </div>

                {/* Critical Allergies Box */}
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-900 text-[11px]">
                  <div className="flex items-center gap-1 font-bold text-rose-700">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Known Drug Allergies:</span>
                  </div>
                  <p className="font-medium mt-0.5 text-rose-950">
                    {patient.allergiesSummary || patient.emergencyNotes || 'No known drug allergies reported'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span>Valid: Hospital Database Linked</span>
              <span className="font-mono font-semibold text-slate-700">Triage Hotline: (022) 2419-8000</span>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Doctor & Paramedic Quick Scan Compatible</p>
              <p className="text-[11px] text-sky-800 mt-0.5">
                Scanning this QR code on any mobile phone, tablet, or emergency room barcode scanner instantly parses the patient identity, emergency contacts, blood group, and critical drug allergy contraindications without requiring manual database search.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadQr}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR Image</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Medical ID Card</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
