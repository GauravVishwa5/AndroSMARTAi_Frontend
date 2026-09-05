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
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-lg p-6 text-center text-slate-200 shadow-2xs">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold mb-1.5">Invalid Activation Link</h2>
          <p className="text-xs text-slate-400">
            No activation token was detected. Please check the email invitation sent by your branch officer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 text-blue-400 mb-3 shadow-2xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Activate Application Account</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Set a secure password to track your property verification in real time
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#111827] border border-slate-800 py-6 px-5 shadow-2xs rounded-lg sm:px-8">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Account Activated</h3>
              <p className="text-xs text-slate-400 mt-1">
                Redirecting to your applicant dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-md text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#0B0F14] border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F14] border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Password criteria checklist */}
              <div className="bg-[#0B0F14] border border-slate-800 rounded-md p-3 space-y-1.5 text-[11px] text-slate-400">
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
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
