'use client';
import React from 'react';
import { CreditCard, Truck, ShoppingCart } from 'lucide-react';

export default function CheckoutView({
  cart, cartCount, cartTotal, checkoutStep, setCheckoutStep,
  addressForm, setAddressForm, handleAddressSubmit,
  paymentMethod, setPaymentMethod, handlePaymentSubmit,
  pincodeLoading, pincodeError, setCurrentView,
  savedAddresses, selectSavedAddress,
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('cart')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Cart
        </button>
        
        <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mb-8">Checkout</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {/* Step 1: Delivery Details */}
            <div className={`bg-[var(--color-surface-container-lowest)] border ${checkoutStep === 1 ? 'border-[var(--color-primary)] atmospheric-shadow' : 'border-[var(--color-outline-variant)] opacity-60 pointer-events-none'} rounded-xl p-6 lg:p-8 transition-all duration-300`}>
              <h3 className="text-lg font-heading font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${checkoutStep === 1 ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-outline)]'}`}>1</div>
                Delivery Details
              </h3>

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

              <form onSubmit={handleAddressSubmit} className="space-y-5">
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
                    <span className="text-[var(--color-on-surface-variant)] pr-2 leading-relaxed">
                      <span className="font-semibold text-[var(--color-on-surface)] bg-[var(--color-surface-container-high)] px-1.5 py-0.5 rounded text-xs mr-2">{item.quantity}x</span>
                      {item.name}
                    </span>
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
