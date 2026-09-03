'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applicantApi } from '@/lib/api/applicant';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

function ActivationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation rules
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
  const isMatch = password && password === confirmPassword;
  const isFormValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Activation token is missing. Please click the link received in your email.');
      return;
    }
    if (!isFormValid) {
      setError('Please ensure your password meets all security requirements.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await applicantApi.activateAccount(token, password);
      if (res.token?.access_token) {
        localStorage.setItem('andropvs_token', JSON.stringify(res.token));
        localStorage.setItem('andropvs_user', JSON.stringify(res.user));
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/applicant/dashboard');
      }, 1800);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || 'Activation failed. The link may have expired.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Activation Link</h2>
          <p className="text-sm text-slate-400">
            No activation token was detected. Please check the email invitation sent by your branch officer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Activate Application Account</h1>
        <p className="mt-2 text-sm text-slate-400">
          Set a secure password to track your property verification in real time
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-semibold text-white">Account Activated!</h3>
              <p className="text-sm text-slate-400 mt-2">
                Redirecting to your applicant dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Create Password
                </label>
                <div className="relative rounded-xl">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Password criteria checklist */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-400">
                <div className="font-semibold text-slate-300 mb-1">Password Requirements:</div>
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-400' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${hasUpper && hasLower ? 'text-emerald-400' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasUpper && hasLower ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  Uppercase and lowercase letters
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-400' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  At least one number (0-9)
                </div>
                <div className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-400' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${hasSpecial ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  At least one special character (!@#$%^&*)
                </div>
                {confirmPassword && (
                  <div className={`flex items-center gap-2 ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {isMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                {loading ? 'Activating Account...' : 'Set Password & Enter Portal'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplicantActivatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading activation...</div>}>
      <ActivationForm />
    </Suspense>
  );
}
