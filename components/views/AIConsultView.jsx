'use client';
import React, { useRef, useEffect } from 'react';
import { Send, ChevronRight, X, AlertTriangle } from 'lucide-react';

export default function AIConsultView({
  doctorMessages,
  doctorInput,
  setDoctorInput,
  handleDoctorMessage,
  isDoctorTyping,
  setCurrentView,
  addToCart,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [doctorMessages, isDoctorTyping]);

  // Handle recommended items addition
  const handleAddRecommended = (name, price, category) => {
    addToCart({
      id: Math.floor(Math.random() * 10000) + 5000,
      name,
      price,
      category,
      description: `Recommended by AI Doctor: ${name}.`,
      icon: () => <span className="material-symbols-outlined">pill</span>,
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[var(--color-background)] animate-fade-in">
      {/* Sidebar: Navigation & History (Desktop Only) */}
      <aside className="hidden lg:flex w-80 bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline-variant)]/40 flex-col shrink-0">
        <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto scrollbar-hide">
          {/* Consultation History Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider">Consultation History</h3>
              <span className="material-symbols-outlined text-[var(--color-outline)] text-lg">history</span>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3.5 rounded-xl bg-[var(--color-surface-container-highest)]/50 border border-transparent hover:border-[var(--color-primary)]/20 hover:bg-white transition-all cursor-pointer">
                <p className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Seasonal Allergy Advice</p>
                <p className="text-[10px] text-[var(--color-outline)] mt-1">Yesterday, 4:30 PM</p>
              </button>
              <button className="w-full text-left p-3.5 rounded-xl hover:bg-white/50 border border-transparent transition-all cursor-pointer">
                <p className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Vitamin D Deficiency</p>
                <p className="text-[10px] text-[var(--color-outline)] mt-1">Oct 12, 2023</p>
              </button>
              <button className="w-full text-left p-3.5 rounded-xl hover:bg-white/50 border border-transparent transition-all cursor-pointer">
                <p className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Post-Surgery Care</p>
                <p className="text-[10px] text-[var(--color-outline)] mt-1">Sep 28, 2023</p>
              </button>
            </div>
          </section>

          {/* Saved Recommendations Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider">Saved Recommendations</h3>
              <span className="material-symbols-outlined text-[var(--color-outline)] text-lg">bookmark</span>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[var(--color-secondary-container)]/10 border border-[var(--color-secondary)]/20">
                <div className="flex items-start gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[var(--color-secondary)] text-sm">verified</span>
                  <p className="font-heading font-bold text-xs text-[var(--color-secondary)]">Hydration Protocol</p>
                </div>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed">Recommended 3L daily intake with electrolytes during flu.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--color-primary-fixed)]/20 border border-[var(--color-primary)]/10">
                <div className="flex items-start gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">pill</span>
                  <p className="font-heading font-bold text-xs text-[var(--color-primary)]">Omega-3 Schedule</p>
                </div>
                <p className="text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed">Take 1000mg capsule after morning meal for absorption.</p>
              </div>
            </div>
          </section>

          <div className="mt-auto p-4 bg-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/10">
            <p className="text-xs font-heading font-bold text-[var(--color-primary)] mb-1">Premium Support</p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mb-3 leading-normal">Get priority access to human doctors 24/7.</p>
            <button className="w-full py-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)] rounded-lg font-heading font-semibold text-xs transition-colors cursor-pointer active:scale-[0.98]">
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col relative bg-[var(--color-background)] overflow-hidden h-full">
        {/* Disclaimer Banner */}
        <div className="sticky top-0 z-40 px-6 py-3 bg-[var(--color-error-container)]/40 backdrop-blur-sm border-b border-[var(--color-error)]/10 flex items-start gap-3">
          <AlertTriangle className="text-[var(--color-error)] shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-[var(--color-on-error-container)] leading-normal">
            <strong>Medical Disclaimer:</strong> Med Z AI provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician for medical concerns. In an emergency, call your local emergency services immediately.
          </p>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
          {doctorMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''} animate-fade-in`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  isUser 
                    ? 'bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)]/40 text-[var(--color-on-surface-variant)]' 
                    : 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/20'
                }`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: !isUser ? "'FILL' 1" : undefined }}>
                    {isUser ? 'person' : 'smart_toy'}
                  </span>
                </div>
                <div className={`space-y-1.5 ${isUser ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 justify-start select-none">
                    <span className={`font-heading font-semibold text-xs ${isUser ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-primary)]'}`}>
                      {isUser ? 'You' : 'Med Z AI Doctor'}
                    </span>
                    <span className="text-[10px] text-[var(--color-outline)]">Just now</span>
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    isUser 
                      ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-900 border border-[var(--color-surface-variant)]/60 text-[var(--color-on-surface)] rounded-tl-none message-glow'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {isDoctorTyping && (
            <div className="flex gap-4 max-w-3xl animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-primary)]/20 text-white">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 justify-start">
                  <span className="font-heading font-semibold text-xs text-[var(--color-primary)]">Med Z AI Doctor</span>
                  <span className="text-[10px] text-[var(--color-outline)]">Typing...</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-[var(--color-surface-variant)]/60 px-5 py-4 rounded-2xl rounded-tl-none message-glow flex items-center gap-1.5 w-fit">
                  <div className="w-1.5 h-1.5 bg-[var(--color-outline)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--color-outline)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--color-outline)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 pt-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)] to-transparent">
          <form onSubmit={handleDoctorMessage} className="max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl p-1.5 flex items-center gap-1 shadow-xl bg-white/80 dark:bg-slate-900/80 border border-[var(--color-outline-variant)]/20">
              <button type="button" className="p-3 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center cursor-pointer" title="Upload Prescription">
                <span className="material-symbols-outlined text-xl">attachment</span>
              </button>
              <button type="button" className="p-3 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center cursor-pointer" title="Capture Photo">
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </button>
              <input
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/60 px-4"
                placeholder="Type symptoms (cough, allergy, pain) or ask medical questions..."
                type="text"
                value={doctorInput}
                onChange={(e) => setDoctorInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!doctorInput.trim() || isDoctorTyping}
                className="bg-[var(--color-primary)] text-white p-3 rounded-xl flex items-center justify-center hover:bg-[var(--color-primary-container)] transition-all active:scale-95 shadow-md shadow-[var(--color-primary)]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2.5 flex justify-center">
              <p className="text-[10px] text-[var(--color-outline)] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                Your consultation is encrypted and private.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Right Side: Details/Recommendations (Desktop Only) */}
      <aside className="hidden xl:flex w-96 bg-white dark:bg-slate-900 border-l border-[var(--color-outline-variant)]/40 flex-col shrink-0 overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-6">
          <h3 className="font-heading font-bold text-lg text-[var(--color-on-surface)] mb-4">Quick Actions</h3>
          
          <div className="space-y-6">
            {/* Prescription Card */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/30 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <p className="font-heading font-bold text-sm text-[var(--color-on-surface)]">Digital Prescription</p>
              </div>
              <p className="text-xs text-[var(--color-on-surface-variant)] leading-normal">Upload your physical prescription for AI-powered verification and medicine reminders.</p>
              <button className="w-full py-2.5 border-2 border-dashed border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] rounded-xl text-[var(--color-outline)] font-heading font-semibold text-xs hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
                Upload Now
              </button>
            </div>

            {/* Recommended Product Bento */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider">Recommended for you</h4>
              
              <div className="group relative bg-white dark:bg-slate-900 border border-[var(--color-outline-variant)]/40 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-video rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center mb-4 relative">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">pill</span>
                  <span className="absolute top-2 right-2 bg-[var(--color-secondary)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">TOP RATED</span>
                </div>
                <div className="space-y-1">
                  <p className="font-heading font-bold text-sm text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">Tussin Cough Syrup</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Honey-Based, 200ml</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-heading font-extrabold text-base text-[var(--color-on-surface)]">₹120</span>
                    <button 
                      onClick={() => handleAddRecommended("Tussin Cough Syrup", 120, "Cold & Cough")}
                      className="bg-[var(--color-primary)] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white dark:bg-slate-900 border border-[var(--color-outline-variant)]/40 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-video rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center mb-4 relative">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">pill</span>
                </div>
                <div className="space-y-1">
                  <p className="font-heading font-bold text-sm text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">Menthol Lozenges</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Pack of 12, Extra Strength</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-heading font-extrabold text-base text-[var(--color-on-surface)]">₹45</span>
                    <button 
                      onClick={() => handleAddRecommended("Menthol Lozenges", 45, "Cold & Cough")}
                      className="bg-[var(--color-primary)] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Doctor */}
            <div className="p-5 rounded-2xl bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 relative overflow-hidden shadow-sm">
              <div className="relative z-10">
                <p className="font-heading font-bold text-sm text-[var(--color-secondary)] mb-1">Need more clarity?</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 leading-normal">Book a video call with a certified MD in the next 15 minutes.</p>
                <button className="w-full py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-on-secondary-container)] text-white rounded-xl font-heading font-bold text-xs transition-all cursor-pointer active:scale-[0.98]">
                  Book Video Consultation
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[90px] text-[var(--color-secondary)]/10 rotate-12 select-none">video_chat</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
