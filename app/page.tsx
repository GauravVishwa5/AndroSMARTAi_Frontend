'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Building2,
  ShieldCheck,
  FileCheck2,
  Database,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  Lock,
  ChevronRight,
  Layers,
  Cpu,
  CheckCircle2,
  GitBranch,
  FileSpreadsheet,
  Camera,
  AlertTriangle,
  Download,
  Search,
  Scale,
  Menu,
  X,
  ExternalLink,
  Award,
  Zap,
  Globe,
  Play,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { DemoVideoGallery } from '@/components/landing/DemoVideoGallery';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, initializeFromStorage } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState<'TIMELINE' | 'OCR' | 'IGR' | 'TSR'>('TIMELINE');

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  const userRole = user?.role?.toLowerCase() || '';
  const isSuperAdmin = user?.is_admin || userRole.includes('admin') || user?.username === 'admin';
  const isLegalUser = userRole.includes('legal');
  const dashboardHref = isSuperAdmin ? '/admin' : isLegalUser ? '/legal' : '/branch';
  const dashboardLabel = isSuperAdmin ? 'Admin Console' : isLegalUser ? 'Legal Scrutiny' : 'Branch Dashboard';
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || (isSuperAdmin ? 'System Admin' : 'User');
  const userInitial = user?.first_name?.[0] || user?.username?.[0]?.toUpperCase() || (isSuperAdmin ? 'A' : 'U');

  return (
    <div className="min-h-screen theme-canvas flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* ── Top Header Navigation ─────────────────────────────────── */}
      <header className="h-16 sm:h-20 border-b theme-border theme-surface backdrop-blur-xl px-3 sm:px-8 lg:px-12 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Logo variant="nobg" size="md" showBadge={true} subtitle="Property Verification & Due-Diligence" href="/" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold theme-text-secondary shrink-0">
          <a href="#video-demos" className="hover:theme-text-primary transition-colors flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>14 Video Demos</span>
          </a>
          <a href="#features" className="hover:theme-text-primary transition-colors">Features</a>
          <a href="#workflow" className="hover:theme-text-primary transition-colors">How It Works</a>
          <a href="#igr-coverage" className="hover:theme-text-primary transition-colors">State IGR Registries</a>
          <a href="#banks" className="hover:theme-text-primary transition-colors">Bank Templates</a>
          <Link href="/requests" className="hover:theme-text-primary transition-colors">Workspace</Link>
        </nav>

        {/* CTA Buttons & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Authenticated User Pill */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl theme-card border text-xs leading-tight">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white shadow-xs">
                  {userInitial}
                </div>
                <div className="text-left">
                  <p className="font-semibold theme-text-primary truncate max-w-[110px]">{displayName}</p>
                  <p className="text-[9px] text-slate-400 font-mono capitalize">
                    {user?.role || (isSuperAdmin ? 'Admin' : 'Officer')}
                  </p>
                </div>
              </div>

              {/* Primary Dashboard Link */}
              <Link
                href={dashboardHref}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>{dashboardLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Launch Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl theme-card border text-slate-600 dark:text-slate-300 hover:text-slate-900 shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 z-30 theme-surface border-b theme-border p-5 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-semibold theme-text-primary">
            <a
              href="#video-demos"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>14 Video Demonstration Series</span>
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Core Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              3-Step Workflow
            </a>
            <a
              href="#igr-coverage"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              State IGR Registries
            </a>
            <a
              href="#banks"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Institutional Bank Formats
            </a>
            <Link
              href="/requests"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Active Workspace Cases
            </Link>
          </nav>

          <div className="pt-3 border-t theme-border flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold theme-text-primary">{displayName}</span>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md"
                >
                  {dashboardLabel}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400"
                >
                  Sign In to Account
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md"
                >
                  Launch Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Main Hero Section ─────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
        {/* Hero Top Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Next-Gen AI Legal Title Verification & Search Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold theme-text-primary tracking-tight leading-[1.15]">
            Institutional Property Title Clearances & TSR Reports in{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">
              Minutes, Not Weeks.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg theme-text-secondary leading-relaxed max-w-2xl mx-auto">
            Automated 30-year chain of title devolution, direct online cross-verification against Maharashtra & Delhi IGR registries, high-precision OCR extraction, and 1-click bank-formatted Title Search Reports (TSR / LSR).
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/requests/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Verification Request</span>
            </Link>

            <a
              href="#video-demos"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95 border border-slate-700"
            >
              <Play className="w-4 h-4 text-blue-400 fill-current" />
              <span>Watch 14 Video Demos</span>
            </a>

            <Link
              href="/requests/7"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl theme-card border hover:border-blue-500 theme-text-primary font-semibold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Explore Workspace</span>
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </Link>
          </div>
        </div>

        {/* ── Interactive Live Workspace Simulator ──────────────────── */}
        <div className="rounded-3xl border theme-border theme-surface shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Window Bar */}
          <div className="border-b theme-border bg-slate-50 dark:bg-slate-950/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-semibold theme-text-secondary ml-2 truncate">
                Case #REQ-3 &bull; Flat 402, Sunshine Heights, Borivali (State Bank of India)
              </span>
            </div>

            {/* Interactive Simulator Tab Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border theme-border text-xs font-semibold overflow-x-auto">
              {[
                { id: 'TIMELINE', label: 'Title Timeline', icon: GitBranch },
                { id: 'OCR', label: 'OCR Data Grid', icon: FileSpreadsheet },
                { id: 'IGR', label: 'IGR Search', icon: Database },
                { id: 'TSR', label: 'Live TSR Editor', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeHeroTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHeroTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulator Content Area */}
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/40">
            {/* Timeline View */}
            {activeHeroTab === 'TIMELINE' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-500" />
                    <span>30-Year Chain of Title Devolution Graph</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Unbroken Chain Intact</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl theme-card border space-y-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                      1998 &bull; Doc #1249
                    </span>
                    <h4 className="text-xs font-bold theme-text-primary">Parent Allotment Deed</h4>
                    <p className="text-[11px] theme-text-secondary">
                      Society Authority &rarr; <strong className="theme-text-primary">Sunil K. Sharma</strong>
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      &bull; SRO Record Verified
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl theme-card border border-emerald-500/30 space-y-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                      2020 &bull; Doc #8472
                    </span>
                    <h4 className="text-xs font-bold theme-text-primary">Absolute Registered Sale Deed</h4>
                    <p className="text-[11px] theme-text-secondary">
                      Sunil K. Sharma &rarr; <strong className="text-emerald-600 dark:text-emerald-400">Mr. Rahul Sharma</strong>
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      &bull; Consideration: Rs. 85,00,000/-
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
                      2026 &bull; Doc #4589
                    </span>
                    <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Proposed Primary Mortgage</h4>
                    <p className="text-[11px] theme-text-secondary">
                      Mr. Rahul Sharma &rarr; <strong className="text-indigo-600 dark:text-indigo-300">State Bank of India</strong>
                    </p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                      &bull; Sanction: Rs. 75,00,000/-
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* OCR Extractor View */}
            {activeHeroTab === 'OCR' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                    <span>Real-Time OCR Extracted Parameters</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">Confidence: 98.4% Match</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl theme-card border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Borrower Name</span>
                    <p className="font-bold theme-text-primary">Mr. Rahul Sharma</p>
                  </div>
                  <div className="p-3.5 rounded-xl theme-card border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lender Bank</span>
                    <p className="font-bold theme-text-primary">State Bank of India</p>
                  </div>
                  <div className="p-3.5 rounded-xl theme-card border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Property Schedule</span>
                    <p className="font-bold theme-text-primary truncate">Flat 402, Sunshine Heights</p>
                  </div>
                  <div className="p-3.5 rounded-xl theme-card border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">CTS / Survey</span>
                    <p className="font-bold theme-text-primary font-mono">CTS No 589 / Sur. 142/3</p>
                  </div>
                </div>
              </div>
            )}

            {/* IGR Search View */}
            {activeHeroTab === 'IGR' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span>State Sub-Registrar (IGR) Cross-Verification</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    SRO Index Match (100%)
                  </span>
                </div>

                <div className="p-4 rounded-xl theme-card border text-xs space-y-2.5">
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Registration Reference:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">Doc #4589/2026 (Book-I)</span>
                  </div>
                  <div className="flex justify-between border-b theme-border pb-2">
                    <span className="theme-text-secondary">Owner in SRO Records:</span>
                    <span className="font-bold theme-text-primary">Mr. Rahul Sharma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-secondary">Encumbrance Finding:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">NIL Charge (Clear & Free)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TSR Document View */}
            {activeHeroTab === 'TSR' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-500" />
                    <span>Institutional Bank Title Search Report (TSR)</span>
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Format: State Bank of India
                  </span>
                </div>

                <div className="p-4 rounded-xl theme-card border text-xs leading-relaxed space-y-2">
                  <p className="font-semibold theme-text-primary">
                    1. Professional Legal Opinion:
                  </p>
                  <p className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-medium">
                    The title of the Mortgagor/Borrower Mr. Rahul Sharma to Flat No 402, Sunshine Heights, Borivali is CLEAR, VALID, MARKETABLE, AND ABSOLUTELY UNENCUMBERED.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Key Metrics & Institutional Highlights ───────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">30 Years</span>
            <p className="text-xs font-semibold theme-text-primary">Chain of Title Trace</p>
            <p className="text-[11px] theme-text-muted">Unbroken ownership genealogy</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100% SRO</span>
            <p className="text-xs font-semibold theme-text-primary">Registry Cross-Verification</p>
            <p className="text-[11px] theme-text-muted">Maharashtra e-Search & Delhi DORIS</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">&lt; 3 Mins</span>
            <p className="text-xs font-semibold theme-text-primary">Automated Turnaround</p>
            <p className="text-[11px] theme-text-muted">OCR & Legal Extraction</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">12+ Banks</span>
            <p className="text-xs font-semibold theme-text-primary">Official Legal Formats</p>
            <p className="text-[11px] theme-text-muted">SBI, HDFC, Axis, ICICI & PNB</p>
          </div>
        </div>

        {/* ── 14-Video Demonstration Showcase ──────────────────────── */}
        <DemoVideoGallery />

        {/* ── 6 Core Platform Capabilities ──────────────────────────── */}
        <section id="features" className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              Engineered for Bank Panel Advocates & Risk Teams
            </h2>
            <p className="text-xs sm:text-sm theme-text-secondary max-w-xl mx-auto">
              Everything required to scrutinize title deeds, verify state land records, and draft institutional title opinions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-blue-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">30-Year Title Devolution Graph</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Automatically builds sequential ownership genealogy from parent master allotment to current mortgagor, detecting continuity gaps instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-indigo-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">Structured OCR Entity Matrix</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Extracts parties, CTS numbers, consideration amounts, and registration dates with confidence scores and inline advocate verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-emerald-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">Automated State IGR Search</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Connects directly to Maharashtra IGR and Delhi DORIS portals to query Book-I registers, cross-matching owners and prior charges.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-amber-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">Geotagged Field Site Survey</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Capture site photographs with locked GPS coordinates, perform four-side boundary reconciliation, and record occupancy findings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-red-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">6-Point Encumbrance Matrix</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Automated legal audit checking KYC match, prior mortgage liens, court lis pendens, tax clearance, and circle rate valuations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-blue-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">TSR / Live Legal Editor</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Live in-browser editing of advocate opinions, instant export to institutional DOCX bank templates, and clean PDF printing.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3-Step Workflow ───────────────────────────────────────── */}
        <section id="workflow" className="p-8 sm:p-12 rounded-3xl theme-surface border shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              How the Title Due-Diligence Engine Works
            </h2>
            <p className="text-xs sm:text-sm theme-text-secondary">
              End-to-end legal title clearance pipeline in 3 streamlined steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl theme-card border space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold theme-text-primary">Upload Property Documents</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Drop Sale Deeds, Parent Chain Deeds, 7/12 Extracts, Index-II, and Society NOCs. Direct S3 encrypted storage.
              </p>
            </div>

            <div className="p-6 rounded-2xl theme-card border space-y-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold theme-text-primary">AI Extraction & SRO Check</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                High-speed OCR parses parties, boundaries, and values while automated scripts cross-verify against State IGR indexes.
              </p>
            </div>

            <div className="p-6 rounded-2xl theme-card border space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold theme-text-primary">Export Bank-Ready TSR</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Generate bank-formatted DOCX or printed PDF Title Search Reports with advocate digital signatures.
              </p>
            </div>
          </div>
        </section>

        {/* ── Supported Bank Formats ─────────────────────────────────── */}
        <section id="banks" className="space-y-6 text-center pt-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Institutional Bank Template Compliance
            </h3>
            <p className="text-sm font-semibold theme-text-primary">
              Pre-configured format templates for India's leading financial institutions
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'State Bank of India (SBI)',
              'HDFC Bank',
              'Axis Bank',
              'ICICI Bank',
              'Punjab National Bank',
              'DCB Bank',
              'Deutsche Bank',
              'Avanse Financial',
              'L&T Finance',
              'Karur Vysya Bank',
            ].map((bank) => (
              <span
                key={bank}
                className="px-4 py-2 rounded-xl theme-surface border text-xs font-semibold theme-text-secondary shadow-2xs hover:border-blue-500 transition-colors"
              >
                {bank}
              </span>
            ))}
          </div>
        </section>

        {/* ── Direct Workspace Quick Launchpad ──────────────────────── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Ready to process title verification requests?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Access the legal scrutiny queue, manage branch submissions, or view active cases.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/branch"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 shadow-md transition-all active:scale-95"
            >
              Branch Dashboard
            </Link>
            <Link
              href="/legal"
              className="px-5 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white border border-white/20 text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Legal Scrutiny Queue
            </Link>
          </div>
        </div>
      </main>

      {/* ── Responsive Footer ─────────────────────────────────────── */}
      <footer className="border-t theme-border theme-surface px-4 sm:px-8 lg:px-12 py-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs theme-text-muted text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Logo variant="nobg" size="sm" showBadge={false} href="/" />
            <span>&bull; &copy; 2026 PVS Platform. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium theme-text-secondary">
            <Link href="/requests" className="hover:theme-text-primary">Workspace</Link>
            <Link href="/requests/search" className="hover:theme-text-primary">IGR Search</Link>
            <Link href="/legal" className="hover:theme-text-primary">Legal Scrutiny</Link>
            <Link href="/admin" className="hover:theme-text-primary">System Health</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
