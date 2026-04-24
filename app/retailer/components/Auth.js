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

      // Proceed to actual signup
      const signupRes = await fetch('/api/retailer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.error || 'Signup failed');
      
      const loginData = {
        name: signupData.name,
        email: signupData.email,
        shop_verified: false
      };
      localStorage.setItem('medz_retailer', JSON.stringify(loginData));
      onLoginSuccess(loginData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Store size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {authMode === 'login' ? 'Retailer Login' : 'Partner with MedZ'}
          </h2>
          <p className="text-slate-400 text-sm">
            {authMode === 'login' ? 'Manage your pharmacy orders and deliveries' : 'Grow your pharmacy business with smart tech'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        {authStep === 'form' ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    placeholder="Rahul Sharma"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="pharmacy@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {authMode === 'login' ? 'Sign In' : 'Continue'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
              <p className="text-sm text-slate-400 text-center">
                Enter the 6-digit code sent to <br/><strong className="text-white">{authForm.email}</strong>
              </p>
            </div>
            <input
              type="text"
              value={otpCode}
              onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0,6))}
              className="w-full bg-slate-950 border border-slate-800 text-white text-center text-2xl tracking-widest rounded-xl py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="000000"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otpCode.length !== 6}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Complete'}
            </button>
          </div>
        )}

        {authStep === 'form' && (
          <div className="mt-8 text-center text-sm text-slate-400">
            {authMode === 'login' ? "Don't have a partner account? " : "Already partnered with us? "}
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-emerald-400 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Apply Now' : 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
