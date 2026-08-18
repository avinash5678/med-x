'use client';
import React from 'react';
import { 
  X, Printer, Download, ShieldCheck, CheckCircle2, 
  TestTube2, AlertCircle, Building2, User 
} from 'lucide-react';

export default function LabReportModal({
  isOpen,
  onClose,
  booking,
}) {
  if (!isOpen || !booking) return null;

  const biomarkers = booking.sampleBiomarkers || [
    { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.0 - 17.0', status: 'Normal' },
    { name: 'Fasting Blood Sugar', value: '94', unit: 'mg/dL', range: '70 - 100', status: 'Normal' },
    { name: 'Total Cholesterol', value: '185', unit: 'mg/dL', range: '< 200', status: 'Normal' },
    { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6 - 1.2', status: 'Normal' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-[160] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static"
      onClick={onClose}
    >
      <div 
        className="relative max-w-3xl w-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:w-full print:border-0 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls Bar (hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
              <TestTube2 size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                NABL Certified Digital Lab Report
              </h3>
              <p className="text-[11px] text-slate-400">
                {booking.id} • {booking.testName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold font-heading transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div 
          id="lab-report-sheet"
          className="p-6 sm:p-10 overflow-y-auto font-body text-slate-800 bg-white print:p-8 flex-1"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900">Med Z Diagnostics</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  NABL ACCREDITED LAB #MC-4921
                </span>
              </div>
              <p className="text-xs text-slate-600">Med Z Pathology Reference Laboratory, BKC, Mumbai 400051</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ICMR Reg No: MEDZ-ICMR-2024-8921 • ISO 15189:2012 Certified</p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5 bg-slate-50 p-3 rounded-xl border border-slate-200 w-full sm:w-auto">
              <p>Sample ID: <strong className="font-mono text-slate-900">{booking.id}</strong></p>
              <p>Collected: <strong className="text-slate-900">{booking.bookingDate} ({booking.timeSlot})</strong></p>
              <p>Report Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></p>
            </div>
          </div>

          {/* Patient Details Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-200 text-xs bg-slate-50/50 -mx-6 sm:-mx-10 px-6 sm:px-10">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Patient Name</span>
              <p className="font-bold text-slate-900">{booking.patientName || 'Patient'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Age / Gender</span>
              <p className="font-bold text-slate-900">{booking.patientAge || '32'} Yrs / {booking.patientGender || 'Male'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Ref. Doctor</span>
              <p className="font-bold text-slate-900">Dr. A. K. Sharma (MD)</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">Sample Specimen</span>
              <p className="font-bold text-slate-900">{booking.sampleType || 'Venous Blood'}</p>
            </div>
          </div>

          {/* Biomarkers Table */}
          <div className="py-6">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
              {booking.testName}
            </h4>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900">
                  <th className="py-3 px-3 font-bold">Biomarker / Investigation</th>
                  <th className="py-3 px-3 font-bold text-center">Observed Value</th>
                  <th className="py-3 px-3 font-bold text-center">Units</th>
                  <th className="py-3 px-3 font-bold text-center">Biological Reference Interval</th>
                  <th className="py-3 px-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-body">
                {biomarkers.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{b.name}</td>
                    <td className="py-3 px-3 font-mono font-bold text-center text-slate-900">{b.value}</td>
                    <td className="py-3 px-3 text-center text-slate-600 font-mono">{b.unit}</td>
                    <td className="py-3 px-3 text-center text-slate-600 font-mono">{b.range}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Normal' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Accreditation Footer */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-700 flex flex-col items-center justify-center p-1 text-center">
                <ShieldCheck size={16} />
                <span className="text-[7px] font-bold uppercase tracking-tighter">NABL QA</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">NABL Quality Assured</p>
                <p className="text-[10px] text-slate-500">Automated Vacuum Tube System • Barcoded Samples</p>
              </div>
            </div>

            <div className="text-center sm:text-right text-xs">
              <p className="font-heading font-bold text-slate-900 italic tracking-wider">Dr. Sneha Verma, MD (Pathology)</p>
              <p className="text-[10px] text-slate-500">Chief Pathologist & Laboratory Director (Reg #MAH-49210)</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Electronically Authenticated Clinical Report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
