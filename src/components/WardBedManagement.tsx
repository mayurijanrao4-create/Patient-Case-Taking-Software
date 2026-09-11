import React, { useState } from 'react';
import { Ward, Bed, Patient } from '../types';
import { generateHospitalAnalyticsReportPdf } from '../utils/pdfGenerator';
import {
  Bed as BedIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  UserPlus,
  Search,
  Filter,
  LogOut,
  Sparkles,
  ShieldAlert,
  Activity,
  UserCheck,
  Building2,
  PhoneCall,
  FileDown
} from 'lucide-react';

interface Props {
  wards: Ward[];
  beds: Bed[];
  patients: Patient[];
  onAllocateBed: (bedId: string, patientId: string) => void;
  onVacateBed: (bedId: string) => void;
  onTransferBed: (currentBedId: string, targetBedId: string) => void;
  onSetBedStatus: (bedId: string, status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance') => void;
  onNavigateToRegister: (preselectedWardId?: string, preselectedBedId?: string) => void;
  onSelectPatient: (patientId: string) => void;
}

export const WardBedManagement: React.FC<Props> = ({
  wards,
  beds,
  patients,
  onAllocateBed,
  onVacateBed,
  onTransferBed,
  onSetBedStatus,
  onNavigateToRegister,
  onSelectPatient
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Occupied' | 'Cleaning'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Transfer Modal State
  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    sourceBed: Bed | null;
    targetBedId: string;
  }>({
    isOpen: false,
    sourceBed: null,
    targetBedId: ''
  });

  // Direct Allocation Modal State (for already registered patients needing a bed)
  const [allocateModal, setAllocateModal] = useState<{
    isOpen: boolean;
    bed: Bed | null;
    selectedPatientId: string;
  }>({
    isOpen: false,
    bed: null,
    selectedPatientId: ''
  });

  // Unadmitted patients eligible for admission
  const unadmittedPatients = patients.filter(
    (p) => !p.bedNumber || p.bedStatus === 'Discharged' || p.bedStatus === 'None'
  );

  // Statistics calculation
  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const cleaningBeds = beds.filter((b) => b.status === 'Cleaning' || b.status === 'Maintenance').length;
  const icuBeds = beds.filter((b) => b.wardId === 'WARD-ICU');
  const icuAvailable = icuBeds.filter((b) => b.status === 'Available').length;

  // Filtered beds
  const filteredBeds = beds.filter((b) => {
    if (selectedWardId !== 'All' && b.wardId !== selectedWardId) return false;
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = b.bedNumber.toLowerCase().includes(q);
      const matchWard = b.wardName.toLowerCase().includes(q);
      const matchPatient = b.patientName?.toLowerCase().includes(q);
      const matchPatientId = b.patientId?.toLowerCase().includes(q);
      return matchNumber || matchWard || matchPatient || matchPatientId;
    }
    return true;
  });

  // Selected Ward Details
  const currentWardInfo = wards.find((w) => w.wardId === selectedWardId);

