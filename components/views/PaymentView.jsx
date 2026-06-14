'use client';
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Truck, ShieldAlert, Award, Lock, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

export default function PaymentView({
  cart,
  cartCount,
  cartTotal,
  setCheckoutStep,
  paymentMethod,
  setPaymentMethod,
  handlePaymentSubmit,
  setCurrentView,
  isProcessingPayment,
}) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // Card formatting utility
  const handleCardNumberChange = (e) => {
    let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1280px] mx-auto animate-fade-in">
        {/* Breadcrumbs & Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)] mb-4 text-xs font-semibold uppercase tracking-wider">
            <button onClick={() => setCurrentView('cart')} className="hover:text-[var(--color-primary)] transition-colors">Cart</button>
            <ChevronRight size={12} className="text-[var(--color-outline-variant)]" />
            <button onClick={() => setCheckoutStep(1)} className="hover:text-[var(--color-primary)] transition-colors">Shipping</button>
            <ChevronRight size={12} className="text-[var(--color-outline-variant)]" />
            <span className="text-[var(--color-primary)] font-bold">Payment</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-[var(--color-on-surface)]">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Method Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[var(--color-surface-container-lowest)] rounded-[24px] p-6 lg:p-8 border border-[var(--color-outline-variant)]/30 primary-glow-shadow">
              <h2 className="font-heading font-bold text-xl text-[var(--color-on-surface)] mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Pay Online Option */}
                <label className="block cursor-pointer group">
                  <input
                    className="hidden peer"
                    name="payment_method"
                    type="radio"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--color-outline-variant)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 group-hover:border-[var(--color-primary)] transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-2 border-[var(--color-outline-variant)] flex items-center justify-center peer-checked:border-[var(--color-primary)]">
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-scale-in" />
                        )}
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-sm text-[var(--color-on-surface)] block">Pay Online</span>
                        <span className="text-xs text-[var(--color-on-surface-variant)]">Credit/Debit, UPI, Netbanking</span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-[var(--color-primary)]">
                      <span className="material-symbols-outlined">credit_card</span>
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label className="block cursor-pointer group">
                  <input
                    className="hidden peer"
                    name="payment_method"
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--color-outline-variant)] peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 group-hover:border-[var(--color-primary)] transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border-2 border-[var(--color-outline-variant)] flex items-center justify-center peer-checked:border-[var(--color-primary)]">
                        {paymentMethod === 'cod' && (
                          <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-scale-in" />
                        )}
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-sm text-[var(--color-on-surface)] block">Cash on Delivery</span>
                        <span className="text-xs text-[var(--color-on-surface-variant)]">Pay when your medicine arrives</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[var(--color-primary)]">payments</span>
                  </div>
                </label>
              </div>

              {/* Online Payment Fields (Card fields) */}
              <div 
                className={`mt-6 pt-6 border-t border-[var(--color-outline-variant)]/30 transition-all duration-500 overflow-hidden ${
                  paymentMethod === 'razorpay' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="font-heading font-semibold text-xs text-[var(--color-on-surface-variant)] mb-2 block uppercase tracking-wider">Cardholder Name</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm"
                      placeholder="Full Name as on card"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required={paymentMethod === 'razorpay'}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-heading font-semibold text-xs text-[var(--color-on-surface-variant)] mb-2 block uppercase tracking-wider">Card Number</label>
                    <div className="relative">
                      <input
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required={paymentMethod === 'razorpay'}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">credit_card</span>
                    </div>
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-xs text-[var(--color-on-surface-variant)] mb-2 block uppercase tracking-wider">Expiry Date</label>
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm"
                      placeholder="MM/YY"
                      type="text"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required={paymentMethod === 'razorpay'}
                    />
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-xs text-[var(--color-on-surface-variant)] mb-2 block uppercase tracking-wider">CVV</label>
                    <div className="relative">
                      <input
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm"
                        placeholder="***"
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required={paymentMethod === 'razorpay'}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">lock</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2.5">
                  <input
                    className="mt-1 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-outline-variant)] cursor-pointer"
                    id="save_card"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <label className="text-xs text-[var(--color-on-surface-variant)] leading-tight cursor-pointer" htmlFor="save_card">
                    Securely save this card for future healthcare purchases. We follow PCI DSS compliance standards.
                  </label>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-2xl primary-glow-shadow text-center">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl mb-2">verified_user</span>
                <span className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">SSL Secured</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-2xl primary-glow-shadow text-center">
                <span className="material-symbols-outlined text-[var(--color-secondary)] text-3xl mb-2">prescriptions</span>
                <span className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Verified Partner</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-2xl primary-glow-shadow text-center">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] text-3xl mb-2">local_shipping</span>
                <span className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Safe Delivery</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-2xl primary-glow-shadow text-center">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl mb-2">health_and_safety</span>
                <span className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">256-bit Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[var(--color-surface-container-high)] rounded-[24px] p-6 lg:p-8 border border-[var(--color-outline-variant)]/30 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-[var(--color-on-surface)] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-[var(--color-outline-variant)]/20 pb-4 last:border-b-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl bg-white p-2 flex-shrink-0 border border-[var(--color-outline-variant)]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">pill</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-heading font-semibold text-sm text-[var(--color-on-surface)] truncate pr-2">{item.name}</span>
                        <span className="font-heading font-bold text-sm text-[var(--color-on-surface)] whitespace-nowrap">₹{item.price * item.quantity}</span>
                      </div>
                      <span className="text-xs text-[var(--color-on-surface-variant)] block mt-0.5">{item.category}</span>
                      <span className="text-xs text-[var(--color-on-surface-variant)] block font-semibold">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-outline-variant)]/30 mb-6">
                <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-on-surface)]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-teal-600">Free</span>
                </div>
                {paymentMethod === 'razorpay' && (
                  <div className="flex justify-between text-sm text-[var(--color-on-surface-variant)]">
                    <span className="text-teal-600 font-bold flex items-center gap-1">
                      <Sparkles size={14} /> Online Discount
                    </span>
                    <span className="font-bold text-teal-600">- ₹10</span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-[var(--color-outline-variant)] mt-4">
                  <span className="font-heading font-bold text-base text-[var(--color-on-surface)]">Total Amount</span>
                  <span className="font-heading font-extrabold text-2xl text-[var(--color-primary)]">
                    ₹{paymentMethod === 'razorpay' ? Math.max(0, cartTotal - 10) : cartTotal}
                  </span>
                </div>
              </div>

              {/* Payment Action Button */}
              <button
                onClick={handlePaymentSubmit}
                disabled={isProcessingPayment}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] py-4 rounded-xl font-heading font-bold text-base hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Lock size={16} />
                {isProcessingPayment ? 'Processing...' : `Pay ₹${paymentMethod === 'razorpay' ? Math.max(0, cartTotal - 10) : cartTotal}`}
              </button>

              <p className="mt-4 text-center text-xs text-[var(--color-on-surface-variant)] leading-normal">
                Transaction is processed over a secure 256-bit encrypted connection. Your data privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
