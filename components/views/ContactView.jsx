'use client';
import React from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactView({
  contactForm, setContactForm, contactStatus, handleContactSubmit, setCurrentView,
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-12 scrollbar-hide">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] font-medium mb-8 transition-colors w-fit bg-[var(--color-surface-container-lowest)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)] atmospheric-shadow cursor-pointer">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Home
        </button>

        <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)] atmospheric-shadow p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-[var(--color-primary-fixed)] text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h2 className="font-heading font-semibold text-2xl text-[var(--color-on-surface)]">Contact Us</h2>
            <p className="text-[var(--color-on-surface-variant)] mt-2 text-sm font-body">Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.</p>
          </div>

          {contactStatus.success && (
            <div className="bg-[var(--color-secondary-container)]/20 text-[var(--color-secondary)] p-4 rounded-xl text-sm font-medium mb-6 border border-[var(--color-secondary-container)]/30 flex items-center gap-3 animate-fade-in">
              <CheckCircle2 size={18} />
              {contactStatus.success}
            </div>
          )}

          {contactStatus.error && (
            <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-4 rounded-xl text-sm font-medium mb-6 border border-[var(--color-error)]/20 flex items-center gap-3 animate-fade-in">
              <AlertCircle size={18} />
              {contactStatus.error}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">Name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-lowest)] focus:bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm placeholder-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-lowest)] focus:bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm placeholder-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">Message</label>
              <textarea required rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full p-4 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-lowest)] focus:bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm placeholder-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 transition-all resize-none" placeholder="How can we help you today?" />
            </div>

            <button type="submit" disabled={contactStatus.loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-[var(--color-on-primary)] py-3.5 rounded-xl font-heading font-semibold text-sm transition-all atmospheric-shadow active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
              {contactStatus.loading ? 'Sending...' : (<><Send size={18} /> Send Message</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
