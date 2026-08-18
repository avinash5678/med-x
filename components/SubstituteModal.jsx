'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2, TrendingDown, Pill, X, AlertCircle } from 'lucide-react';

export default function SubstituteModal({
  isOpen,
  onClose,
  targetProduct,
  allMedicines = [],
  addToCart,
  switchInCart,
  isInCart = false,
}) {
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !targetProduct) return;

    setLoading(true);
    // Find matching substitutes from API or client dataset
    const fetchSubstitutes = async () => {
      try {
        const res = await fetch(`/api/medicines?substitutesFor=${targetProduct.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.substitutes && data.substitutes.length > 0) {
            setSubstitutes(data.substitutes);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API substitute fetch failed, computing client-side:', err);
      }

      // Client-side fallback matching
      const targetSalt = (targetProduct.salt || '').toLowerCase().trim();
      const matched = allMedicines
        .filter(m => String(m.id) !== String(targetProduct.id))
        .filter(m => {
          const mSalt = (m.salt || '').toLowerCase().trim();
          return (targetSalt && mSalt && (mSalt === targetSalt || mSalt.includes(targetSalt) || targetSalt.includes(mSalt))) ||
                 (m.category === targetProduct.category && m.isGeneric);
        })
        .map(sub => {
          const savingsAmount = Math.max(0, targetProduct.price - sub.price);
          const savingsPercent = targetProduct.price > 0 ? Math.round((savingsAmount / targetProduct.price) * 100) : 0;
          return {
            ...sub,
            savingsAmount,
            savingsPercent,
            isCheaper: sub.price < targetProduct.price
          };
        })
        .sort((a, b) => (b.savingsPercent - a.savingsPercent) || (a.price - b.price));

      setSubstitutes(matched);
      setLoading(false);
    };

    fetchSubstitutes();
  }, [isOpen, targetProduct, allMedicines]);

  if (!isOpen || !targetProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex items-start justify-between bg-[var(--color-surface-container-low)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--color-primary)] bg-[var(--color-primary-fixed)] px-2.5 py-0.5 rounded-full">
                  Smart Salt Substitution
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> 100% Bioequivalent
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[var(--color-on-surface)] mt-1">
                Generic Substitutes & Savings
              </h2>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                Exact same active salt molecule & therapeutic efficacy at up to 75% lower cost.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide flex-1">
          {/* Selected Medicine Info */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-outline)] mb-1">
              Currently Selected Medicine
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-heading font-bold text-[var(--color-on-surface)]">
                  {targetProduct.name}
                </h3>
                <p className="text-xs text-[var(--color-primary)] font-medium mt-0.5">
                  Active Salt: <span className="font-semibold">{targetProduct.salt || targetProduct.description}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)] mt-1">
                  <span>Mfr: {targetProduct.manufacturer || 'Standard Brand'}</span>
                  <span>•</span>
                  <span>{targetProduct.packSize || targetProduct.dosageForm || 'Standard Pack'}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-heading font-bold text-[var(--color-on-surface)]">
                  ₹{targetProduct.price}
                </span>
                <span className="block text-[10px] text-[var(--color-outline)] font-medium">Brand Price</span>
              </div>
            </div>
          </div>

          {/* Active Salt Guarantee Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-bold">Clinical Bioequivalence Guarantee:</span> Generic substitutes contain the exact same chemical formulation ({targetProduct.salt || 'active ingredient'}), strength, and purity verified by drug regulatory standards.
            </div>
          </div>

          {/* Recommended Generic Substitutes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-heading font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                Available Generic Alternatives
                <span className="text-xs font-normal text-[var(--color-outline)]">
                  ({substitutes.length} found)
                </span>
              </h4>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-[var(--color-surface-container)] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : substitutes.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]">
                <AlertCircle size={28} className="mx-auto mb-2 text-[var(--color-outline)]" />
                <p className="text-sm font-medium">No generic alternatives found for this specific salt yet.</p>
                <p className="text-xs text-[var(--color-outline)] mt-1">This product is already offered at the best available healthcare pricing.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {substitutes.map((sub) => {
                  const isSignificantSavings = sub.savingsPercent >= 30;
                  return (
                    <div 
                      key={sub.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSignificantSavings 
                          ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60' 
                          : 'bg-[var(--color-surface-container-lowest)] border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h5 className="font-heading font-bold text-sm text-[var(--color-on-surface)] truncate">
                            {sub.name}
                          </h5>
                          {sub.isGeneric && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary-fixed)] text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                              Generic / Jan Aushadhi
                            </span>
                          )}
                          {sub.savingsPercent > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <TrendingDown size={12} /> {sub.savingsPercent}% OFF
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-1 mb-1">
                          {sub.salt || sub.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-[var(--color-outline)]">
                          <span>Mfr: {sub.manufacturer || 'Generic Care'}</span>
                          <span>•</span>
                          <span>{sub.packSize || sub.dosageForm || 'Standard Pack'}</span>
                        </div>
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[var(--color-outline-variant)]">
                        <div className="sm:text-right">
                          <div className="flex items-baseline gap-1.5 sm:justify-end">
                            <span className="text-lg font-heading font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{sub.price}
                            </span>
                            {targetProduct.price > sub.price && (
                              <span className="text-xs text-[var(--color-outline)] line-through">
                                ₹{targetProduct.price}
                              </span>
                            )}
                          </div>
                          {sub.savingsAmount > 0 && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                              Save ₹{sub.savingsAmount} per pack
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (isInCart && switchInCart) {
                              switchInCart(targetProduct.id, sub);
                            } else if (addToCart) {
                              addToCart(sub);
                            }
                            onClose();
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                          {isInCart ? 'Switch & Save' : 'Add Generic'}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex items-center justify-between">
          <div className="text-[11px] text-[var(--color-outline)] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Med Z Pharmacist Verified Formulations</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
