'use client';
import React, { useMemo } from 'react';
import { 
  Minus, Plus, Trash2, ShoppingCart, Sparkles, TrendingDown, 
  ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, ShieldAlert, 
  AlertTriangle, HeartPulse, Pill 
} from 'lucide-react';
import { analyzeCartSafety } from '@/utils/drugSafetyEngine';

export default function CartView({
  cart, cartCount, cartTotal, updateQuantity, removeItem,
  proceedToCheckout, handleCheckInteractions, setCurrentView,
  allMedicines = [], switchInCart, onOpenSubstitutes,
  onScheduleRefill, onOpenInteractionModal,
}) {
  // Proactive real-time drug safety analysis
  const safetyAnalysis = useMemo(() => {
    return analyzeCartSafety(cart);
  }, [cart]);

  // Compute smart generic savings opportunities for cart items
  const savingsOpportunities = useMemo(() => {
    if (!cart || cart.length === 0 || !allMedicines || allMedicines.length === 0) {
      return [];
    }

    const opps = [];
    cart.forEach(item => {
      if (item.isGeneric) return;

      const itemSalt = (item.salt || '').toLowerCase().trim();
      const candidates = allMedicines
        .filter(m => String(m.id) !== String(item.id))
        .filter(m => {
          const mSalt = (m.salt || '').toLowerCase().trim();
          return (itemSalt && mSalt && (mSalt === itemSalt || mSalt.includes(itemSalt) || itemSalt.includes(mSalt))) ||
                 (m.category === item.category && m.isGeneric);
        })
        .filter(m => m.price < item.price)
        .sort((a, b) => a.price - b.price);

      if (candidates.length > 0) {
        const bestGeneric = candidates[0];
        const unitSavings = item.price - bestGeneric.price;
        const totalLineSavings = unitSavings * (item.quantity || 1);
        opps.push({
          cartItem: item,
          genericSubstitute: bestGeneric,
          unitSavings,
          totalLineSavings,
          savingsPercent: Math.round((unitSavings / item.price) * 100),
        });
      }
    });

    return opps;
  }, [cart, allMedicines]);

  const totalPotentialSavings = useMemo(() => {
    return savingsOpportunities.reduce((sum, opp) => sum + opp.totalLineSavings, 0);
  }, [savingsOpportunities]);

  const handleSwitchAllToGeneric = () => {
    if (!switchInCart) return;
    savingsOpportunities.forEach(opp => {
      switchInCart(opp.cartItem.id, opp.genericSubstitute);
    });
  };

  const handleCheckoutClick = () => {
    if (safetyAnalysis.hasIssues && safetyAnalysis.severity === 'high' && onOpenInteractionModal) {
      onOpenInteractionModal();
      return;
    }
    proceedToCheckout();
  };

  const primaryAlert = safetyAnalysis.alerts?.[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 scrollbar-hide animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('medicines')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Medicines
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)]">Your Cart</h1>
          {cartCount > 0 && (
            <span className="text-xs font-semibold px-3 py-1 bg-[var(--color-primary-fixed)] text-[var(--color-primary)] rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Proactive Clinical Drug-to-Drug Interaction & Overdose Warning Banner */}
        {cart.length > 1 && (
          <div className="mb-6">
            {safetyAnalysis.hasIssues ? (
              <div className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                safetyAnalysis.severity === 'high'
                  ? 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-900/70 text-red-950 dark:text-red-200'
                  : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/70 text-amber-950 dark:text-amber-200'
              }`}>
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    safetyAnalysis.severity === 'high'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-amber-600 text-white shadow-sm'
                  }`}>
                    {safetyAnalysis.severity === 'high' ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm">
                        {primaryAlert?.title || 'Clinical Drug Interaction Detected'}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        safetyAnalysis.severity === 'high'
                          ? 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200'
                          : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {safetyAnalysis.severity === 'high' ? 'High Risk' : 'Caution'}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed opacity-90 max-w-2xl">
                      {primaryAlert?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                  {onOpenInteractionModal && (
                    <button
                      type="button"
                      onClick={onOpenInteractionModal}
                      className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold font-heading hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                    >
                      Audit Details
                    </button>
                  )}
                  {primaryAlert?.suggestedRemovalId && (
                    <button
                      type="button"
                      onClick={() => removeItem(primaryAlert.suggestedRemovalId)}
                      className="flex-1 md:flex-initial px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-heading rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      {primaryAlert.actionLabel || 'Resolve Conflict'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong className="font-bold">Drug Safety Verified:</strong> Zero adverse drug-drug interactions or duplicate salt overdoses detected across your {cart.length} items.
                  </span>
                </div>
                {onOpenInteractionModal && (
                  <button
                    type="button"
                    onClick={onOpenInteractionModal}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                  >
                    View Audit
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Smart Generic Savings Banner */}
        {savingsOpportunities.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-5 atmospheric-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      Smart Savings Opportunity
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Jan Aushadhi Generics
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)] mt-0.5">
                    Save up to ₹{totalPotentialSavings} by switching to bioequivalent generics
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSwitchAllToGeneric}
                className="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Switch All to Generic (Save ₹{totalPotentialSavings})</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Auto-Refill Callout Banner */}
        {cart.length > 0 && onScheduleRefill && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw size={16} />
              </div>
              <div>
                <p className="font-bold text-teal-950 dark:text-teal-200">
                  Need these medicines monthly? Set up Auto-Refill
                </p>
                <p className="text-[11px] text-teal-800 dark:text-teal-400">
                  Never run out of chronic prescriptions. Free automated delivery with 5% extra discount.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onScheduleRefill(cart[0])}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
            >
              Schedule Refill
            </button>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {cart.length === 0 ? (
              <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-16 flex flex-col items-center justify-center text-center atmospheric-shadow">
                <div className="w-20 h-20 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center mb-5">
                  <ShoppingCart size={32} className="text-[var(--color-outline-variant)]" />
                </div>
                <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-2">Your cart is empty</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm mb-8 font-body">Looks like you haven&apos;t added any medicines yet.</p>
                <button onClick={() => setCurrentView('medicines')}
                  className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-3 rounded-lg font-heading font-semibold text-sm transition-all atmospheric-shadow active:scale-95 cursor-pointer">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const Icon = typeof item.icon === 'function' || typeof item.icon === 'object' ? item.icon : Pill;
                  const itemOpportunity = savingsOpportunities.find(opp => opp.cartItem.id === item.id);
                  const isConflictItem = safetyAnalysis.alerts?.some(a => a.medicinesInvolved?.includes(item.name));

                  return (
                    <div key={item.id}
                      className={`p-5 bg-[var(--color-surface-container-lowest)] border rounded-xl atmospheric-shadow transition-all group ${
                        isConflictItem && safetyAnalysis.severity === 'high'
                          ? 'border-red-300 dark:border-red-900/60 ring-1 ring-red-500/20'
                          : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/30'
                      }`}>
                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <div className="w-16 h-16 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary-fixed)] transition-colors overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Icon size={24} strokeWidth={2} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-base text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                              {item.name}
                            </h3>
                            {item.requiresPrescription && (
                              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                                Rx Required
                              </span>
                            )}
                            {item.isGeneric ? (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2 py-0.5 rounded">
                                Generic / Jan Aushadhi
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-outline)] bg-[var(--color-surface-container-highest)] px-2 py-0.5 rounded">
                                Branded
                              </span>
                            )}
                            {isConflictItem && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertTriangle size={10} /> Overdose Risk
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[var(--color-primary)] font-medium line-clamp-1 mb-0.5">
                            <span className="text-[var(--color-outline)] font-normal">Salt: </span>
                            {item.salt || item.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-[var(--color-outline)]">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>Mfr: {item.manufacturer || 'Standard'}</span>
                          </div>

                          <p className="text-[var(--color-primary)] font-heading font-bold text-lg mt-2">
                            ₹{item.price}
                            <span className="text-xs font-normal text-[var(--color-outline)] ml-1">/ unit</span>
                          </p>
                        </div>

                        <div className="flex sm:flex-col flex-row items-center sm:items-end gap-4 justify-between w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-0 border-[var(--color-outline-variant)] pt-4 sm:pt-0">
                          <div className="flex items-center gap-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-[var(--color-surface-container)] rounded text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer">
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-[var(--color-on-surface)]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-[var(--color-surface-container)] rounded text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer">
                              <Plus size={16} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)}
                            className="text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer">
                            <Trash2 size={14} /> <span className="sm:hidden">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Line Item Generic Recommendation Pill */}
                      {itemOpportunity && (
                        <div className="mt-4 pt-3 border-t border-[var(--color-outline-variant)]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-5 -mb-5 p-3.5 rounded-b-xl">
                          <div className="flex items-center gap-2 text-xs">
                            <TrendingDown size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-[var(--color-on-surface)]">
                              Switch to <span className="font-bold text-emerald-700 dark:text-emerald-300">{itemOpportunity.genericSubstitute.name}</span> (₹{itemOpportunity.genericSubstitute.price}) & save <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{itemOpportunity.totalLineSavings}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {onOpenSubstitutes && (
                              <button
                                type="button"
                                onClick={() => onOpenSubstitutes(item)}
                                className="text-xs text-[var(--color-primary)] hover:underline font-semibold px-2 py-1 cursor-pointer"
                              >
                                View Details
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (switchInCart) {
                                  switchInCart(item.id, itemOpportunity.genericSubstitute);
                                }
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm flex items-center gap-1 cursor-pointer ml-auto sm:ml-0"
                            >
                              <span>Switch & Save</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-6 sticky top-6 atmospheric-shadow">
                <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6 text-sm font-body">
                  <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-medium text-[var(--color-on-surface)]">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                    <span>Delivery Fee</span>
                    <span className="text-[var(--color-secondary)] font-semibold">Free</span>
                  </div>
                  {totalPotentialSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <span>Potential Generic Savings</span>
                      <span>₹{totalPotentialSavings}</span>
                    </div>
                  )}
                  <div className="border-t border-[var(--color-outline-variant)] pt-5 mt-5 flex justify-between items-center">
                    <span className="text-base font-heading font-bold text-[var(--color-on-surface)]">Total</span>
                    <span className="text-2xl font-heading font-bold tracking-tight text-[var(--color-on-surface)]">₹{cartTotal}</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {cart.length > 1 && (
                    <button 
                      onClick={onOpenInteractionModal || handleCheckInteractions}
                      className={`w-full py-3 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        safetyAnalysis.hasIssues
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                      }`}
                    >
                      {safetyAnalysis.hasIssues ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
                      <span>
                        {safetyAnalysis.hasIssues ? 'Review Interaction Warnings' : 'Drug Interactions Screened (0)'}
                      </span>
                    </button>
                  )}
                  <button onClick={handleCheckoutClick}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] py-3.5 rounded-lg font-heading font-bold text-sm transition-all atmospheric-shadow active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                    Proceed to Checkout
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[var(--color-outline)] font-medium uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">verified_user</span> Safe & Secure Payments
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
