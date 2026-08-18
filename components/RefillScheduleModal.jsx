'use client';
import React, { useState } from 'react';
import { 
  Calendar, Clock, RefreshCw, X, ShieldCheck, CheckCircle2, 
  Pill, AlertCircle, Sparkles, User, Bell
} from 'lucide-react';

export default function RefillScheduleModal({
  isOpen,
  onClose,
  product,
  onSaveSchedule,
  allMedicines = [],
  user,
}) {
  const [selectedProductId, setSelectedProductId] = useState(product?.id || allMedicines[0]?.id || '');
  const [cycleDays, setCycleDays] = useState(30); // 15, 30, 60, 90
  const [frequency, setFrequency] = useState('once_daily'); // once_daily, twice_daily, thrice_daily
  const [dosageTimes, setDosageTimes] = useState({
    morning: true,
    afternoon: false,
    night: false,
  });
  const [patientName, setPatientName] = useState(user?.name || 'Self');
  const [autoReorder, setAutoReorder] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentProduct = product || allMedicines.find(m => m.id === selectedProductId) || allMedicines[0];

  const handleFrequencyChange = (freq) => {
    setFrequency(freq);
    if (freq === 'once_daily') {
      setDosageTimes({ morning: true, afternoon: false, night: false });
    } else if (freq === 'twice_daily') {
      setDosageTimes({ morning: true, afternoon: false, night: true });
    } else if (freq === 'thrice_daily') {
      setDosageTimes({ morning: true, afternoon: true, night: true });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    const nextRefillDate = new Date();
    nextRefillDate.setDate(nextRefillDate.getDate() + Number(cycleDays));

    const schedule = {
      id: `REFILL-${Date.now()}`,
      productId: currentProduct.id,
      productName: currentProduct.name,
      productPrice: currentProduct.price,
      salt: currentProduct.salt || currentProduct.description || '',
      category: currentProduct.category,
      image: currentProduct.image,
      cycleDays: Number(cycleDays),
      frequency,
      dosageTimes,
      patientName: patientName.trim() || 'Self',
      autoReorder,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      nextRefillDate: nextRefillDate.toISOString(),
      status: 'active', // 'active' | 'paused'
      dosesTakenToday: {
        morning: false,
        afternoon: false,
        night: false,
      },
    };

    onSaveSchedule(schedule);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                Schedule Pill Refill & Reminders
              </h3>
              <p className="text-xs text-[var(--color-outline)]">
                Never run out of essential chronic medications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Selected Medicine */}
          {product ? (
            <div className="p-3.5 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                <Pill size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-[var(--color-outline)] truncate">
                  {product.salt || product.category} • ₹{product.price}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
                Select Medicine
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
              >
                {allMedicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category}) - ₹{m.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refill Cycle Picker */}
          <div className="space-y-1.5">
            <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)] flex items-center justify-between">
              <span>Restock Cycle</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Save 5% on Auto-Refills</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setCycleDays(days)}
                  className={`py-2.5 rounded-xl border-2 font-heading font-bold text-xs text-center transition-all cursor-pointer ${
                    cycleDays === days
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] shadow-sm'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Daily Dosage Frequency */}
          <div className="space-y-1.5">
            <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
              Daily Dosage Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'once_daily', label: '1x Daily', sub: 'Morning' },
                { id: 'twice_daily', label: '2x Daily', sub: 'Morn + Night' },
                { id: 'thrice_daily', label: '3x Daily', sub: '3 Times' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFrequencyChange(f.id)}
                  className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    frequency === f.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <p className="font-heading font-bold text-xs">{f.label}</p>
                  <p className="text-[10px] opacity-75">{f.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-1.5">
            <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
              Patient / Family Member Name
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Father, Mother, Self"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
            />
          </div>

          {/* Auto Reorder Toggle */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="autoReorderToggle"
              checked={autoReorder}
              onChange={(e) => setAutoReorder(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <label htmlFor="autoReorderToggle" className="text-xs text-teal-950 dark:text-teal-200 leading-relaxed cursor-pointer">
              <strong className="block font-bold mb-0.5">Automated 1-Tap Restock</strong>
              We will send a reminder notification 3 days before your supply ends, with free delivery and auto-dispense from our licensed pharmacy.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[var(--color-outline-variant)] rounded-xl font-heading font-semibold text-xs text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell size={14} />
              <span>Save Refill Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
