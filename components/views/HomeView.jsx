'use client';
import React from 'react';
import { 
  Truck, 
  Bot, 
  FileText, 
  Pill, 
  Activity, 
  RotateCw, 
  MapPin, 
  Video, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Award,
  Lock,
  HeartPulse,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function HomeView({ 
  setCurrentView, 
  setIsDoctorOpen, 
  setIsChatOpen,
  onUploadPrescription,
  onOpenSubstitute
}) {
  return (
    <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F7F9FB]">
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-8 md:gap-12">
        
        {/* Hero Section: Dual Glassmorphic Cards from Stitch Design */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Decorative ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#80D5CB]/15 rounded-full blur-[120px] -z-10 pointer-events-none" />

          {/* Card 1: Express Dispatch */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group border border-[#E2E8F0] shadow-[0_10px_30px_rgba(15,118,110,0.05)] hover:border-[#0F766E]/40 transition-all duration-300 min-h-[380px]">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#C8EBFF]/40 rounded-full blur-3xl group-hover:bg-[#C8EBFF]/70 transition-all duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#E0E3E5] text-[#3E4947] text-xs font-semibold tracking-wider border border-[#BDC9C6]/50">
                  ⚡ Lightning Fast
                </span>
              </div>

              <div className="mt-4">
                <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#191C1E] tracking-tight leading-[1.2] mb-3">
                  10-Minute <br />
                  <span className="text-[#005C55]">Express Dispatch</span>
                </h1>
                <p className="text-base text-[#3E4947] max-w-md mb-6 leading-relaxed">
                  Critical medications prepared, verified by certified pharmacists, and dispatched with temperature-controlled cold packs.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => setCurrentView('medicines')}
                    className="bg-[#005C55] text-white hover:bg-[#0F766E] transition-all px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    Order Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentView('prescriptions')}
                    className="bg-white text-[#005C55] border border-[#BDC9C6] hover:bg-[#F2F4F6] transition-all px-5 py-3 rounded-full text-sm font-semibold cursor-pointer"
                  >
                    Upload Rx
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AI Clinical Consultation */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group border border-[#E2E8F0] shadow-[0_10px_30px_rgba(115,71,0,0.04)] hover:border-[#945D00]/40 transition-all duration-300 min-h-[380px]">
            <div className="absolute -left-10 -top-10 w-60 h-60 bg-[#FFDDB8]/40 rounded-full blur-3xl group-hover:bg-[#FFDDB8]/70 transition-all duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#945D00] text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFE6CC] text-[#734700] text-xs font-semibold tracking-wider border border-[#FFB95F]/50">
                  🩺 24/7 Always Online
                </span>
              </div>

              <div className="mt-4">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#191C1E] tracking-tight leading-[1.2] mb-3">
                  24/7 AI Clinical <br />
                  <span className="text-[#734700]">Pharmacist Assistant</span>
                </h2>
                <p className="text-base text-[#3E4947] max-w-md mb-6 leading-relaxed">
                  Real-time dosage guidelines, drug-to-drug interaction checks, and affordable generic substitute recommendations.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => setCurrentView('consult')}
                    className="bg-[#734700] text-white hover:bg-[#945D00] transition-all px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    Start AI Consult
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsDoctorOpen(true)}
                    className="bg-white text-[#734700] border border-[#BDC9C6] hover:bg-[#F2F4F6] transition-all px-5 py-3 rounded-full text-sm font-semibold cursor-pointer"
                  >
                    Video Call Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Icon Quick Action Grid (Bento Style from Stitch Screen) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#191C1E] tracking-tight">Quick Actions & Services</h3>
            <span className="text-xs font-semibold text-[#005C55] uppercase tracking-wider">Fast-Track Healthcare</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            
            {/* 1. Upload Prescription */}
            <button 
              onClick={() => setCurrentView('prescriptions')}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#005C55] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#0F766E] group-hover:text-white text-[#005C55] transition-colors flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#005C55] transition-colors">
                Upload Prescription
              </span>
            </button>

            {/* 2. Generic Substitutes */}
            <button 
              onClick={() => setCurrentView('medicines')}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#006398] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#006398] group-hover:text-white text-[#006398] transition-colors flex items-center justify-center shadow-sm">
                <Pill className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#006398] transition-colors">
                Generic Substitutes
              </span>
            </button>

            {/* 3. Lab Tests */}
            <button 
              onClick={() => setCurrentView('lab_tests')}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#734700] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#945D00] group-hover:text-white text-[#734700] transition-colors flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#734700] transition-colors">
                Book Lab Tests
              </span>
            </button>

            {/* 4. Auto-Refills */}
            <button 
              onClick={() => setCurrentView('refills')}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#005C55] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#0F766E] group-hover:text-white text-[#005C55] transition-colors flex items-center justify-center shadow-sm">
                <RotateCw className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#005C55] transition-colors">
                Auto-Refill Schedule
              </span>
            </button>

            {/* 5. Nearby Pharmacies */}
            <button 
              onClick={() => setCurrentView('pharmacies')}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#006398] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#006398] group-hover:text-white text-[#006398] transition-colors flex items-center justify-center shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#006398] transition-colors">
                Partner Pharmacies
              </span>
            </button>

            {/* 6. Video Consult */}
            <button 
              onClick={() => setIsDoctorOpen(true)}
              className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#734700] hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 aspect-square group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F2F4F6] group-hover:bg-[#945D00] group-hover:text-white text-[#734700] transition-colors flex items-center justify-center shadow-sm">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-center text-[#191C1E] group-hover:text-[#734700] transition-colors">
                Video Consult Doctor
              </span>
            </button>
          </div>
        </section>

        {/* Clinical Quality & Trust Strip */}
        <section className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#0F766E] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#191C1E]">100% Genuine</h4>
                <p className="text-xs text-[#3E4947]">Licensed & Direct Sourced</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#191C1E]">NABL Accredited</h4>
                <p className="text-xs text-[#3E4947]">Verified Diagnostics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#191C1E]">Clinical Safety</h4>
                <p className="text-xs text-[#3E4947]">Drug Interaction Guard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7E22CE] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#191C1E]">Safe & Encrypted</h4>
                <p className="text-xs text-[#3E4947]">HIPAA & 256-Bit SSL</p>
              </div>
            </div>
          </div>
        </section>

        {/* Chronic Care & Health Conditions */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#191C1E]">Shop by Health Concern</h3>
              <p className="text-xs text-[#3E4947]">Curated clinical regimens tailored for chronic conditions</p>
            </div>
            <button 
              onClick={() => setCurrentView('medicines')} 
              className="text-xs font-semibold text-[#005C55] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { title: 'Diabetes Care', count: '140+ Medicines', icon: '🩸', category: 'Diabetes' },
              { title: 'Cardiac Health', count: '95+ Medicines', icon: '❤️', category: 'Cardiac' },
              { title: 'Pain Relief', count: '120+ Medicines', icon: '⚡', category: 'Pain Relief' },
              { title: 'Stomach & GI', count: '85+ Medicines', icon: '🌱', category: 'Stomach' },
              { title: 'Vitamins & Immunity', count: '110+ Products', icon: '🛡️', category: 'Vitamins' },
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentView('medicines')}
                className="bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#005C55] hover:shadow-md transition-all cursor-pointer flex flex-col items-start justify-between min-h-[110px]"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-[#191C1E]">{item.title}</h4>
                  <p className="text-[11px] text-[#3E4947]">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2E8F0] shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#191C1E]">How Med Z Works</h3>
            <p className="text-xs text-[#3E4947]">End-to-end verified pharmacy fulfillment with clinical oversight</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Upload or Select', desc: 'Browse catalog or upload your prescription with one tap.' },
              { num: '02', title: 'Clinical Review', desc: 'Registered pharmacists verify dosage and cross-check interactions.' },
              { num: '03', title: 'Cold-Chain Packing', desc: 'Packed securely in temperature-controlled kits with ice gel.' },
              { num: '04', title: '10-Min Live Track', desc: 'Real-time GPS tracking and OTP verification at your doorstep.' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-2">
                <div className="text-[#005C55] font-bold text-3xl opacity-30">{step.num}</div>
                <h4 className="font-semibold text-sm text-[#191C1E]">{step.title}</h4>
                <p className="text-xs text-[#3E4947] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
