'use client';
import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from 'lucide-react';

export default function CartView({
  cart, cartCount, cartTotal, updateQuantity, removeItem,
  proceedToCheckout, handleCheckInteractions, setCurrentView,
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 scrollbar-hide">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('medicines')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Medicines
        </button>
        
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Your Cart</h2>
        
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
                  const Icon = item.icon;
                  return (
                    <div key={item.id}
                      className="flex flex-col sm:flex-row gap-5 p-5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl atmospheric-shadow items-start sm:items-center group hover:border-[var(--color-primary)]/30 transition-colors">
                      <div className="w-16 h-16 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary-fixed)] transition-colors">
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h4 className="font-heading font-bold text-base text-[var(--color-on-surface)] truncate">{item.name}</h4>
                        <p className="text-[var(--color-outline)] text-xs mt-0.5 mb-1.5 uppercase tracking-wider font-medium">{item.category}</p>
                        <p className="text-[var(--color-primary)] font-heading font-bold text-lg">₹{item.price}</p>
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
                  <div className="border-t border-[var(--color-outline-variant)] pt-5 mt-5 flex justify-between items-center">
                    <span className="text-base font-heading font-bold text-[var(--color-on-surface)]">Total</span>
                    <span className="text-2xl font-heading font-bold tracking-tight text-[var(--color-on-surface)]">₹{cartTotal}</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {cart.length > 1 && (
                    <button onClick={handleCheckInteractions}
                      className="w-full bg-[var(--color-primary-fixed)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary-fixed-dim)]/30 text-[var(--color-primary)] py-3 rounded-lg font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Sparkles size={16} /> AI Interaction Check
                    </button>
                  )}
                  <button onClick={proceedToCheckout}
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
