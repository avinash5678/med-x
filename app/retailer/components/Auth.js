"use client";
import { useState } from 'react';
import { Mail, Lock, User, Store, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authStep, setAuthStep] = useState('form'); // form, otp
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'signup') {
        const res = await fetch('/api/retailer/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, purpose: 'signup' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
        setAuthStep('otp');
      } else {
        const res = await fetch('/api/retailer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, password: authForm.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('medz_retailer', JSON.stringify(data));
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/retailer/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, otp: otpCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      const signupRes = await fetch('/api/retailer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error || 'Signup failed');

      const loginData = { name: signupData.name, email: signupData.email, shop_verified: false };
      localStorage.setItem('medz_retailer', JSON.stringify(loginData));
      onLoginSuccess(loginData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 pl-11 pr-4 text-sm placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Store size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {authMode === 'login' ? 'Retailer Login' : 'Partner with MedZ'}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {authMode === 'login'
              ? 'Manage your pharmacy orders and deliveries'
              : 'Grow your pharmacy business with smart tech'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-medium text-center mb-6 flex items-center gap-2 justify-center">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        {authStep === 'form' ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" size={17} />
                  <input
                    type="text" required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="Rahul Sharma"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" size={17} />
                <input
                  type="email" required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="pharmacy@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" size={17} />
                <input
                  type="password" required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={19} /> : (
                <>{authMode === 'login' ? 'Sign In' : 'Continue'} <ArrowRight size={17} /></>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-600">Enter the 6-digit code sent to</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{authForm.email}</p>
            </div>
            <input
              type="text"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-white border border-slate-200 text-slate-900 text-center text-2xl tracking-[0.3em] font-bold rounded-xl py-4 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
              placeholder="000000"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otpCode.length !== 6}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgb(0,0,0,0.1)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={19} /> : 'Verify & Complete'}
            </button>
          </div>
        )}

        {authStep === 'form' && (
          <div className="mt-8 text-center text-sm text-slate-500">
            {authMode === 'login' ? "Don't have a partner account? " : 'Already partnered with us? '}
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-slate-900 font-semibold hover:underline"
            >
              {authMode === 'login' ? 'Apply Now' : 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
