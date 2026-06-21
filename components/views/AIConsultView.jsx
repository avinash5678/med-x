'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Send, ChevronRight, X, AlertTriangle } from 'lucide-react';

export default function AIConsultView({
  doctorMessages,
  setDoctorMessages,
  handleDoctorMessage,
  isDoctorTyping,
  setCurrentView,
  addToCart,
}) {
  const [localDoctorInput, setLocalDoctorInput] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [callState, setCallState] = useState('ringing'); // 'ringing', 'connected', 'ended'
  const [callSeconds, setCallSeconds] = useState(0);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [doctorMessages, isDoctorTyping]);

  // Video call duration timer
  useEffect(() => {
    let timer;
    if (isVideoCalling && callState === 'connected') {
      timer = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVideoCalling, callState]);

  const startVideoCall = () => {
    setIsVideoCalling(true);
    setCallState('ringing');
    setCallSeconds(0);
    // Ring for 2.5 seconds then connect
    setTimeout(() => {
      setCallState('connected');
    }, 2500);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadHistory = (title) => {
    let logs = [];
    if (title === 'Seasonal Allergy Advice') {
      logs = [
        { role: 'model', text: 'Hello, I am the Med Z AI Doctor. Please describe your symptoms in detail (duration, severity, and any other context), and I will provide a preliminary triage and home care suggestions.' },
        { role: 'user', text: 'Hey doctor, I get severe sneezing and itchy eyes every year during spring.' },
        { role: 'model', text: 'Spring allergies are very common, likely caused by tree or grass pollen. To manage them: \n\n1. Start taking an OTC antihistamine (like Cetirizine 10mg) daily before spring starts.\n2. Keep windows closed and use an air purifier.\n3. Wash your hair before bed to remove pollen.\n\nDo you experience any asthma symptoms like wheezing?' }
      ];
    } else if (title === 'Vitamin D Deficiency') {
      logs = [
        { role: 'model', text: 'Hello, I am the Med Z AI Doctor. Please describe your symptoms in detail (duration, severity, and any other context), and I will provide a preliminary triage and home care suggestions.' },
        { role: 'user', text: 'My test report says Vitamin D is 12 ng/ml. What should I do?' },
        { role: 'model', text: 'A level of 12 ng/ml indicates moderate deficiency (optimal is >30). You should take Vitamin D3 60,000 IU capsules once weekly for 8 weeks, followed by a monthly maintenance dose. Please consume it with a meal containing fats (like milk or butter) to optimize absorption.' }
      ];
    } else {
      logs = [
        { role: 'model', text: 'Hello, I am the Med Z AI Doctor. Please describe your symptoms in detail (duration, severity, and any other context), and I will provide a preliminary triage and home care suggestions.' },
        { role: 'user', text: 'I had minor knee surgery last week. How should I care for it?' },
        { role: 'model', text: 'Post-op knee care:\n\n1. Keep the dressing clean and dry.\n2. Elevate your leg above heart level when resting.\n3. Apply ice packs for 15 minutes at a time to reduce swelling.\n4. Follow the physical therapy exercises strictly.\n\nCall your surgeon immediately if you notice severe redness, swelling, or calf pain.' }
      ];
    }
    setDoctorMessages(logs);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsFileUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFileUploading(false);
          setDoctorMessages(prev => [
            ...prev,
            { role: 'user', text: `Uploaded prescription: ${file.name}` },
            { role: 'model', text: "Prescription analyzed! It lists:\n1. Dolo 650 (Paracetamol 650mg) - Qty 15\n2. Limcee (Vitamin C 500mg) - Qty 15\n\nI have prepared these items for your cart. You can add them below.", products: [
              { id: 1, name: 'Dolo 650', price: 30, category: 'Fever', description: 'Fast relief from fever and pain. 15 tablets.', icon: () => <span className="material-symbols-outlined">pill</span> },
              { id: 29, name: 'Limcee Vitamin C', price: 60, category: 'Immunity', description: 'Daily immunity booster. Orange flavor, 15 chewable tablets.', icon: () => <span className="material-symbols-outlined">pill</span> }
            ] }
          ]);
        }, 500);
      }
    }, 250);
  };

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
              <button onClick={() => loadHistory("Seasonal Allergy Advice")} className="w-full text-left p-3.5 rounded-xl bg-[var(--color-surface-container-highest)]/50 border border-transparent hover:border-[var(--color-primary)]/20 hover:bg-white transition-all cursor-pointer">
                <p className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Seasonal Allergy Advice</p>
                <p className="text-[10px] text-[var(--color-outline)] mt-1">Yesterday, 4:30 PM</p>
              </button>
              <button onClick={() => loadHistory("Vitamin D Deficiency")} className="w-full text-left p-3.5 rounded-xl hover:bg-white/50 border border-transparent transition-all cursor-pointer">
                <p className="font-heading font-semibold text-xs text-[var(--color-on-surface)]">Vitamin D Deficiency</p>
                <p className="text-[10px] text-[var(--color-outline)] mt-1">Oct 12, 2023</p>
              </button>
              <button onClick={() => loadHistory("Post-Surgery Care")} className="w-full text-left p-3.5 rounded-xl hover:bg-white/50 border border-transparent transition-all cursor-pointer">
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
            <p className="text-xs font-heading font-bold text-[var(--color-primary)] mb-1">
              {isPremium ? "✓ Med Z Premium Active" : "Premium Support"}
            </p>
            <p className="text-[11px] text-[var(--color-on-surface-variant)] mb-3 leading-normal">
              {isPremium ? "You have unlimited 24/7 priority access to human doctors." : "Get priority access to human doctors 24/7."}
            </p>
            {!isPremium && (
              <button onClick={() => setIsPremium(true)} className="w-full py-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)] rounded-lg font-heading font-semibold text-xs transition-colors cursor-pointer active:scale-[0.98]">
                Upgrade Plan
              </button>
            )}
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

          {isFileUploading && (
            <div className="flex gap-4 max-w-3xl animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-lg text-white">
                <span className="material-symbols-outlined">cloud_upload</span>
              </div>
              <div className="space-y-2 w-[240px] bg-white dark:bg-slate-900 border border-[var(--color-outline-variant)]/40 p-4 rounded-2xl">
                <p className="text-xs font-heading font-bold text-[var(--color-primary)]">Reading Prescription...</p>
                <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-primary)] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-[10px] text-[var(--color-outline)] font-medium">Scanning text with OCR ({uploadProgress}%)</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 pt-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)] to-transparent">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (localDoctorInput.trim()) {
                handleDoctorMessage(localDoctorInput.trim());
                setLocalDoctorInput('');
              }
            }} 
            className="max-w-4xl mx-auto"
          >
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <div className="glass-panel rounded-2xl p-1.5 flex items-center gap-1 shadow-xl bg-white/80 dark:bg-slate-900/80 border border-[var(--color-outline-variant)]/20">
              <button 
                onClick={() => fileInputRef.current?.click()}
                type="button" 
                className="p-3 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center cursor-pointer" 
                title="Upload Prescription"
              >
                <span className="material-symbols-outlined text-xl">attachment</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                type="button" 
                className="p-3 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center cursor-pointer" 
                title="Capture Photo"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
              </button>
              <input
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/60 px-4"
                placeholder="Type symptoms (cough, allergy, pain) or ask medical questions..."
                type="text"
                value={localDoctorInput}
                onChange={(e) => setLocalDoctorInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!localDoctorInput.trim() || isDoctorTyping}
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
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-2.5 border-2 border-dashed border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] rounded-xl text-[var(--color-outline)] font-heading font-semibold text-xs hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
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
                <button onClick={startVideoCall} className="w-full py-2.5 bg-[var(--color-secondary)] hover:bg-[var(--color-on-secondary-container)] text-white rounded-xl font-heading font-bold text-xs transition-all cursor-pointer active:scale-[0.98]">
                  Book Video Consultation
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[90px] text-[var(--color-secondary)]/10 rotate-12 select-none">video_chat</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Video Call Simulation Modal Overlay */}
      {isVideoCalling && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fade-in p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] w-full max-w-lg h-[500px] overflow-hidden flex flex-col relative shadow-2xl text-white">
            
            {/* Call status / connecting screen */}
            {callState === 'ringing' ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 bg-teal-500/20 rounded-full animate-ping"></div>
                  <div className="absolute w-32 h-32 bg-teal-500/10 rounded-full animate-ping" style={{ animationDelay: '500ms' }}></div>
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-3xl animate-pulse">stethoscope</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold font-heading mb-1 text-slate-100">Med Z Doctor Consult</h3>
                  <p className="text-sm text-teal-400 font-semibold uppercase tracking-wider animate-pulse">Connecting with Doctor...</p>
                </div>
              </div>
            ) : callState === 'connected' ? (
              <div className="flex-1 relative flex flex-col bg-slate-950">
                
                {/* Doctor video (main window) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
                    <div className="w-20 h-20 bg-teal-500/15 rounded-full flex items-center justify-center text-teal-400 border border-teal-500/30">
                      <span className="material-symbols-outlined text-4xl">medical_services</span>
                    </div>
                    <p className="text-sm font-heading font-semibold text-slate-300 mt-4">Dr. Sarah D&apos;Souza</p>
                    <p className="text-xs text-slate-500 mt-1">General Medicine Specialist</p>
                  </div>
                </div>
 
                {/* Customer self-video (small inset window) */}
                <div className="absolute top-4 right-4 w-32 h-40 bg-slate-850 rounded-2xl border border-slate-700 shadow-md flex flex-col items-center justify-center overflow-hidden z-10">
                  <span className="material-symbols-outlined text-slate-500 mb-2">person</span>
                  <span className="text-[10px] text-slate-400 font-medium">Your Video</span>
                </div>
 
                {/* Top Call Info */}
                <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200">{formatTime(callSeconds)}</span>
                </div>
              </div>
            ) : null}
 
            {/* Call controls footer */}
            <div className="h-24 bg-slate-950 border-t border-slate-900 flex items-center justify-center gap-6">
              <button 
                onClick={() => setIsVideoCalling(false)} 
                className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-90 hover:scale-105 cursor-pointer"
                title="Hang Up"
              >
                <span className="material-symbols-outlined text-2xl rotate-[135deg]">call_end</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
