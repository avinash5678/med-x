'use client';
import React, { useEffect, useRef } from 'react';

export default function LoginView({
  authMode, setAuthMode, authForm, setAuthForm, authError, setAuthError,
  authStep, setAuthStep, authSuccessMsg, setAuthSuccessMsg,
  otpCode, setOtpCode, otpSending, otpCountdown,
  handleAuthSubmit, handleSendOtp, handleVerifyAndSignup,
  handleSendResetOtp, handleVerifyResetOtp, handleResetPassword,
  handleGoogleLogin, handleSendLoginOtp, handleVerifyLoginOtp,
}) {
  const googleBtnRef = useRef(null);

  // Initialize Google Sign-In button
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;

    const initGoogleBtn = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: '100%',
            logo_alignment: 'center',
          }
        );
      }
    };

    // GIS script might not be loaded yet
    if (window.google) {
      initGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogleBtn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleLogin, authMode, authStep]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col relative overflow-hidden">
      <main className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Branding */}
        <section className="hidden md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden mesh-gradient-bg flex-col justify-between p-12 lg:p-20">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--color-secondary-container)]/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[var(--color-primary-fixed)]/30 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center primary-glow">
                <span className="material-symbols-outlined text-[var(--color-primary)] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
              </div>
              <span className="font-heading font-semibold text-2xl text-white tracking-tight">Med Z</span>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Your health, delivered with <span className="text-[var(--color-secondary-container)] underline decoration-[var(--color-secondary-container)]/40 underline-offset-8">precision</span>.
            </h1>
            <p className="font-body text-lg text-[var(--color-primary-fixed)]/80 leading-relaxed">
              Access premium healthcare essentials and consultations from the comfort of your home.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1 border-white/20 transition-transform hover:scale-105 cursor-default">
                <span className="font-heading text-xs font-semibold text-[var(--color-primary-fixed)] uppercase tracking-wider">Trusted By</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-semibold text-white">2M+</span>
                  <span className="font-body text-xs text-[var(--color-secondary-container)]">Active Users</span>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1 border-white/20 transition-transform hover:scale-105 cursor-default">
                <span className="font-heading text-xs font-semibold text-[var(--color-primary-fixed)] uppercase tracking-wider">Fastest</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-semibold text-white">15-min</span>
                  <span className="font-body text-xs text-[var(--color-secondary-container)]">Avg Delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <p className="font-body text-xs text-[var(--color-primary-fixed)]/60">
              Join 5,000+ medical professionals using Med Z.
            </p>
          </div>
        </section>

        {/* Right Panel: Auth Form */}
        <section className="flex-1 flex flex-col justify-center items-center p-4 md:p-12 lg:p-20 bg-[var(--color-surface)] dark:bg-[var(--color-surface)] relative">
          {/* Mobile Logo */}
          <div className="md:hidden absolute top-4 left-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
            </div>
            <span className="font-heading text-2xl font-semibold text-[var(--color-primary)] tracking-tight">Med Z</span>
          </div>

          <div className="w-full max-w-md animate-fade-in">
            <header className="mb-8 text-center md:text-left">
              <h2 className="font-heading font-bold text-3xl text-[var(--color-on-surface)] mb-2">
                {authStep === 'otp' ? 'Verify Email'
                  : authStep === 'login-otp' ? 'Verify Login'
                  : authStep === 'reset-otp' ? 'Reset Code'
                  : authStep === 'new-password' ? 'New Password'
                  : authMode === 'login' ? 'Welcome back'
                  : authMode === 'forgot-password' ? 'Reset Password'
                  : authMode === 'login-otp-entry' ? 'Login with OTP'
                  : 'Create Account'}
              </h2>
              <p className="font-body text-base text-[var(--color-on-surface-variant)]">
                {authStep === 'otp' ? 'Enter the code sent to your email'
                  : authStep === 'login-otp' ? 'Enter the code sent to your email to sign in'
                  : authStep === 'reset-otp' ? 'Enter your password reset code'
                  : authStep === 'new-password' ? 'Choose a new secure password'
                  : authMode === 'login' ? 'Please enter your details to access your account.'
                  : authMode === 'forgot-password' ? 'We\'ll send a reset code to your email.'
                  : authMode === 'login-otp-entry' ? 'Enter your email to receive a login code.'
                  : 'Fill in your details to get started.'}
              </p>
            </header>

            {authSuccessMsg && (
              <div className="bg-[var(--color-secondary-container)]/20 text-[var(--color-secondary)] p-3 rounded-xl text-sm font-medium text-center border border-[var(--color-secondary-container)]/30 mb-4 animate-fade-in">
                {authSuccessMsg}
              </div>
            )}

            {authError && (
              <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-3 rounded-xl text-sm font-medium text-center border border-[var(--color-error)]/20 mb-4 animate-fade-in">
                {authError}
              </div>
            )}

            {/* OTP Verification (Signup) */}
            {authStep === 'otp' ? (
              <form onSubmit={handleVerifyAndSignup} className="space-y-5">
                <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl p-4 text-center">
                  <p className="text-sm text-[var(--color-on-surface-variant)]">We sent a 6-digit code to</p>
                  <p className="text-sm font-bold text-[var(--color-on-surface)] mt-1">{authForm.email}</p>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">verified_user</span>
                  <input type="text" required maxLength={6} inputMode="numeric" pattern="[0-9]{6}" placeholder="Enter 6-digit code" value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] text-center tracking-[0.3em] font-bold text-lg" autoFocus
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98]">
                  Verify & Create Account
                </button>
                <div className="text-center pt-2">
                  {otpCountdown > 0 ? (
                    <p className="text-xs text-[var(--color-outline)] font-medium">Resend code in {otpCountdown}s</p>
                  ) : (
                    <button type="button" onClick={handleSendOtp} disabled={otpSending} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors disabled:opacity-50">
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => { setAuthStep('form'); setOtpCode(''); setAuthError(''); }} className="w-full text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors mt-2">
                  ← Back to signup
                </button>
              </form>

            /* Login OTP Verification (Passwordless) */
            ) : authStep === 'login-otp' ? (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-5 animate-fade-in">
                <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl p-4 text-center">
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Login code sent to</p>
                  <p className="text-sm font-bold text-[var(--color-on-surface)] mt-1">{authForm.email}</p>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">verified_user</span>
                  <input type="text" required maxLength={6} inputMode="numeric" pattern="[0-9]{6}" placeholder="Enter 6-digit code" value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] text-center tracking-[0.3em] font-bold text-lg" autoFocus
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98]">
                  Verify & Sign In
                </button>
                <div className="text-center pt-2">
                  {otpCountdown > 0 ? (
                    <p className="text-xs text-[var(--color-outline)] font-medium">Resend code in {otpCountdown}s</p>
                  ) : (
                    <button type="button" onClick={handleSendLoginOtp} disabled={otpSending} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors disabled:opacity-50">
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => { setAuthStep('form'); setAuthMode('login'); setOtpCode(''); setAuthError(''); }} className="w-full text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors mt-2">
                  ← Back to login
                </button>
              </form>

            ) : authStep === 'reset-otp' ? (
              <form onSubmit={handleVerifyResetOtp} className="space-y-5 animate-fade-in">
                <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl p-4 text-center">
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Reset code sent to</p>
                  <p className="text-sm font-bold text-[var(--color-on-surface)] mt-1">{authForm.email}</p>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">verified_user</span>
                  <input type="text" required maxLength={6} inputMode="numeric" pattern="[0-9]{6}" placeholder="Enter 6-digit code" value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] text-center tracking-[0.3em] font-bold text-lg" autoFocus
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98]">
                  Verify Code
                </button>
                <div className="text-center pt-2">
                  {otpCountdown > 0 ? (
                    <p className="text-xs text-[var(--color-outline)] font-medium">Resend code in {otpCountdown}s</p>
                  ) : (
                    <button type="button" onClick={handleSendResetOtp} disabled={otpSending} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors disabled:opacity-50">
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => { setAuthStep('form'); setOtpCode(''); setAuthError(''); }} className="w-full text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors mt-2">
                  ← Back
                </button>
              </form>
            ) : authStep === 'new-password' ? (
              <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">lock</span>
                  <input type="password" required placeholder="New Password" value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]" autoFocus
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98] mt-4">
                  Save New Password
                </button>
              </form>
            ) : authMode === 'forgot-password' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendResetOtp(); }} className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="reset-email">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                    <input id="reset-email" type="email" required placeholder="name@company.com" value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
                    />
                  </div>
                </div>
                <button type="submit" disabled={otpSending} className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                  {otpSending ? 'Sending...' : 'Send Reset Code'}
                </button>
                <div className="mt-4 text-center">
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccessMsg(''); }} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors">
                    Back to login
                  </button>
                </div>
              </form>

            /* Login with OTP — email entry */
            ) : authMode === 'login-otp-entry' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSendLoginOtp(); }} className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="otp-login-email">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                    <input id="otp-login-email" type="email" required placeholder="name@company.com" value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
                    />
                  </div>
                </div>
                <button type="submit" disabled={otpSending} className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                  {otpSending ? 'Sending OTP...' : 'Send Login Code'}
                </button>
                <div className="mt-4 text-center">
                  <button type="button" onClick={() => { setAuthMode('login'); setAuthStep('form'); setAuthError(''); setAuthSuccessMsg(''); }} className="text-sm font-medium text-[var(--color-primary)] hover:underline transition-colors">
                    Back to password login
                  </button>
                </div>
              </form>

            ) : (
              /* Login / Signup Form */
              <>
                <form onSubmit={handleAuthSubmit} className="space-y-5 animate-fade-in">
                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]">Full Name</label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                        <input type="text" required placeholder="John Doe" value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="login-email">Email Address</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                      <input id="login-email" type="email" required placeholder="name@company.com" value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        className="w-full pl-14 pr-4 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-heading text-sm font-semibold text-[var(--color-on-surface)]" htmlFor="login-password">Password</label>
                      {authMode === 'login' && (
                        <button type="button" onClick={() => { setAuthMode('forgot-password'); setAuthError(''); setAuthSuccessMsg(''); }}
                          className="font-heading text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-on-primary-fixed-variant)] transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline-variant)] group-focus-within:text-[var(--color-primary)] transition-colors">lock</span>
                      <input id="login-password" type="password" required placeholder="••••••••" value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        className="w-full pl-14 pr-14 py-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none font-body text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={otpSending}
                    className="w-full py-4 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-heading font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg primary-glow hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                    {authMode === 'login' ? 'Sign In' : (otpSending ? 'Sending OTP...' : 'Continue')}
                  </button>
                </form>

                {/* Login with OTP link */}
                {authMode === 'login' && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login-otp-entry'); setAuthError(''); setAuthSuccessMsg(''); }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline underline-offset-4 decoration-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontSize: '18px' }}>passkey</span>
                      Login with OTP instead
                    </button>
                  </div>
                )}

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--color-outline-variant)]"></span>
                  </div>
                  <div className="relative flex justify-center text-xs font-body">
                    <span className="bg-[var(--color-surface)] px-4 text-[var(--color-on-surface-variant)] uppercase tracking-widest">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <div className="flex flex-col items-center gap-3">
                  <div ref={googleBtnRef} className="w-full flex justify-center" style={{ minHeight: '44px' }}></div>
                  
                  {/* Fallback Google button if GIS hasn't loaded or no client ID configured */}
                  {(!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') && (
                    <button
                      type="button"
                      onClick={() => setAuthError('Google Sign-In is not configured yet. Please set your Google Client ID in the environment variables.')}
                      className="w-full flex items-center justify-center gap-3 py-3.5 border border-[var(--color-outline-variant)] rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors font-heading text-sm font-semibold text-[var(--color-on-surface)] group cursor-pointer"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                      </svg>
                      Continue with Google
                    </button>
                  )}
                </div>

                <footer className="mt-8 text-center">
                  <p className="font-body text-base text-[var(--color-on-surface-variant)]">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setAuthForm({ name: '', email: '', password: '' });
                      setAuthStep('form');
                      setOtpCode('');
                      setAuthError('');
                    }} className="text-[var(--color-primary)] font-bold hover:underline underline-offset-4 decoration-2">
                      {authMode === 'login' ? 'Sign up for free' : 'Sign in'}
                    </button>
                  </p>
                </footer>
              </>
            )}
          </div>

          <div className="absolute bottom-4 flex gap-6">
            <button 
              onClick={(e) => {
                e.preventDefault();
                alert("Med Z Privacy Policy: Your data security is our priority. We comply with relevant digital healthcare information privacy rules.");
              }}
              className="font-body text-xs text-[var(--color-outline)] hover:text-[var(--color-on-surface-variant)] transition-colors bg-transparent border-0 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                alert("Med Z Terms of Service: By using the Med Z platform, you agree to our digital healthcare delivery and consultation guidelines.");
              }}
              className="font-body text-xs text-[var(--color-outline)] hover:text-[var(--color-on-surface-variant)] transition-colors bg-transparent border-0 cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
