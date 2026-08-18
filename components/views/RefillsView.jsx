'use client';
import React, { useState } from 'react';
import { 
  Calendar, Clock, Plus, RefreshCw, CheckCircle2, AlertCircle, 
  Trash2, Pause, Play, ShoppingCart, Pill, ShieldCheck, Flame, Sun, Sunset, Moon
} from 'lucide-react';

export default function RefillsView({
  refills = [],
  onOpenScheduleModal,
  onUpdateRefillStatus,
  onDeleteRefill,
  onToggleDoseTaken,
  onRefillNow,
  setCurrentView,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'paused'

  const filteredRefills = refills.filter(r => {
    if (filter === 'active') return r.status === 'active';
    if (filter === 'paused') return r.status === 'paused';
    return true;
  });

  // Calculate days until next refill
  const getDaysRemaining = (nextDateStr) => {
    if (!nextDateStr) return 30;
    const diff = new Date(nextDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Compute daily dosage schedule for today
  const morningMedicines = refills.filter(r => r.status === 'active' && r.dosageTimes?.morning);
  const afternoonMedicines = refills.filter(r => r.status === 'active' && r.dosageTimes?.afternoon);
  const nightMedicines = refills.filter(r => r.status === 'active' && r.dosageTimes?.night);

  const totalDosesToday = (morningMedicines.length + afternoonMedicines.length + nightMedicines.length);
  const completedDosesToday = refills.reduce((acc, r) => {
    if (r.status !== 'active') return acc;
    let count = 0;
    if (r.dosageTimes?.morning && r.dosesTakenToday?.morning) count++;
    if (r.dosageTimes?.afternoon && r.dosesTakenToday?.afternoon) count++;
    if (r.dosageTimes?.night && r.dosesTakenToday?.night) count++;
    return acc + count;
  }, 0);

  const compliancePercent = totalDosesToday > 0 ? Math.round((completedDosesToday / totalDosesToday) * 100) : 100;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1100px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full">
                MedVault Auto-Refill
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck size={12} /> 5% Extra Auto-Refill Discount
              </span>
            </div>
            <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mt-1.5">
              Pill Reminders & Auto-Refills
            </h1>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Manage recurring chronic medication schedules (Diabetes, BP, Heart, Thyroid) and daily dose reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenScheduleModal}
            className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] font-heading font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>Schedule New Refill</span>
          </button>
        </div>

        {/* Daily Pill Tracker Section */}
        <div className="mb-10 p-6 rounded-2xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] atmospheric-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-outline-variant)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                <Flame size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                  Today's Dosage Tracker
                </h3>
                <p className="text-xs text-[var(--color-outline)]">
                  {completedDosesToday} of {totalDosesToday} doses taken today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 bg-[var(--color-surface-container-high)] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${compliancePercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {compliancePercent}% Taken
              </span>
            </div>
          </div>

          {totalDosesToday === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-outline)]">
              No active medicines scheduled for today. Click "Schedule New Refill" to add your chronic prescriptions.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Morning Dose Slot */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Sun size={16} />
                    <span>Morning (8:00 AM)</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-outline)] font-medium">
                    {morningMedicines.length} meds
                  </span>
                </div>
                {morningMedicines.length === 0 ? (
                  <p className="text-xs text-[var(--color-outline)] italic">No morning doses</p>
                ) : (
                  <div className="space-y-2">
                    {morningMedicines.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-container-lowest)] text-xs border border-[var(--color-outline-variant)]/60">
                        <span className="font-semibold text-[var(--color-on-surface)] truncate pr-2">{m.productName}</span>
                        <button
                          type="button"
                          onClick={() => onToggleDoseTaken(m.id, 'morning')}
                          className={`p-1.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                            m.dosesTakenToday?.morning
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[var(--color-surface-container)] text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          <span>{m.dosesTakenToday?.morning ? 'Taken' : 'Take'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Afternoon Dose Slot */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs">
                    <Sunset size={16} />
                    <span>Afternoon (1:00 PM)</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-outline)] font-medium">
                    {afternoonMedicines.length} meds
                  </span>
                </div>
                {afternoonMedicines.length === 0 ? (
                  <p className="text-xs text-[var(--color-outline)] italic">No afternoon doses</p>
                ) : (
                  <div className="space-y-2">
                    {afternoonMedicines.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-container-lowest)] text-xs border border-[var(--color-outline-variant)]/60">
                        <span className="font-semibold text-[var(--color-on-surface)] truncate pr-2">{m.productName}</span>
                        <button
                          type="button"
                          onClick={() => onToggleDoseTaken(m.id, 'afternoon')}
                          className={`p-1.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                            m.dosesTakenToday?.afternoon
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[var(--color-surface-container)] text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          <span>{m.dosesTakenToday?.afternoon ? 'Taken' : 'Take'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Night Dose Slot */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Moon size={16} />
                    <span>Night (9:00 PM)</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-outline)] font-medium">
                    {nightMedicines.length} meds
                  </span>
                </div>
                {nightMedicines.length === 0 ? (
                  <p className="text-xs text-[var(--color-outline)] italic">No night doses</p>
                ) : (
                  <div className="space-y-2">
                    {nightMedicines.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface-container-lowest)] text-xs border border-[var(--color-outline-variant)]/60">
                        <span className="font-semibold text-[var(--color-on-surface)] truncate pr-2">{m.productName}</span>
                        <button
                          type="button"
                          onClick={() => onToggleDoseTaken(m.id, 'night')}
                          className={`p-1.5 rounded-md font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                            m.dosesTakenToday?.night
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-[var(--color-surface-container)] text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          <span>{m.dosesTakenToday?.night ? 'Taken' : 'Take'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Subscriptions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[var(--color-on-surface)]">
              Active Refill Schedules ({filteredRefills.length})
            </h3>
            <div className="flex gap-1.5 bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]">
              {['all', 'active', 'paused'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    filter === f
                      ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm'
                      : 'text-[var(--color-outline)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {refills.length === 0 ? (
            <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-14 text-center flex flex-col items-center justify-center atmospheric-shadow">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-4">
                <RefreshCw size={32} />
              </div>
              <h4 className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-1">
                No active refill schedules
              </h4>
              <p className="text-xs text-[var(--color-on-surface-variant)] max-w-sm mb-6">
                Set up recurring auto-refills for your daily diabetes, heart, thyroid, or BP medications to never miss a dose.
              </p>
              <button
                type="button"
                onClick={onOpenScheduleModal}
                className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={16} /> Schedule First Refill
              </button>
            </div>
          ) : filteredRefills.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-outline)] bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)]">
              No schedules matching "{filter}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRefills.map((refill) => {
                const daysLeft = getDaysRemaining(refill.nextRefillDate);
                const isPaused = refill.status === 'paused';

                return (
                  <div
                    key={refill.id}
                    className={`bg-[var(--color-surface-container-lowest)] border rounded-2xl p-5 atmospheric-shadow transition-all flex flex-col justify-between ${
                      isPaused ? 'border-[var(--color-outline-variant)] opacity-75' : 'border-[var(--color-outline-variant)] hover:border-teal-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                            {refill.image ? (
                              <img src={refill.image} alt="Med" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <Pill size={22} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                              {refill.productName}
                            </h4>
                            <p className="text-[11px] text-[var(--color-outline)] truncate">
                              {refill.salt || refill.category}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                          isPaused
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : daysLeft <= 3
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {isPaused ? 'Paused' : daysLeft === 0 ? 'Refill Due Today' : `Due in ${daysLeft} days`}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--color-surface-container-low)] space-y-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Patient:</span>
                          <span className="font-semibold text-[var(--color-on-surface)]">{refill.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Cycle:</span>
                          <span className="font-semibold text-[var(--color-on-surface)]">Every {refill.cycleDays} Days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Dosage:</span>
                          <span className="font-semibold text-[var(--color-on-surface)]">
                            {refill.frequency === 'once_daily' ? '1x Daily' : refill.frequency === 'twice_daily' ? '2x Daily' : '3x Daily'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-outline-variant)] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateRefillStatus(refill.id, isPaused ? 'active' : 'paused')}
                          className="p-2 rounded-lg text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer"
                          title={isPaused ? 'Resume Schedule' : 'Pause Schedule'}
                        >
                          {isPaused ? <Play size={15} /> : <Pause size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRefill(refill.id)}
                          className="p-2 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 transition-colors cursor-pointer"
                          title="Delete Schedule"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRefillNow(refill)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-heading font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingCart size={13} />
                        <span>Refill Now (₹{refill.productPrice})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