  const handleDownloadWardPdf = () => {
    generateHospitalAnalyticsReportPdf({
      reportTitle: 'INPATIENT WARD OCCUPANCY & BED ALLOCATION REPORT',
      reportType: 'Wards',
      patients,
      wards,
      beds,
      generatedBy: 'Ward Charge Nurse / Inpatient Administration'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Statistical Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Beds</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalBeds}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{wards.length} Inpatient Wards</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-700">Available Beds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{availableBeds}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {Math.round((availableBeds / (totalBeds || 1)) * 100)}% Available for Admission
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-rose-700">Occupied Beds</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{occupiedBeds}</div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">
            {Math.round((occupiedBeds / (totalBeds || 1)) * 100)}% Hospital Occupancy
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-700">Cleaning / Prep</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{cleaningBeds}</div>
          <p className="text-[11px] text-amber-600 mt-0.5">Sanitizing for Next Patient</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 bg-sky-50/40 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-sky-800">ICU Critical Beds</span>
            <ShieldAlert className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-900">
            {icuAvailable} / {icuBeds.length}
          </div>
          <p className="text-[11px] text-sky-700 font-medium mt-0.5">Ventilator Supported Vacant</p>
        </div>
      </div>

      {/* Ward Selection & Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <BedIcon className="w-5 h-5 text-sky-700" />
              Ward-wise Real-Time Bed Availability
            </h3>
            <p className="text-xs text-slate-500">
              Select a ward to view live vacancy status, monitor patient assignments, or allocate beds during registration.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWardPdf}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition"
              title="Download Inpatient Ward & Bed Occupancy Report in .pdf format"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              <span>Ward Report (.pdf)</span>
            </button>
            <button
              onClick={() => onNavigateToRegister(selectedWardId !== 'All' ? selectedWardId : undefined)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient with Bed</span>
            </button>
          </div>
        </div>

        {/* Ward Pills Tabs (Responsive Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedWardId('All')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              selectedWardId === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Hospital Wards</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedWardId === 'All' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {availableBeds} Vacant
            </span>
          </button>

          {wards.map((ward) => {
            const wardBeds = beds.filter((b) => b.wardId === ward.wardId);
            const wardVacant = wardBeds.filter((b) => b.status === 'Available').length;
            const isSelected = selectedWardId === ward.wardId;
            const isFull = wardVacant === 0;

            return (
              <button
                key={ward.wardId}
                onClick={() => setSelectedWardId(ward.wardId)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-700 text-white shadow-xs'
                    : isFull
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{ward.wardName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-sky-900 text-sky-100'
                      : isFull
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {wardVacant} / {ward.totalBeds} Available
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Ward Profile Card (When specific ward is active) */}
        {currentWardInfo && (
          <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-600 text-white rounded-md">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{currentWardInfo.wardName}</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  {currentWardInfo.floor} • Incharge: <span className="font-semibold text-slate-800">{currentWardInfo.nurseInCharge}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700 text-[11px]">
              <div className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-sky-700" />
                <span>{currentWardInfo.contactExt}</span>
              </div>
              <div className="font-medium">
                Daily Rate: <span className="font-bold text-slate-900">₹{currentWardInfo.dailyRate}/day</span>
              </div>
              <div className="px-2 py-1 bg-white border border-sky-300 rounded font-bold text-sky-900">
                Category: {currentWardInfo.category}
              </div>
            </div>
          </div>
        )}

        {/* Search & Status Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bed (e.g. ICU-02) or patient..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-800 underline px-1 whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Status:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                statusFilter === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({beds.length})
            </button>
            <button
              onClick={() => setStatusFilter('Available')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                statusFilter === 'Available'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available ({availableBeds})
            </button>
            <button
              onClick={() => setStatusFilter('Occupied')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                statusFilter === 'Occupied'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Occupied ({occupiedBeds})
            </button>
            <button
              onClick={() => setStatusFilter('Cleaning')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                statusFilter === 'Cleaning'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Cleaning ({cleaningBeds})
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Interactive Bed Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredBeds.length}</strong> beds
            {selectedWardId !== 'All' ? ` in ${currentWardInfo?.wardName}` : ' across all wards'}
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Vacant
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Occupied
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Sanitizing
            </span>
          </div>
        </div>

        {filteredBeds.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
            <BedIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No beds matched the current filters</p>
            <p className="text-xs text-slate-400">Try resetting the ward selection or status filter.</p>
            <button
              onClick={() => {
                setSelectedWardId('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="mt-2 px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBeds.map((bed) => {
              const isAvailable = bed.status === 'Available';
              const isOccupied = bed.status === 'Occupied';
              const isCleaning = bed.status === 'Cleaning' || bed.status === 'Maintenance';

              return (
                <div
                  key={bed.bedId}
                  className={`rounded-xl border p-4 transition duration-150 flex flex-col justify-between shadow-xs ${
                    isAvailable
                      ? 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                      : isOccupied
                      ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400'
                      : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Card Header: Bed ID & Status Pill */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : isOccupied
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <BedIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-base text-slate-900 leading-tight">
                            Bed {bed.bedNumber}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                            {bed.wardName}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isOccupied
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? 'bg-emerald-600' : isOccupied ? 'bg-rose-600' : 'bg-amber-600'
                          }`}
                        ></span>
                        {bed.status}
                      </span>
                    </div>

                    {/* Features list (Oxygen / Ventilator) */}
                    <div className="flex items-center gap-1.5 my-2 flex-wrap text-[10px]">
                      {bed.oxygenSupported && (
                        <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded font-semibold">
                          O₂ Supported
                        </span>
                      )}
                      {bed.ventilatorAvailable && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">
                          Ventilator Ready
                        </span>
                      )}
                    </div>

                    {/* Occupant Details (if occupied) */}
                    {isOccupied && (
                      <div className="mt-3 p-2.5 bg-white rounded-lg border border-rose-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Admitted Patient</span>
                          <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                            {bed.patientId}
                          </span>
                        </div>
                        <div
                          onClick={() => bed.patientId && onSelectPatient(bed.patientId)}
                          className="font-bold text-slate-900 hover:text-sky-700 cursor-pointer truncate"
                          title="Click to view full patient dossier"
                        >
                          {bed.patientName || 'Unknown Patient'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                          <span>Admitted:</span>
                          <span className="font-medium text-slate-700">{bed.admissionDate || 'Recent'}</span>
                        </div>
                        {bed.admittingDoctor && (
                          <div className="text-[10px] text-slate-500 truncate">
                            Doc: <span className="text-slate-700 font-medium">{bed.admittingDoctor}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Available State Details */}
                    {isAvailable && (
                      <div className="mt-3 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ready for Allocation</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          Sanitized and inspected. Ready for inpatient admission during registration.
                        </p>
                      </div>
                    )}

                    {/* Cleaning State Details */}
                    {isCleaning && (
                      <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Terminal Sanitization</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Housekeeping team is disinfecting the cot and changing linen.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    {isAvailable && (
                      <>
                        <button
                          onClick={() => {
                            setAllocateModal({
                              isOpen: true,
                              bed,
                              selectedPatientId: unadmittedPatients[0]?.patientId || ''
                            });
                          }}
                          className="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Allocate Patient</span>
                        </button>
                        <button
                          onClick={() => onNavigateToRegister(bed.wardId, bed.bedId)}
                          className="py-1.5 px-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                          title="Register a new patient and allocate this bed"
                        >
                          + New
                        </button>
                      </>
                    )}

                    {isOccupied && (
                      <>
                        <button
                          onClick={() => {
                            const availableTarget = beds.find((b) => b.status === 'Available' && b.bedId !== bed.bedId);
                            setTransferModal({
                              isOpen: true,
                              sourceBed: bed,
                              targetBedId: availableTarget ? availableTarget.bedId : ''
                            });
                          }}
                          className="flex-1 py-1.5 px-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                          title="Transfer patient to another available bed in any ward"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Transfer</span>
                        </button>
                        <button
                          onClick={() => onVacateBed(bed.bedId)}
                          className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                          title="Discharge patient and release bed for sanitization"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Discharge</span>
                        </button>
                      </>
                    )}

                    {isCleaning && (
                      <button
                        onClick={() => onSetBedStatus(bed.bedId, 'Available')}
                        className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready / Vacant</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ALLOCATE EXISTING PATIENT MODAL */}
      {allocateModal.isOpen && allocateModal.bed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <BedIcon className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Allocate Bed {allocateModal.bed.bedNumber}
                </h4>
                <p className="text-xs text-slate-500">
                  Ward: <span className="font-semibold text-slate-800">{allocateModal.bed.wardName}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Bed ID:</span>
                <span className="font-mono font-bold text-slate-800">{allocateModal.bed.bedId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facilities:</span>
                <span className="font-medium text-slate-700">
                  {allocateModal.bed.oxygenSupported ? 'Oxygen Support' : 'Standard'}
                  {allocateModal.bed.ventilatorAvailable ? ' + Ventilator' : ''}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Registered Patient for Inpatient Admission:
              </label>
              {unadmittedPatients.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  All currently registered patients already have beds allocated. Please register a new patient first!
                </div>
              ) : (
                <select
                  value={allocateModal.selectedPatientId}
                  onChange={(e) =>
                    setAllocateModal((prev) => ({ ...prev, selectedPatientId: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {unadmittedPatients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId}) - Age {p.age}, {p.gender}, Blood {p.bloodGroup}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setAllocateModal({ isOpen: false, bed: null, selectedPatientId: '' })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!allocateModal.selectedPatientId}
                onClick={() => {
                  if (allocateModal.bed && allocateModal.selectedPatientId) {
                    onAllocateBed(allocateModal.bed.bedId, allocateModal.selectedPatientId);
                    setAllocateModal({ isOpen: false, bed: null, selectedPatientId: '' });
                  }
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                Confirm Bed Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BED TRANSFER MODAL */}
      {transferModal.isOpen && transferModal.sourceBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-sky-800">
              <div className="p-2 bg-sky-100 rounded-lg">
                <ArrowRightLeft className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Patient Inpatient Bed Transfer</h4>
                <p className="text-xs text-slate-500">
                  Moving <strong className="text-slate-800">{transferModal.sourceBed.patientName}</strong> from{' '}
                  <span className="font-mono font-bold text-sky-900">{transferModal.sourceBed.bedNumber}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Location:</span>
                <span className="font-medium text-slate-800">
                  {transferModal.sourceBed.wardName} (Bed {transferModal.sourceBed.bedNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admitted Patient ID:</span>
                <span className="font-mono font-bold text-slate-800">{transferModal.sourceBed.patientId}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Destination Vacant Bed:
              </label>
              {beds.filter((b) => b.status === 'Available').length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800">
                  No vacant beds currently available in the hospital for transfer!
                </div>
              ) : (
                <select
                  value={transferModal.targetBedId}
                  onChange={(e) =>
                    setTransferModal((prev) => ({ ...prev, targetBedId: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
                >
                  {beds
                    .filter((b) => b.status === 'Available')
                    .map((b) => (
                      <option key={b.bedId} value={b.bedId}>
                        Bed {b.bedNumber} • {b.wardName} {b.oxygenSupported ? '(O₂)' : ''}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setTransferModal({ isOpen: false, sourceBed: null, targetBedId: '' })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!transferModal.targetBedId}
                onClick={() => {
                  if (transferModal.sourceBed && transferModal.targetBedId) {
                    onTransferBed(transferModal.sourceBed.bedId, transferModal.targetBedId);
                    setTransferModal({ isOpen: false, sourceBed: null, targetBedId: '' });
                  }
                }}
                className="px-5 py-2 bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                Execute Bed Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
