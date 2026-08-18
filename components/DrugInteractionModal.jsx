'use client';
import React from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertCircle, X, CheckCircle2, 
  Trash2, ArrowRight, Pill, Sparkles, Clock, RefreshCw, HeartPulse 
} from 'lucide-react';

export default function DrugInteractionModal({
  isOpen,
  onClose,
  safetyAnalysis,
  onRemoveItem,
  onProceedAnyway,
}) {
  if (!isOpen || !safetyAnalysis) return null;

  const { alerts = [], severity = 'safe', summary = '' } = safetyAnalysis;
  const isHighRisk = severity === 'high';
  const isModerate = severity === 'moderate';

  return (
    <div 
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[var(--color-outline-variant)] mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isHighRisk 
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                : isModerate
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
            }`}>
              {isHighRisk ? <ShieldAlert size={26} /> : isModerate ? <AlertCircle size={26} /> : <ShieldCheck size={26} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isHighRisk
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : isModerate
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {isHighRisk ? 'Clinical Safety Warning' : isModerate ? 'Dosage Spacing Advisory' : 'Clinically Safe'}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[var(--color-on-surface)] mt-1">
                Clinical Drug Interaction Audit
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alerts Content */}
        <div className="space-y-4 mb-6">
          {alerts.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 size={36} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h4 className="font-heading font-bold text-base text-emerald-950 dark:text-emerald-200 mb-1">
                No Adverse Drug Interactions Detected
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-400 max-w-md mx-auto leading-relaxed">
                All medications in your cart are compatible. Active chemical salts, NSAID thresholds, and absorption kinetics have been verified by Med Z Clinical Engine.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all ${
                  alert.severity === 'high'
                    ? 'bg-red-50/70 dark:bg-red-950/25 border-red-200 dark:border-red-900/60'
                    : 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)] flex items-center gap-2">
                    {alert.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    alert.severity === 'high'
                      ? 'bg-red-200/80 text-red-900 dark:bg-red-900 dark:text-red-200'
                      : 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                  }`}>
                    {alert.severity === 'high' ? 'High Risk' : 'Caution'}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--color-on-surface-variant)]">
                  <span>Involves:</span>
                  {alert.medicinesInvolved.map((med, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--color-surface-container-lowest)] rounded-md border border-[var(--color-outline-variant)] text-[var(--color-on-surface)]">
                      {med}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                  {alert.description}
                </p>

                <div className="p-3 rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/60 text-xs flex items-start gap-2 mb-4">
                  <HeartPulse size={15} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[var(--color-on-surface)]">Pharmacist Guidance: </span>
                    <span className="text-[var(--color-on-surface-variant)]">{alert.recommendation}</span>
                  </div>
                </div>

                {alert.suggestedRemovalId && onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveItem(alert.suggestedRemovalId);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Trash2 size={14} />
                    <span>{alert.actionLabel || 'Resolve Conflict'}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Guidance */}
        <div className="pt-4 border-t border-[var(--color-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--color-outline)] italic text-center sm:text-left">
            * Screened automatically against standard pharmaceutical guidelines. Consult a physician for individualized medical advice.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] font-heading font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            {isHighRisk && onProceedAnyway && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedAnyway();
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-heading font-semibold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Proceed with Caution
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
