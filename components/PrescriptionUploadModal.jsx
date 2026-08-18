'use client';
import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, X, CheckCircle2, ShieldCheck, Stethoscope, 
  Trash2, Image as ImageIcon, AlertCircle, PhoneCall, Sparkles, Check
} from 'lucide-react';

export default function PrescriptionUploadModal({
  isOpen,
  onClose,
  onAttachPrescription,
  savedPrescriptions = [],
  currentPrescription = null,
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'saved', 'doctor_call'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentPrescription?.dataUrl || null);
  const [patientName, setPatientName] = useState(currentPrescription?.patientName || '');
  const [doctorName, setDoctorName] = useState(currentPrescription?.doctorName || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid image (JPG, PNG, WebP) or PDF document.');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('File size exceeds 8MB limit. Please upload a smaller image.');
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('/icons/pdf-icon.png');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleConfirm = () => {
    if (activeTab === 'upload') {
      if (!previewUrl && !selectedFile) {
        setErrorMsg('Please select or upload a prescription file first.');
        return;
      }

      const prescriptionData = {
        id: `RX-${Date.now()}`,
        fileName: selectedFile?.name || 'prescription.jpg',
        fileType: selectedFile?.type || 'image/jpeg',
        fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '120 KB',
        dataUrl: previewUrl,
        patientName: patientName.trim() || 'Self',
        doctorName: doctorName.trim() || 'Attending Physician',
        uploadedAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        type: 'uploaded',
        status: 'pending_verification',
      };

      onAttachPrescription(prescriptionData);
      onClose();
    } else if (activeTab === 'doctor_call') {
      const prescriptionData = {
        id: `RX-DOC-${Date.now()}`,
        fileName: 'E-Prescription via Teleconsult',
        patientName: patientName.trim() || 'Self',
        doctorName: 'Med Z Tele-Doctor (Assigned)',
        uploadedAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        type: 'doctor_call',
        status: 'pending_verification',
        notes: 'User requested free doctor tele-consultation call for e-prescription generation.',
      };

      onAttachPrescription(prescriptionData);
      onClose();
    }
  };

  const handleSelectSaved = (saved) => {
    onAttachPrescription(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex items-start justify-between bg-[var(--color-surface-container-low)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full">
                  Clinical Compliance
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck size={12} /> 100% HIPAA/D&C Compliant
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[var(--color-on-surface)] mt-1">
                Doctor's Prescription (Rx)
              </h2>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                Required by medical regulations for dispensing Schedule H prescription drugs.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <UploadCloud size={15} /> Upload Prescription
          </button>

          {savedPrescriptions && savedPrescriptions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`pb-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <FileText size={15} /> Saved in Vault ({savedPrescriptions.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('doctor_call')}
            className={`pb-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'doctor_call'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <PhoneCall size={15} /> Free Doctor Call
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-hide flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-xs font-medium flex items-center gap-2 border border-[var(--color-error)]/20 animate-fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {!previewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    isDragOver 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/20' 
                      : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/60 bg-[var(--color-surface-container-lowest)]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-fixed)] text-[var(--color-primary)] flex items-center justify-center shadow-sm">
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-[var(--color-on-surface)]">
                      Click to upload or drag & drop prescription
                    </p>
                    <p className="text-xs text-[var(--color-outline)] mt-1">
                      Supports JPG, PNG, WebP or PDF (Max 8MB)
                    </p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-xs font-semibold">
                    <ImageIcon size={14} /> Take Photo / Browse Files
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] overflow-hidden shrink-0 flex items-center justify-center">
                      {previewUrl.startsWith('data:image') || previewUrl.startsWith('http') ? (
                        <img src={previewUrl} alt="Prescription Preview" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={24} className="text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                        {selectedFile?.name || currentPrescription?.fileName || 'prescription_document.jpg'}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Ready for verification
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 rounded-lg transition-colors cursor-pointer"
                    title="Remove prescription"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Patient & Doctor Metadata (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider block mb-1">
                    Patient Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider block mb-1">
                    Doctor / Clinic Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. Sharma"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Guidelines Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 space-y-1 text-xs text-blue-950 dark:text-blue-200">
                <p className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                  <ShieldCheck size={14} /> Valid Prescription Guidelines:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
                  <li>Must contain Doctor's Name, Degree & Registration Number.</li>
                  <li>Patient name and prescription issue date must be clearly visible.</li>
                  <li>Must not be older than 6 months for acute medications.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Saved in Vault */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Select a previously verified prescription from your Med Z Health Vault:
              </p>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {savedPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    onClick={() => handleSelectSaved(rx)}
                    className="p-3.5 rounded-xl border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-[var(--color-primary-fixed)]/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xs text-[var(--color-on-surface)]">
                          {rx.fileName || `Prescription ${rx.id}`}
                        </p>
                        <p className="text-[11px] text-[var(--color-outline)]">
                          Patient: {rx.patientName || 'Self'} • {rx.uploadedAt || 'Saved'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[var(--color-primary-fixed)] text-[var(--color-primary)] font-heading font-bold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                    >
                      Use This
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Request Free Doctor Call */}
          {activeTab === 'doctor_call' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                    Free Certified Doctor Tele-Consultation
                  </h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1 max-w-md mx-auto">
                    Don't have a valid prescription right now? A licensed Med Z medical practitioner will contact you shortly to evaluate your symptoms and issue an instant digital e-prescription.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Sparkles size={14} /> 100% Free Consultation for this order
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface-variant)] flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Our registered doctor will call your provided checkout phone number within 10–15 minutes to review and approve your medications.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-heading font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{activeTab === 'doctor_call' ? 'Confirm & Request Doctor Call' : 'Attach Prescription'}</span>
            <Check size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
