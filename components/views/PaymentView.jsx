'use client';
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Truck, ShieldAlert, Award, Lock, Sparkles, 
  ChevronRight, HelpCircle, QrCode, Smartphone, Building, Wallet, 
  CheckCircle2, ArrowRight, Clock, RefreshCw, AlertCircle, Eye, EyeOff
} from 'lucide-react';

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
  // Online sub-method tab: 'upi' | 'card' | 'netbanking' | 'wallet'
  const [onlineTab, setOnlineTab] = useState('upi');

  // UPI state
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerifiedSuccess, setUpiVerifiedSuccess] = useState(false);
  const [qrTimerSeconds, setQrTimerSeconds] = useState(599); // 10 minutes

  // Card state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('paytm');

  // Dynamic QR countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Card brand detection
  const getCardBrand = (num) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: 'text-blue-600' };
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return { name: 'Mastercard', color: 'text-orange-600' };
    if (/^(?:60|65|81|82)/.test(clean)) return { name: 'RuPay', color: 'text-emerald-600' };
    if (/^3[47]/.test(clean)) return { name: 'Amex', color: 'text-indigo-600' };
    return { name: 'Card', color: 'text-slate-400' };
  };

  // Card formatting utility
  const handleCardNumberChange = (e) => {
    let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    setCardNumber(parts.length ? parts.join(' ') : v);
  };

  // Expiry formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) {
      setExpiry(`${v.slice(0, 2)}/${v.slice(2)}`);
    } else {
      setExpiry(v);
    }
  };

  const handleSimulateUpiAppPay = (appName) => {
    setSelectedUpiApp(appName);
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setUpiVerifiedSuccess(true);
      setTimeout(() => {
        handlePaymentSubmit({ preventDefault: () => {} });
      }, 1000);
    }, 1800);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      if (onlineTab === 'card') {
        if (!cardName.trim()) {
          alert('Please enter the cardholder name');
          return;
        }
        if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
          alert('Please enter a valid 16-digit card number');
          return;
        }
        if (!expiry.trim() || !expiry.includes('/')) {
          alert('Please enter a valid expiry date (MM/YY)');
          return;
        }
        if (!cvv.trim() || cvv.length < 3) {
          alert('Please enter a valid 3-digit CVV');
          return;
        }
      } else if (onlineTab === 'upi') {
        if (!upiVerifiedSuccess && upiId.trim()) {
          setIsVerifyingUpi(true);
          setTimeout(() => {
            setIsVerifyingUpi(false);
            setUpiVerifiedSuccess(true);
            handlePaymentSubmit(e);
          }, 1500);
          return;
        }
      }
    }
    handlePaymentSubmit(e);
  };

  // Dynamic UPI QR code URL (using standard encoded UPI string)
  const upiString = `upi://pay?pa=medz.health@icici&pn=MedZ%20Healthcare&am=${cartTotal}&cu=INR&tn=Order%20Payment`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}&margin=6`;

  const topBanks = [
    { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
    { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
    { id: 'icici', name: 'ICICI Bank', icon: '🏢' },
    { id: 'axis', name: 'Axis Bank', icon: '🏛️' },
    { id: 'kotak', name: 'Kotak Mahindra', icon: '🏦' },
    { id: 'pnb', name: 'Punjab National', icon: '🏢' },
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-600', icon: 'GPay' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600', icon: 'PhonePe' },
    { id: 'paytm', name: 'Paytm UPI', color: 'bg-sky-500', icon: 'Paytm' },
    { id: 'cred', name: 'CRED UPI', color: 'bg-slate-900', icon: 'CRED' },
    { id: 'bhim', name: 'BHIM UPI', color: 'bg-emerald-600', icon: 'BHIM' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs & Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)] mb-4 text-xs font-semibold uppercase tracking-wider">
            <button onClick={() => setCurrentView('cart')} className="hover:text-[var(--color-primary)] transition-colors cursor-pointer">Cart</button>
            <ChevronRight size={12} className="text-[var(--color-outline-variant)]" />
            <button onClick={() => setCheckoutStep(1)} className="hover:text-[var(--color-primary)] transition-colors cursor-pointer">Shipping</button>
            <ChevronRight size={12} className="text-[var(--color-outline-variant)]" />
            <span className="text-[var(--color-primary)] font-bold">Payment</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading font-extrabold text-3xl text-[var(--color-on-surface)]">
                Payment Gateway
              </h1>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                Select your preferred payment channel. 100% Encrypted & PCI DSS Compliant.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold w-fit">
              <ShieldCheck size={16} />
              <span>Razorpay & NPCI Secured</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Method Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Payment Selector (Online vs COD) */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 border border-[var(--color-outline-variant)] atmospheric-shadow space-y-4">
              <h2 className="font-heading font-bold text-lg text-[var(--color-on-surface)] mb-4">
                Choose Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pay Online Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'razorpay'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/25 shadow-sm'
                      : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    paymentMethod === 'razorpay' ? 'border-[var(--color-primary)]' : 'border-[var(--color-outline)]'
                  }`}>
                    {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-sm text-[var(--color-on-surface)]">Pay Online</span>
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">Fastest</span>
                    </div>
                    <p className="text-xs text-[var(--color-outline)] mt-0.5">UPI, QR Code, Cards, Netbanking</p>
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    paymentMethod === 'cod'
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/25 shadow-sm'
                      : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-[var(--color-primary)]' : 'border-[var(--color-outline)]'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-[var(--color-on-surface)]">Cash on Delivery</span>
                    <p className="text-xs text-[var(--color-outline)] mt-0.5">Pay cash or UPI at your doorstep</p>
                  </div>
                </div>
              </div>

              {/* Online Payment Sub-Channel Selector */}
              {paymentMethod === 'razorpay' && (
                <div className="pt-5 border-t border-[var(--color-outline-variant)] mt-6 animate-fade-in">
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setOnlineTab('upi')}
                      className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        onlineTab === 'upi'
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                          : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]'
                      }`}
                    >
                      <Smartphone size={14} />
                      <span>UPI & QR Scan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnlineTab('card')}
                      className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        onlineTab === 'card'
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                          : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]'
                      }`}
                    >
                      <CreditCard size={14} />
                      <span>Credit / Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOnlineTab('netbanking')}
                      className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        onlineTab === 'netbanking'
                          ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                          : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]'
                      }`}
                    >
                      <Building size={14} />
                      <span>Netbanking</span>
                    </button>
                  </div>

                  {/* 1. UPI TAB CONTENT */}
                  {onlineTab === 'upi' && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Dynamic UPI QR Code Box */}
                      <div className="p-5 rounded-2xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="relative p-2 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                          <img 
                            src={qrCodeUrl} 
                            alt="Med Z UPI QR" 
                            className="w-36 h-36 object-contain rounded"
                          />
                          <div className="absolute inset-x-0 bottom-1 flex justify-center">
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                              BHIM UPI
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 flex-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800/60">
                            <Clock size={12} /> QR Valid for: <strong className="font-mono">{formatTimer(qrTimerSeconds)}</strong>
                          </div>
                          <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)]">
                            Scan with Any UPI App to Pay ₹{cartTotal}
                          </h4>
                          <p className="text-xs text-[var(--color-outline)] leading-relaxed">
                            Open Google Pay, PhonePe, Paytm, Cred, or BHIM and scan this dynamic QR to complete instant payment.
                          </p>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleSimulateUpiAppPay('Scan QR')}
                              disabled={isVerifyingUpi}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {isVerifyingUpi ? (
                                <>
                                  <RefreshCw size={13} className="animate-spin" /> Verifying with NPCI...
                                </>
                              ) : upiVerifiedSuccess ? (
                                <>
                                  <CheckCircle2 size={13} /> Payment Received!
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={13} /> I Have Paid via QR
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 1-Click UPI App Intents */}
                      <div>
                        <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)] mb-3 block">
                          Or Pay Directly with UPI Apps
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {upiApps.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => handleSimulateUpiAppPay(app.name)}
                              disabled={isVerifyingUpi}
                              className="p-3 rounded-xl border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container)] transition-all flex items-center justify-between text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg ${app.color} text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm`}>
                                  {app.icon.slice(0, 2)}
                                </div>
                                <span className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">
                                  {app.name}
                                </span>
                              </div>
                              <ArrowRight size={13} className="text-[var(--color-outline)] group-hover:text-[var(--color-primary)] transition-transform group-hover:translate-x-0.5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom UPI ID Entry */}
                      <div className="pt-2">
                        <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)] mb-2 block">
                          Enter UPI ID / VPA
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi or username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] focus:border-[var(--color-primary)] outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!upiId.includes('@')) {
                                alert('Please enter a valid UPI ID (e.g. name@upi)');
                                return;
                              }
                              handleSimulateUpiAppPay(upiId);
                            }}
                            className="px-5 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-xs shadow-sm hover:bg-[var(--color-primary-container)] transition-all cursor-pointer whitespace-nowrap"
                          >
                            Verify & Pay
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. CARD TAB CONTENT */}
                  {onlineTab === 'card' && (
                    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in">
                      <div className="space-y-1.5">
                        <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name as printed on card"
                          className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] focus:border-[var(--color-primary)] outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
                            Card Number
                          </label>
                          <span className={`text-xs font-bold ${getCardBrand(cardNumber).color}`}>
                            {getCardBrand(cardNumber).name}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] font-mono focus:border-[var(--color-primary)] outline-none transition-all"
                          />
                          <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] font-mono focus:border-[var(--color-primary)] outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)]">
                            CVV / CVC
                          </label>
                          <div className="relative">
                            <input
                              type={showCvv ? "text" : "password"}
                              required
                              maxLength={4}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="***"
                              className="w-full pl-4 pr-10 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] font-mono focus:border-[var(--color-primary)] outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCvv(!showCvv)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] p-1"
                              title={showCvv ? "Hide CVV" : "Show CVV"}
                            >
                              {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="save_card"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded text-[var(--color-primary)] border-[var(--color-outline-variant)]"
                        />
                        <label htmlFor="save_card" className="text-xs text-[var(--color-on-surface-variant)] cursor-pointer">
                          Securely save this card for future healthcare orders (PCI DSS Encrypted)
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full mt-4 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Lock size={15} />
                        <span>Pay ₹{cartTotal} Securely</span>
                      </button>
                    </form>
                  )}

                  {/* 3. NETBANKING TAB CONTENT */}
                  {onlineTab === 'netbanking' && (
                    <div className="space-y-5 animate-fade-in">
                      <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)] block">
                        Popular Indian Banks
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {topBanks.map((bank) => (
                          <div
                            key={bank.id}
                            onClick={() => setSelectedBank(bank.id)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                              selectedBank === bank.id
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)]/30 font-bold'
                                : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                            }`}
                          >
                            <span className="text-lg">{bank.icon}</span>
                            <span className="text-xs text-[var(--color-on-surface)] truncate">{bank.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-outline)] mb-2 block">
                          Or Select Other Bank
                        </label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
                          onChange={(e) => setSelectedBank(e.target.value)}
                        >
                          <option value="bob">Bank of Baroda</option>
                          <option value="canara">Canara Bank</option>
                          <option value="indusind">IndusInd Bank</option>
                          <option value="yes">YES Bank</option>
                          <option value="idbi">IDBI Bank</option>
                          <option value="union">Union Bank of India</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={onSubmit}
                        className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Building size={16} />
                        <span>Proceed with Netbanking (₹{cartTotal})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* COD Confirmation Button */}
              {paymentMethod === 'cod' && (
                <div className="pt-4 border-t border-[var(--color-outline-variant)] mt-4 animate-fade-in space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <Truck size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Cash on Delivery Selected</p>
                      <p className="mt-0.5 text-amber-800 dark:text-amber-300">You can pay with Cash or scan the delivery partner's UPI QR code upon arrival at your doorstep.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onSubmit}
                    className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirm Cash on Delivery Order (₹{cartTotal})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-xl text-center">
                <ShieldCheck size={22} className="text-emerald-600 mb-1.5" />
                <span className="font-heading font-bold text-[11px] text-[var(--color-on-surface)]">256-bit SSL</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-xl text-center">
                <QrCode size={22} className="text-blue-600 mb-1.5" />
                <span className="font-heading font-bold text-[11px] text-[var(--color-on-surface)]">NPCI Certified</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-xl text-center">
                <Award size={22} className="text-amber-600 mb-1.5" />
                <span className="font-heading font-bold text-[11px] text-[var(--color-on-surface)]">RBI Approved</span>
              </div>
              <div className="flex flex-col items-center p-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-xl text-center">
                <Truck size={22} className="text-teal-600 mb-1.5" />
                <span className="font-heading font-bold text-[11px] text-[var(--color-on-surface)]">Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 border border-[var(--color-outline-variant)] atmospheric-shadow space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]">
                <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)]">
                  Order Summary
                </h3>
                <span className="text-xs font-semibold text-[var(--color-outline)]">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-xs border-b border-[var(--color-outline-variant)]/40 pb-2.5">
                    <div className="pr-2 leading-relaxed">
                      <span className="font-bold text-[var(--color-on-surface)]">{item.quantity}x</span>{' '}
                      <span className="text-[var(--color-on-surface-variant)]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[var(--color-on-surface)] font-mono whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface-container-low)] space-y-2 text-xs">
                <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-[var(--color-on-surface-variant)]">
                  <span>GST & Pharmacy Handling</span>
                  <span className="font-mono font-medium">Included</span>
                </div>
                <div className="pt-2 border-t border-[var(--color-outline-variant)] flex justify-between items-center text-sm">
                  <span className="font-heading font-bold text-[var(--color-on-surface)] uppercase">Total Payable</span>
                  <span className="font-heading font-extrabold text-lg text-[var(--color-primary)] font-mono">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
