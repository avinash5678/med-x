'use client';
import React, { useState } from 'react';
import { 
  TestTube2, ShieldCheck, Clock, CheckCircle2, AlertCircle, 
  Search, Calendar, User, Phone, Download, ArrowRight, Sparkles, 
  FileText, Activity, Heart, Eye, Check
} from 'lucide-react';
import { LAB_CATEGORIES, LAB_TESTS_CATALOG } from '@/data/labTestsData';

export default function LabTestsView({
  setCurrentView,
  onOpenBookingModal,
  onOpenReportModal,
  userBookings = [],
}) {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my_bookings'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTests = LAB_TESTS_CATALOG.filter((test) => {
    const matchesCat = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.description.toLowerCase().includes(search.toLowerCase()) ||
      test.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 pb-28 md:pb-6 scrollbar-hide animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full">
                Diagnostics & Health Packages
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck size={12} /> NABL & ICMR Certified Labs
              </span>
            </div>
            <h1 className="font-heading font-semibold text-3xl text-[var(--color-on-surface)] mt-1.5">
              Diagnostic Lab Tests
            </h1>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
              Book certified home sample collections with 12-24 hour digital report delivery.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[var(--color-surface-container-low)] p-1 rounded-2xl border border-[var(--color-outline-variant)] w-fit shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              Explore Tests ({LAB_TESTS_CATALOG.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_bookings')}
              className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_bookings'
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <FileText size={14} />
              <span>My Bookings & Reports ({userBookings.length})</span>
            </button>
          </div>
        </div>

        {/* --- TAB 1: EXPLORE LAB TESTS --- */}
        {activeTab === 'explore' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search & Category Filter Bar */}
            <div className="space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)]" />
                <input
                  type="text"
                  placeholder="Search tests e.g. Full Body, CBC, Diabetes, Thyroid, Lipid Profile, Vitamin D..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] outline-none shadow-sm transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {LAB_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] font-bold border border-[var(--color-primary)] shadow-sm'
                        : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-6 atmospheric-shadow hover:border-[var(--color-primary)]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded">
                        {test.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {test.parametersCount} Parameters
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-1.5">
                      {test.name}
                    </h3>

                    <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed mb-4 line-clamp-2">
                      {test.description}
                    </p>

                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--color-outline)] mb-4 bg-[var(--color-surface-container-low)] p-2.5 rounded-xl">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-teal-600 dark:text-teal-400" />
                        <span>Report in {test.reportHours} hrs</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-teal-600 dark:text-teal-400" />
                        <span>{test.fastingRequired ? `${test.fastingHours}h Fasting` : 'No Fasting'}</span>
                      </div>
                    </div>

                    {/* Tests Included Preview */}
                    <div className="space-y-1 mb-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)]">Includes:</p>
                      {test.testsIncluded.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface)]">
                          <Check size={12} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                      {test.testsIncluded.length > 3 && (
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold pl-4">
                          +{test.testsIncluded.length - 3} more parameters
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-outline-variant)] flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading font-extrabold text-xl text-[var(--color-on-surface)]">
                          ₹{test.price}
                        </span>
                        {test.originalPrice && (
                          <span className="text-xs text-[var(--color-outline)] line-through">
                            ₹{test.originalPrice}
                          </span>
                        )}
                      </div>
                      {test.discountPercent && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {test.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenBookingModal(test)}
                      className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar size={14} />
                      <span>Book Collection</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: MY BOOKINGS & DIGITAL REPORTS --- */}
        {activeTab === 'my_bookings' && (
          <div className="space-y-6 animate-fade-in">
            {userBookings.length === 0 ? (
              <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-16 text-center flex flex-col items-center justify-center atmospheric-shadow">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                  <TestTube2 size={32} />
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--color-on-surface)] mb-1">
                  No diagnostic bookings yet
                </h3>
                <p className="text-xs text-[var(--color-on-surface-variant)] max-w-sm mb-6">
                  Book a home sample collection to track your health biomarkers, diabetes, and organ function reports here.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl font-heading font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Explore Diagnostic Packages
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-2xl p-6 atmospheric-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                            {booking.id}
                          </span>
                          <h4 className="font-heading font-bold text-base text-[var(--color-on-surface)] mt-1">
                            {booking.testName}
                          </h4>
                          <p className="text-xs text-[var(--color-outline)] mt-0.5">
                            {booking.parametersCount} Parameters • ₹{booking.price}
                          </p>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--color-surface-container-low)] space-y-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Patient:</span>
                          <span className="font-semibold text-[var(--color-on-surface)]">{booking.patientName} ({booking.patientAge}Y / {booking.patientGender})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Collection Slot:</span>
                          <span className="font-semibold text-[var(--color-on-surface)]">{booking.bookingDate} • {booking.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--color-outline)]">Address:</span>
                          <span className="font-semibold text-[var(--color-on-surface)] truncate max-w-[200px]">{booking.address}</span>
                        </div>
                      </div>

                      {/* Phlebotomist Card */}
                      {booking.phlebotomist && (
                        <div className="p-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] text-xs flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                              <User size={15} />
                            </div>
                            <div>
                              <p className="font-bold text-[var(--color-on-surface)]">{booking.phlebotomist.name}</p>
                              <p className="text-[10px] text-[var(--color-outline)]">NABL Certified • ⭐ {booking.phlebotomist.rating}</p>
                            </div>
                          </div>
                          <a 
                            href={`tel:${booking.phlebotomist.phone}`}
                            className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors"
                            title="Call Phlebotomist"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--color-outline-variant)] flex items-center justify-between gap-3">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Sample Collected & Processed
                      </span>

                      <button
                        type="button"
                        onClick={() => onOpenReportModal(booking)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-heading font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>View Lab Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
