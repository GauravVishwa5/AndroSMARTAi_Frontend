'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeLogin = async (targetEmail: string, targetPass: string, fallbackRedirect = '/branch') => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authApi.login(targetEmail, targetPass);
      if (res.token && res.user) {
        setAuth(res.user, res.token, (res as any).entitlements || res.module_access || {});
        const role = res.user.role || '';
        if ((res.user as any).is_applicant || role.toLowerCase().includes('applicant')) {
          window.location.href = '/applicant/dashboard';
        } else if (res.user.is_admin || role.toLowerCase().includes('admin')) {
          window.location.href = '/admin';
        } else if (role.toLowerCase().includes('legal')) {
          window.location.href = '/legal';
        } else {
          window.location.href = fallbackRedirect;
        }
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err?.response?.data?.detail || err?.message || 'Authentication failed. Please check your email, password, and backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password, '/branch');
  };

  const handleSSO = (provider: string) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    window.location.href = `${API_BASE_URL}/api/sso/${provider}`;
  };

  return (
    <div className="min-h-screen theme-canvas flex flex-col md:flex-row">
      {/* Left Column: Brand & Institutional FinTech Context */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-[#0B0F14] border-r border-slate-800 text-slate-100 relative">
        {/* Logo & Brand Header */}
        <div className="z-10">
          <Logo variant="nobg" size="lg" showBadge={true} subtitle="Legal Due-Diligence & Title Scrutiny Platform" href="/" />
        </div>

        {/* Core Value Highlights */}
        <div className="space-y-6 z-10 max-w-md my-auto">
          <div>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-950/50 text-blue-300 border border-blue-800">
              Institutional Mortgage Due-Diligence
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-3 leading-snug">
              Automated 30-Year Title Search & Legal Scrutiny Architecture.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Engineered for bank legal panels, empanelled advocates, and mortgage credit risk teams. Seamless integration with DORIS & e-Search land registries, automated chain-of-title reconstruction, and 1-click TSR export.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h3 className="text-xs font-bold text-white">Direct Registry Match</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">SRO Index-II & Book-I live records</p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#111827] border border-slate-800">
              <FileCheck2 className="w-5 h-5 text-blue-400 mb-1.5" />
              <h3 className="text-xs font-bold text-white">Instant Title Scrutiny</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated TSR/SCR assembly</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>&copy; 2026 AndroSMARTAi &bull; PVS Platform</span>
          <span className="text-slate-400 text-[11px]">
            Institutional Bank Panel Workstation
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-5">
          {/* Header */}
          <div className="text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
              <Logo variant="nobg" size="md" showBadge={true} href="/" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold theme-text-primary tracking-tight">Sign In to PVS</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your authorized credentials or sign in with enterprise SSO
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Failed</p>
                <p className="text-[11px] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleSSO('google')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-white dark:bg-slate-900 border theme-border text-xs font-medium theme-text-primary transition-colors hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Google SSO</span>
            </button>

            <button
              type="button"
              onClick={() => handleSSO('microsoft')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-white dark:bg-slate-900 border theme-border text-xs font-medium theme-text-primary transition-colors hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft 365</span>
            </button>
          </div>

          <div className="flex items-center gap-3 my-3">
            <div className="h-px theme-border flex-1" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Or institutional credentials
            </span>
            <div className="h-px theme-border flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@axisbank.com"
                  className="w-full theme-input border rounded-md pl-9 pr-3 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#1D4ED8] dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full theme-input border rounded-md pl-9 pr-10 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                className="w-3.5 h-3.5 rounded theme-input text-[#1D4ED8] focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="text-xs text-slate-600 dark:text-slate-400">
                Keep me signed in on this authorized workstation
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-xs shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#1D4ED8] dark:text-blue-400 hover:underline font-medium">
              Create an organization account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
