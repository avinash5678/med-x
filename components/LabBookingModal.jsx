'use client';
import React, { useState } from 'react';
import { 
  Calendar, Clock, X, ShieldCheck, MapPin, User, 
  Phone, CheckCircle2, AlertCircle, Sparkles, TestTube2, Building2
} from 'lucide-react';

export default function LabBookingModal({
  isOpen,
  onClose,
  testPackage,
  onConfirmBooking,
  user,
  savedAddresses = [],
}) {
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '9876543210');
  
  // Date & Slot
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState('07:00 AM - 08:00 AM');

  // Address
  const defaultAddr = savedAddresses[0] || {};
  const [address, setAddress] = useState(defaultAddr.street ? `${defaultAddr.street}, ${defaultAddr.city || 'Mumbai'} - ${defaultAddr.pincode || '400051'}` : 'Flat 402, Sea Breeze Apts, BKC, Mumbai - 400051');

  if (!isOpen || !testPackage) return null;

  const morningSlots = [
    '06:30 AM - 07:30 AM',
    '07:30 AM - 08:30 AM',
    '08:30 AM - 09:30 AM',
    '09:30 AM - 10:30 AM',
  ];

  const afternoonSlots = [
    '02:00 PM - 03:00 PM',
    '05:00 PM - 06:00 PM',
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name');
      return;
    }

    const bookingId = `LAB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      id: bookingId,
      testId: testPackage.id,
      testName: testPackage.name,
      parametersCount: testPackage.parametersCount,
      price: testPackage.price,
      patientName: patientName.trim(),
      patientAge,
      patientGender,
      patientPhone,
      address,
      bookingDate,
      timeSlot: selectedSlot,
      fastingRequired: testPackage.fastingRequired,
      fastingHours: testPackage.fastingHours,
      sampleType: testPackage.sampleType,
      phlebotomist: {
        name: 'Suresh Patil (Cert. Phlebotomist)',
        rating: '4.9',
        badge: 'NABL Certified',
        phone: '+91 9820011223',
      },
      status: 'Confirmed', // 'Confirmed' | 'Sample Collected' | 'Report Ready'
      createdAt: new Date().toISOString(),
      reportUrl: '#',
      sampleBiomarkers: testPackage.sampleBiomarkers || [],
    };

    onConfirmBooking(newBooking);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-xl w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TestTube2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  Free Home Collection
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} /> NABL Accredited
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)] mt-0.5">
                Book Diagnostic Sample Collection
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--color-outline)] hover:text-[var(--color-on-surface)] rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Package Banner */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] mb-5 flex items-start justify-between gap-3">
          <div>
            <h4 className="font-heading font-bold text-sm text-[var(--color-on-surface)]">
              {testPackage.name}
            </h4>
            <p className="text-xs text-[var(--color-outline)] mt-0.5">
              Includes {testPackage.parametersCount} Parameters • Report in {testPackage.reportHours} hrs
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-heading font-extrabold text-base text-[var(--color-primary)]">
              ₹{testPackage.price}
            </span>
            {testPackage.originalPrice && (
              <span className="text-xs text-[var(--color-outline)] line-through block">
                ₹{testPackage.originalPrice}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                Age
              </label>
              <input
                type="number"
                required
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                Gender
              </label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
              />
            </div>
          </div>

          {/* Collection Address */}
          <div className="space-y-1">
            <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
              Home Sample Collection Address
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat No, Building, Area, City, Pincode"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-sm text-[var(--color-on-surface)] outline-none"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
              Select Sample Collection Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBookingDate(todayStr)}
                className={`py-2 rounded-xl border-2 font-heading font-bold text-xs transition-all cursor-pointer ${
                  bookingDate === todayStr
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                }`}
              >
                Today ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
              </button>
              <button
                type="button"
                onClick={() => setBookingDate(tomorrowStr)}
                className={`py-2 rounded-xl border-2 font-heading font-bold text-xs transition-all cursor-pointer ${
                  bookingDate === tomorrowStr
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                }`}
              >
                Tomorrow ({tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
              </button>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-1.5">
            <label className="font-heading font-bold text-[11px] uppercase tracking-wider text-[var(--color-outline)] flex items-center justify-between">
              <span>Time Slot {testPackage.fastingRequired ? '(Morning Fasting Recommended)' : ''}</span>
              <Clock size={12} />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {morningSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-2 rounded-xl border text-center font-heading text-xs font-semibold transition-all cursor-pointer ${
                    selectedSlot === slot
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] shadow-sm'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Fasting Preparation Guidance */}
          {testPackage.fastingRequired ? (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Fasting Advisory ({testPackage.fastingHours || 10} hours): </strong>
                Please do not consume food, milk, tea, or sugary drinks for 10-12 hours prior to collection. Plain water is permitted.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>No Fasting Required:</strong> You can give samples at any convenient time.</span>
            </div>
          )}

          {/* Confirm Button */}
          <div className="pt-3 border-t border-[var(--color-outline-variant)]">
            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Confirm Appointment (Pay ₹{testPackage.price} upon sample collection)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
