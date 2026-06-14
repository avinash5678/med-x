'use client';
import React from 'react';

export default function HomeView({ setCurrentView, setIsDoctorOpen, setIsChatOpen }) {
  return (
    <div className="flex-1 w-full overflow-y-auto scrollbar-hide">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden bg-[var(--color-surface-container-lowest)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-16">
          <div className="flex flex-col items-start gap-6">
            <span className="px-3 py-1 bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] rounded-full font-heading text-sm font-semibold tracking-wide">Next-Gen Pharmacy Platform</span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-[48px] leading-[1.2] tracking-tight text-[var(--color-on-background)]">
              Your Health, <br/><span className="text-[var(--color-primary)]">Orchestrated.</span>
            </h1>
            <p className="font-body text-lg text-[var(--color-on-surface-variant)] max-w-md leading-relaxed">
              Experience clinical precision in pharmaceutical care. From AI-assisted diagnostics to seamless prescription management, we synchronize your wellness journey.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button onClick={() => setCurrentView('medicines')}
                className="px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg font-heading text-sm font-semibold atmospheric-shadow hover:bg-[var(--color-primary-container)] transition-all active:scale-95 cursor-pointer">
                Get Started
              </button>
              <button onClick={() => setIsDoctorOpen(true)}
                className="px-8 py-4 bg-[var(--color-surface-container-low)] text-[var(--color-primary)] rounded-lg font-heading text-sm font-semibold border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] transition-all cursor-pointer">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block relative h-[500px]">
            <div className="absolute inset-0 rounded-xl overflow-hidden atmospheric-shadow border border-[var(--color-outline-variant)]">
              <img alt="Professional Clinical Laboratory" className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1pNEG8PFKDYLO_9fdeaufpH6HoMBnRicoPD-ODvS0iC78lWGuDSgdsDItg9LeIghcNEZpQKXyBT-FD1mQUjwxgMv7X3HiFl6lZzWYSDdVwftdfwlyNP8Y8INGWDQHMyrPLAHVIm8QjbjUc_5rLGVd6V0Y9Ji1xp-T5g5QLOXYKKBLeRVvifoygHkz3hJYKB6mH7nZ_HJZzSYFzEipXQu_7FGilX_GmWy0zDHKew6Meut-GnbSD1AwgIUUg_CrAcojzyBL7iigpIFV" />
            </div>
            <div className="absolute bottom-6 -left-12 bg-[var(--color-surface-container-lowest)] p-6 rounded-xl atmospheric-shadow border border-[var(--color-outline-variant)] max-w-[240px]">
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-heading text-sm font-semibold">99.9% Accuracy</span>
              </div>
              <p className="font-body text-sm text-[var(--color-on-surface-variant)]">Validated through AI-assisted pharmaceutical protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[var(--color-surface-container-low)] py-6 border-y border-[var(--color-outline-variant)]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-60">
            {[
              { icon: 'verified_user', label: 'FDA Certified' },
              { icon: 'security', label: 'HIPAA Compliant' },
              { icon: 'workspace_premium', label: 'ISO 27001 Quality' },
              { icon: 'clinical_notes', label: 'Board-Certified Doctors' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[var(--color-outline)]">{badge.icon}</span>
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--color-outline)]">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <h2 className="font-heading font-semibold text-3xl text-[var(--color-on-background)]">Modern Healthcare Infrastructure</h2>
          <p className="font-body text-base text-[var(--color-on-surface-variant)] max-w-2xl">Streamlined clinical services designed for the demands of modern patients and healthcare providers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Health Assistant */}
          <div className="md:col-span-2 bg-[var(--color-surface-container-lowest)] p-8 rounded-xl border border-[var(--color-outline-variant)] atmospheric-shadow group hover:border-[var(--color-primary)]/30 transition-all">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-5">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-fixed)] flex items-center justify-center text-[var(--color-primary)]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>smart_toy</span>
                </div>
                <h3 className="font-heading font-semibold text-2xl text-[var(--color-on-background)]">AI Health Assistant</h3>
                <p className="font-body text-base text-[var(--color-on-surface-variant)]">Our intelligent engine monitors medication interactions, sends smart reminders, and provides 24/7 basic health guidance.</p>
                <button onClick={() => setIsChatOpen(true)} className="inline-flex items-center text-[var(--color-primary)] font-heading text-sm font-semibold gap-1 group-hover:gap-2 transition-all cursor-pointer">
                  Explore Intelligent Care <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <div className="flex-1 w-full h-48 bg-[var(--color-surface-container-low)] rounded-lg overflow-hidden border border-[var(--color-outline-variant)]">
                <img alt="AI Dashboard" className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJhXpkPqTUHotMG_IQdHRSEeJVIhOrBn0jTHhlFhJl-osUEOKwG0s1wWy5UL3l0rukkLt7BQUyP1hbj2NObaqFjzH_gFoh0_jKdJXN-1PA8Xp356DNA4_9UiiFZ8ZoyxrXovXMa1w0NSsNOFTI0hKbRdcAChR6_rHu7m_i3qXQH6eKvC0ElIZuyJ8ps10hjSodlNC-XwF4DGDjGFmZbEEXGMhMmniXdzFtbBxdZlRrTKtR5o_GyeW85mKHe4gU5iO48MJoX28iRecw" />
              </div>
            </div>
          </div>
          {/* Virtual Consultations */}
          <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl border border-[var(--color-outline-variant)] atmospheric-shadow group hover:border-[var(--color-primary)]/30 transition-all flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-on-secondary-container)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>video_chat</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-[var(--color-on-background)]">Virtual Consultations</h3>
              <p className="font-body text-sm text-[var(--color-on-surface-variant)]">Connect with board-certified pharmacists and specialists within minutes from the comfort of your home.</p>
              <button onClick={() => setIsDoctorOpen(true)} className="inline-flex items-center text-[var(--color-primary)] font-heading text-sm font-semibold gap-1 group-hover:gap-2 transition-all cursor-pointer mt-2">
                Consult a Doctor <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--color-outline-variant)] flex items-center justify-between">
              <span className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">Available Now</span>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-surface-dim)]"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-surface-dim)]"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[var(--color-surface-dim)]"></div>
              </div>
            </div>
          </div>
          {/* Prescription Upload */}
          <div className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl border border-[var(--color-outline-variant)] atmospheric-shadow group hover:border-[var(--color-primary)]/30 transition-all flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-tertiary-fixed)] flex items-center justify-center text-[var(--color-on-primary-fixed)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>upload_file</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-[var(--color-on-background)]">One-Tap Prescription</h3>
              <p className="font-body text-sm text-[var(--color-on-surface-variant)]">Simply snap a photo of your prescription. Our AI digitizes and validates the order for immediate clinical review.</p>
            </div>
            <button onClick={() => setIsChatOpen(true)} className="mt-8 w-full py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-lg font-heading text-sm font-semibold hover:opacity-90 transition-all cursor-pointer">Upload Now</button>
          </div>
          {/* Gold Standard Logistics */}
          <div className="md:col-span-2 bg-[var(--color-on-background)] p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center text-[var(--color-on-primary)]">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-2xl mb-4">Gold Standard Logistics</h3>
              <p className="text-[var(--color-surface-variant)] font-body text-base">Cold-chain delivery systems ensure your medications arrive in optimal clinical condition, tracked in real-time.</p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="bg-[var(--color-surface-container-highest)]/10 p-6 rounded-lg border border-white/10">
                  <span className="block font-heading text-2xl font-bold">24h</span>
                  <span className="font-body text-sm opacity-70">Avg. Delivery</span>
                </div>
                <div className="bg-[var(--color-surface-container-highest)]/10 p-6 rounded-lg border border-white/10">
                  <span className="block font-heading text-2xl font-bold">100%</span>
                  <span className="font-body text-sm opacity-70">Insured Shipments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-[var(--color-surface)] py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { num: '01', title: 'Upload Order', desc: 'Securely upload your clinical documents via our encrypted portal.' },
              { num: '02', title: 'Clinical Review', desc: 'Pharmacists verify accuracy and cross-check interaction risks.' },
              { num: '03', title: 'Secure Dispatch', desc: 'Orders are packed in temperature-controlled medical-grade kits.' },
              { num: '04', title: 'Live Support', desc: 'Continuous monitoring and 24/7 access to pharmacist support.' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-3">
                <div className="text-[var(--color-primary)] font-bold font-heading text-3xl opacity-20">{step.num}</div>
                <h4 className="font-heading font-semibold text-lg">{step.title}</h4>
                <p className="font-body text-sm text-[var(--color-on-surface-variant)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[var(--color-on-background)] dark:bg-[var(--color-surface-container-lowest)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 lg:px-12 py-16 max-w-[1280px] mx-auto">
          <div className="space-y-4">
            <span className="font-heading text-lg font-bold text-[var(--color-on-primary)] dark:text-[var(--color-primary)] block">Med Z Pharmacy</span>
            <p className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)]">Advancing pharmaceutical care through precision technology and clinical excellence.</p>
          </div>
          <div>
            <h5 className="text-[var(--color-on-primary)] dark:text-[var(--color-primary)] font-heading font-semibold text-sm mb-4">Patient Services</h5>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('medicines')} className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors cursor-pointer">Medicines</button></li>
              <li><button onClick={() => setIsDoctorOpen(true)} className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors cursor-pointer">Consultations</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors cursor-pointer">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[var(--color-on-primary)] dark:text-[var(--color-primary)] font-heading font-semibold text-sm mb-4">Company</h5>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => alert("Med Z Privacy Policy: Your data security is our priority. We comply with relevant digital healthcare information privacy rules.")} 
                  className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("Med Z Terms of Service: By using the Med Z platform, you agree to our digital healthcare delivery and consultation guidelines.")} 
                  className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => alert("Med Z Quality Standards: All our partner pharmacies and fulfillment hubs comply with ISO 9001 quality management guidelines.")} 
                  className="font-body text-sm text-[var(--color-surface-variant)] dark:text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary-fixed-dim)] dark:hover:text-[var(--color-primary)] transition-colors bg-transparent border-0 cursor-pointer p-0 text-left"
                >
                  Quality Standards
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[var(--color-on-primary)] dark:text-[var(--color-primary)] font-heading font-semibold text-sm mb-4">Newsletter</h5>
            <div className="flex">
              <input className="flex-1 px-4 py-2 bg-[var(--color-surface-container-high)]/10 border border-white/20 rounded-l-lg text-white focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" placeholder="Clinical updates..." type="email" />
              <button onClick={() => alert("Thank you for subscribing to the Med Z Newsletter!")} className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-r-lg hover:bg-[var(--color-primary-container)] transition-all cursor-pointer">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 border-t border-white/10 text-center">
          <span className="font-body text-sm text-[var(--color-surface-variant)]/60">© 2026 Med Z Pharmacy. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
