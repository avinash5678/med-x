'use client';
import React, { useState } from 'react';
import { 
  FileText, Plus, ShieldCheck, Download, Trash2, ExternalLink, 
  Clock, CheckCircle2, AlertCircle, PhoneCall, Image as ImageIcon, Search
} from 'lucide-react';

export default function PrescriptionsView({
  prescriptions = [],
  onOpenUploadModal,
  onDeletePrescription,
  setCurrentView,
}) {
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [search, setSearch] = useState('');

  const filteredPrescriptions = prescriptions.filter(p => 
    (p.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.doctorName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1100px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-fixed)] px-2.5 py-0.5 rounded-full">
                Digital Health Vault
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck size={12} /> End-to-End Encrypted
              </span>
            </div>
            <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mt-1.5">
              My Prescriptions
            </h1>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Manage saved doctor prescriptions for quick checkout and automated refills.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-heading font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>Upload New Prescription</span>
          </button>
        </div>

        {/* Search Bar if prescriptions exist */}
        {prescriptions.length > 0 && (
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, or document name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] outline-none transition-all shadow-sm"
            />
          </div>
        )}

        {prescriptions.length === 0 ? (
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-16 text-center flex flex-col items-center justify-center atmospheric-shadow">
            <div className="w-20 h-20 bg-[var(--color-primary-fixed)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-5 shadow-inner">
              <FileText size={36} />
            </div>
            <h3 className="text-xl font-heading font-bold text-[var(--color-on-surface)] mb-2">
              No prescriptions saved yet
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-md mb-8 font-body">
              Upload your doctor's prescriptions to securely store them in your Med Z Health Vault. They'll be automatically verified by pharmacists for fast checkout.
            </p>
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="px-8 py-3.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} /> Upload First Prescription
            </button>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl">
            <p className="text-sm font-medium">No prescriptions found matching &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPrescriptions.map((rx) => {
              const isDoctorConsult = rx.type === 'doctor_call';
              return (
                <div
                  key={rx.id}
                  className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-5 atmospheric-shadow hover:border-[var(--color-primary)]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-primary)] overflow-hidden shrink-0">
                          {rx.dataUrl && (rx.dataUrl.startsWith('data:image') || rx.dataUrl.startsWith('http')) ? (
                            <img src={rx.dataUrl} alt="Rx" className="w-full h-full object-cover cursor-pointer" onClick={() => setSelectedPreview(rx)} />
                          ) : isDoctorConsult ? (
                            <PhoneCall size={22} className="text-indigo-600" />
                          ) : (
                            <FileText size={22} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                            {rx.fileName || 'Prescription Document'}
                          </h4>
                          <p className="text-xs text-[var(--color-outline)] mt-0.5">
                            Uploaded {rx.uploadedAt || 'Recently'}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${
                        rx.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : rx.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {rx.status === 'verified' ? (
                          <>
                            <CheckCircle2 size={11} /> Verified
                          </>
                        ) : rx.status === 'rejected' ? (
                          <>
                            <AlertCircle size={11} /> Rejected
                          </>
                        ) : (
                          <>
                            <Clock size={11} /> Pharmacist Review
                          </>
                        )}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--color-surface-container-low)] space-y-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-outline)] font-medium">Patient:</span>
                        <span className="font-semibold text-[var(--color-on-surface)]">{rx.patientName || 'Self'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-outline)] font-medium">Doctor/Clinic:</span>
                        <span className="font-semibold text-[var(--color-on-surface)]">{rx.doctorName || 'Attending Physician'}</span>
                      </div>
                      {rx.notes && (
                        <div className="pt-1 border-t border-[var(--color-outline-variant)]/60 text-[11px] text-[var(--color-outline)] italic">
                          {rx.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-outline-variant)]">
                    {rx.dataUrl ? (
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(rx)}
                        className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink size={13} /> View Full Preview
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--color-outline)]">Teleconsult Record</span>
                    )}

                    {onDeletePrescription && (
                      <button
                        type="button"
                        onClick={() => onDeletePrescription(rx.id)}
                        className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete Prescription"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Image Preview Modal */}
        {selectedPreview && (
          <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedPreview(null)}
          >
            <div 
              className="relative max-w-3xl w-full max-h-[85vh] bg-[var(--color-surface)] border border-white/20 rounded-2xl overflow-hidden flex flex-col p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--color-outline-variant)]">
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                    {selectedPreview.fileName}
                  </h3>
                  <p className="text-xs text-[var(--color-outline)]">
                    Patient: {selectedPreview.patientName || 'Self'} • Dr. {selectedPreview.doctorName || 'Physician'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="p-2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center p-2">
                <img 
                  src={selectedPreview.dataUrl} 
                  alt="Prescription Full View" 
                  className="max-h-[70vh] object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
