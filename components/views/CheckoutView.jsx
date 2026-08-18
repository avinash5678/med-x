'use client';
import React, { useState } from 'react';
import { 
  CreditCard, Truck, ShoppingCart, FileText, UploadCloud, 
  CheckCircle2, AlertCircle, ShieldCheck, PhoneCall, Trash2, Edit3 
} from 'lucide-react';

export default function CheckoutView({
  cart, cartCount, cartTotal, checkoutStep, setCheckoutStep,
  addressForm, setAddressForm, handleAddressSubmit,
  paymentMethod, setPaymentMethod, handlePaymentSubmit,
  pincodeLoading, pincodeError, setCurrentView,
  savedAddresses, selectSavedAddress,
  prescription, onOpenPrescriptionModal, onRemovePrescription,
  selectedPickupStore,
}) {
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'pickup'
  const [rxError, setRxError] = useState('');
  const hasRxItems = cart.some(item => item.requiresPrescription);
  const rxItemNames = cart.filter(item => item.requiresPrescription).map(i => i.name).join(', ');

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (hasRxItems && !prescription) {
      setRxError('Please attach a doctor’s prescription or request a free doctor call before proceeding.');
      return;
    }
    setRxError('');
    handleAddressSubmit(e);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('cart')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Cart
        </button>
        
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Checkout</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Step 1: Delivery / Pickup Details */}
            <div className={`bg-[var(--color-surface-container-lowest)] border ${checkoutStep === 1 ? 'border-[var(--color-primary)] atmospheric-shadow' : 'border-[var(--color-outline-variant)] opacity-60 pointer-events-none'} rounded-xl p-6 lg:p-8 transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${checkoutStep === 1 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'}`}>1</div>
                  Fulfillment & Address Details
                </h3>

                {/* Delivery vs Pickup Switcher */}
                <div className="flex bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)] w-fit">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      fulfillmentType === 'delivery'
                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    🚚 Doorstep Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      fulfillmentType === 'pickup'
                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                        : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    🏬 30-Min Store Pickup
                  </button>
                </div>
              </div>

              {fulfillmentType === 'pickup' && (
                <div className="mb-6 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">Selected Pickup Pharmacy:</span>
                    <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)] mt-0.5">
                      {selectedPickupStore ? selectedPickupStore.name : 'Med Z 24/7 Super Pharmacy - BKC'}
                    </h4>
                    <p className="text-[11px] text-[var(--color-outline)] mt-0.5">
                      {selectedPickupStore ? selectedPickupStore.address : 'Ground Floor, G-Block, BKC, Mumbai 400051 (Open 24/7)'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('pharmacies')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Change Store on Map
                  </button>
                </div>
              )}

              {savedAddresses && savedAddresses.length > 0 && checkoutStep === 1 && (
                <div className="mb-6">
                  <p className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider mb-3">Saved Addresses</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedAddresses.map((addr, idx) => (
                      <button key={idx} onClick={() => selectSavedAddress(addr)}
                        className="text-left p-4 border border-[var(--color-outline-variant)] rounded-xl hover:border-[var(--color-primary)] transition-colors cursor-pointer bg-[var(--color-surface-container-low)]">
                        <p className="font-heading font-semibold text-sm text-[var(--color-on-surface)]">{addr.name}</p>
                        <p className="text-xs text-[var(--color-outline)] mt-1">{addr.street}, {addr.city} - {addr.pincode}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleProceedToPayment} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Full Name</label>
                    <input type="text" required value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Phone Number</label>
                    <input type="tel" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]" placeholder="+91 9876543210" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">Street Address</label>
                  <textarea required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] resize-none" placeholder="Flat No, Building Name, Street..." rows="2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider">City</label>
                    <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] text-sm bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]" placeholder="Mumbai" readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-heading font-bold text-[var(--color-outline)] uppercase tracking-wider flex justify-between">
                      <span>Pincode</span>
                      {pincodeLoading && <span className="text-[var(--color-primary)] animate-pulse">Verifying...</span>}
                    </label>
                    <input type="text" maxLength={6} required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      className={`w-full px-4 py-3 rounded-xl border ${pincodeError ? 'border-[var(--color-error)]' : 'border-[var(--color-outline-variant)]'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]`} placeholder="400001" />
                    {pincodeError && <p className="text-xs text-[var(--color-error)] font-medium mt-1">{pincodeError}</p>}
                    {addressForm.state && !pincodeError && !pincodeLoading && (
                      <p className="text-xs text-[var(--color-secondary)] font-medium mt-1">✓ Verified: {addressForm.state}</p>
                    )}
                  </div>
                </div>

                {/* Prescription Verification Section */}
                {hasRxItems && (
                  <div className="pt-4 border-t border-[var(--color-outline-variant)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
                          Mandatory Rx Step
                        </span>
                        <span className="text-xs font-bold text-[var(--color-on-surface)]">
                          Doctor's Prescription Required
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--color-outline)]">
                        Items: {rxItemNames}
                      </span>
                    </div>

                    {rxError && (
                      <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2 border border-red-200 dark:border-red-900/50">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{rxError}</span>
                      </div>
                    )}

                    {prescription ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            {prescription.type === 'doctor_call' ? (
                              <PhoneCall size={20} />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-heading font-bold text-xs text-[var(--color-on-surface)] truncate">
                                {prescription.fileName || 'Prescription Attached'}
                              </p>
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                Attached
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--color-outline)] mt-0.5">
                              {prescription.type === 'doctor_call' 
                                ? 'Free Tele-Doctor consultation scheduled' 
                                : `Patient: ${prescription.patientName || 'Self'} • Dr. ${prescription.doctorName || 'Physician'}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={onOpenPrescriptionModal}
                            className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 size={13} /> Change
                          </button>
                          {onRemovePrescription && (
                            <button
                              type="button"
                              onClick={onRemovePrescription}
                              className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/20 rounded-lg transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <div className="text-xs text-blue-950 dark:text-blue-200">
                            <span className="font-bold">Prescription Required:</span> Your order contains regulated medicines. Please upload your doctor's slip or request a free consultation call.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onOpenPrescriptionModal}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-heading text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <UploadCloud size={14} />
                          <span>Attach Prescription</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] px-8 py-3.5 rounded-lg font-heading font-semibold text-sm transition-all atmospheric-shadow active:scale-95 cursor-pointer">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-[var(--color-surface-container-lowest)] border ${checkoutStep === 2 ? 'border-[var(--color-primary)] atmospheric-shadow' : 'border-[var(--color-outline-variant)] opacity-60 pointer-events-none'} rounded-xl p-6 lg:p-8 transition-all duration-300`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${checkoutStep === 2 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'}`}>2</div>
                  Payment Method
                </h3>
                {checkoutStep === 2 && (
                  <button onClick={() => setCheckoutStep(1)} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors cursor-pointer">Edit Details</button>
                )}
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${paymentMethod === 'razorpay' ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/20' : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/30'}`}
                    onClick={() => setPaymentMethod('razorpay')}>
                    <div className="flex justify-between items-center mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'razorpay' ? 'border-[var(--color-primary)]' : 'border-[var(--color-outline-variant)]'} flex items-center justify-center`}>
                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                      </div>
                      <CreditCard size={20} className={paymentMethod === 'razorpay' ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline)]'} />
                    </div>
                    <h4 className="font-heading font-semibold text-[var(--color-on-surface)] text-sm">Pay Online</h4>
                    <p className="text-xs text-[var(--color-outline)] mt-1">Cards, UPI, Netbanking</p>
                  </div>
                  <div className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/20' : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/30'}`}
                    onClick={() => setPaymentMethod('cod')}>
                    <div className="flex justify-between items-center mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'cod' ? 'border-[var(--color-primary)]' : 'border-[var(--color-outline-variant)]'} flex items-center justify-center`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                      </div>
                      <Truck size={20} className={paymentMethod === 'cod' ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline)]'} />
                    </div>
                    <h4 className="font-heading font-semibold text-[var(--color-on-surface)] text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-[var(--color-outline)] mt-1">Pay at your doorstep</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-[var(--color-outline-variant)] mt-6">
                  <button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] py-4 rounded-lg font-heading font-bold text-sm transition-all atmospheric-shadow active:scale-95 cursor-pointer">
                    {paymentMethod === 'razorpay' ? `Pay ₹${cartTotal} securely` : 'Confirm COD Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-6 sticky top-6 atmospheric-shadow">
              <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
                <ShoppingCart size={18} className="text-[var(--color-outline)]" /> Order Summary
              </h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm border-b border-[var(--color-outline-variant)]/50 pb-3">
                    <div className="text-[var(--color-on-surface-variant)] pr-2 leading-relaxed">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container-high)] px-1.5 py-0.5 rounded text-xs">{item.quantity}x</span>
                        <span className="font-medium text-[var(--color-on-surface)]">{item.name}</span>
                        {item.requiresPrescription && (
                          <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 rounded">Rx</span>
                        )}
                      </div>
                    </div>
                    <span className="font-medium text-[var(--color-on-surface)] whitespace-nowrap mt-0.5">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mb-2 text-sm bg-[var(--color-surface-container-low)] p-4 rounded-xl">
                <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                  <span>Items Total</span>
                  <span className="font-medium text-[var(--color-on-surface)]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                  <span>Delivery Fee</span>
                  <span className="text-[var(--color-secondary)] font-semibold">Free</span>
                </div>
                {hasRxItems && (
                  <div className="flex justify-between text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-2 rounded-lg border border-blue-200 dark:border-blue-900">
                    <span>Prescription Verification</span>
                    <span className="font-semibold">{prescription ? 'Attached (Free)' : 'Required'}</span>
                  </div>
                )}
                <div className="border-t border-[var(--color-outline-variant)] pt-4 mt-2 flex justify-between items-center">
                  <span className="text-sm font-heading font-bold text-[var(--color-on-surface)] uppercase tracking-wider">To Pay</span>
                  <span className="text-xl font-heading font-bold tracking-tight text-[var(--color-on-surface)]">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
