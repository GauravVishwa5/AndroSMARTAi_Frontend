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
  Users,
  Landmark,
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
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold theme-text-secondary shrink-0">
          <a href="#roles" className="hover:theme-text-primary transition-colors flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>4 Role Portals</span>
          </a>
          <a href="#ai-sro" className="hover:theme-text-primary transition-colors flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini & SRO Engine</span>
          </a>
          <a href="#video-demos" className="hover:theme-text-primary transition-colors flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-current text-blue-500" />
            <span>14 Video Demos</span>
          </a>
          <a href="#features" className="hover:theme-text-primary transition-colors">Features</a>
          <a href="#workflow" className="hover:theme-text-primary transition-colors">How It Works</a>
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
            className="xl:hidden p-2 rounded-xl theme-card border text-slate-600 dark:text-slate-300 hover:text-slate-900 shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-16 sm:top-20 z-30 theme-surface border-b theme-border p-5 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-semibold theme-text-primary">
            <a
              href="#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>4 Role Gateways</span>
            </a>
            <a
              href="#ai-sro"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI & State SRO Engine</span>
            </a>
            <a
              href="#video-demos"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-blue-500" />
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Hero Top Copy */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Institutional Property Due-Diligence & Legal Scrutiny Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold theme-text-primary tracking-tight leading-[1.15]">
            Automated 30-Year Title Search &{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Bank-Standard Legal Clearance.
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Empanelled banking advocate workstation for mortgage title scrutiny. Powered by Google Gemini 2.0 Flash legal extraction, automated cross-referencing against Maharashtra IGR & Delhi DORIS land registries, and 1-click Title Search Report (TSR / LSR) generation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/requests/new"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Verification Request</span>
            </Link>

            <a
              href="#roles"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl theme-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border theme-border shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>4 Role Gateways</span>
            </a>

            <a
              href="#video-demos"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl theme-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border theme-border shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" />
              <span>14 Video Demos</span>
            </a>
          </div>
        </div>

        {/* ── Interactive Live Workspace Simulator ──────────────────── */}
        <div className="rounded-2xl border theme-border theme-surface shadow-lg overflow-hidden">
          {/* Top Window Bar */}
          <div className="border-b theme-border bg-slate-50 dark:bg-slate-950/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-semibold theme-text-secondary ml-2 truncate">
                Case #REQ-7 &bull; Flat 402, Sunshine Heights, Borivali (State Bank of India)
              </span>
            </div>

            {/* Interactive Simulator Tab Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border theme-border text-xs font-semibold overflow-x-auto">
              {[
                { id: 'TIMELINE', label: 'Title Timeline', icon: GitBranch },
                { id: 'OCR', label: 'Gemini OCR Matrix', icon: FileSpreadsheet },
                { id: 'IGR', label: 'SRO Registry Match', icon: Database },
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
                      &bull; SRO Record Verified (Book-I)
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
                    <span>Google Gemini 2.0 Flash Legal OCR Extraction</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">Confidence: 98.4% Match</span>
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
                    <span>State Land Registry (IGR) Cross-Verification</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    SRO Index-II Match (100%)
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
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">NIL Charge (Clear & Marketable)</span>
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
                    <span>Live In-Browser Document Scrutinizer & TSR Editor</span>
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
                    The title of the Mortgagor/Borrower Mr. Rahul Sharma to Flat No 402, Sunshine Heights, Borivali is CLEAR, VALID, MARKETABLE, AND ABSOLUTELY UNENCUMBERED. 1-Click DOCX / PDF export available directly via Amazon S3.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Key Metrics & Institutional Highlights ───────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
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
            <p className="text-[11px] theme-text-muted">Gemini OCR & Legal Extraction</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">12+ Banks</span>
            <p className="text-xs font-semibold theme-text-primary">Official Legal Formats</p>
            <p className="text-[11px] theme-text-muted">SBI, HDFC, Axis, ICICI & PNB</p>
          </div>
        </div>

        {/* ── 4-Role Gateway Section (NEW) ──────────────────────────── */}
        <section id="roles" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Role Lending Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              Dedicated Portals for Every Lending Stakeholder
            </h2>
            <p className="text-xs sm:text-sm theme-text-secondary max-w-xl mx-auto">
              Secure, role-based workflows designed specifically for banking operations, panel advocates, applicants, and risk administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1: Branch Officer */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-blue-500/50 space-y-4 transition-all hover:-translate-y-1 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">Branch Officer</span>
                  <h3 className="text-base font-bold theme-text-primary">Loan Intake & SLA Queue</h3>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  Fast 3-step property intake wizard, property geolocation (Survey & CTS), live case status tracking, and SLA countdowns.
                </p>
                <ul className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Fast Intake Wizard</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Direct S3 File Uploads</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Live Branch SLA Tracker</li>
                </ul>
              </div>
              <Link
                href="/branch"
                className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm"
              >
                <span>Launch Branch Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role 2: Legal Advocate */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-indigo-500/50 space-y-4 transition-all hover:-translate-y-1 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">Panel Advocate</span>
                  <h3 className="text-base font-bold theme-text-primary">Legal Scrutiny Workspace</h3>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  Interactive 30-year devolution tree, 6-point encumbrance matrix, conflict detection, and live in-browser TSR opinion drafting.
                </p>
                <ul className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> 30-Yr Devolution Graph</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Conflict Detection Engine</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> Live Legal TSR Editor</li>
                </ul>
              </div>
              <Link
                href="/legal"
                className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm"
              >
                <span>Open Scrutiny Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role 3: Borrower Portal */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-emerald-500/50 space-y-4 transition-all hover:-translate-y-1 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">Loan Borrower</span>
                  <h3 className="text-base font-bold theme-text-primary">Applicant Self-Service</h3>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  Token-based secure activation, real-time verification milestone progress, deficiency document upload, and zero cross-tenant data leaks.
                </p>
                <ul className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Milestone Tracking</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Deficiency File Upload</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Zero-Token Leakage</li>
                </ul>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/applicant/dashboard"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  <span>Borrower Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/applicant/activate"
                  className="text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Activate New Account
                </Link>
              </div>
            </div>

            {/* Role 4: System Admin */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-amber-500/50 space-y-4 transition-all hover:-translate-y-1 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">Platform Admin</span>
                  <h3 className="text-base font-bold theme-text-primary">Governance & Telemetry</h3>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  Multi-tenant organization management, role entitlements, Gemini API key pool health, and database connection monitoring.
                </p>
                <ul className="text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Multi-Tenant RBAC</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Gemini 7-Key Pool Health</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> System Capacity Audit</li>
                </ul>
              </div>
              <Link
                href="/admin"
                className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-sm"
              >
                <span>Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Gemini AI & State SRO Integration Showcase (NEW) ─────── */}
        <section id="ai-sro" className="p-8 sm:p-12 rounded-3xl theme-surface border shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dual-Engine Verification Core</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              Google Gemini 2.0 AI + State Land Registry Cross-Verification
            </h2>
            <p className="text-xs sm:text-sm theme-text-secondary max-w-2xl mx-auto">
              Combining high-speed bilingual OCR parsing with real-time official SRO government index cross-matching.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Column 1: Google Gemini AI Legal Extraction */}
            <div className="p-6 sm:p-8 rounded-2xl theme-card border space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold theme-text-primary">Google Gemini 2.0 Flash Extraction</h3>
                      <p className="text-[11px] theme-text-muted">Bilingual Devanagari & English Legal Schemas</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono">
                    Multi-Key Pool
                  </span>
                </div>

                <p className="text-xs theme-text-secondary leading-relaxed">
                  Transforms complex legal deeds (Sale Deeds, Release Deeds, Gift Deeds, 7/12 Extracts) into structured JSON with numeric normalization (४१२/अ &rarr; 412/A), confidence scoring, and zero-failover multi-key rotation.
                </p>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5 shadow-inner">
                  <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                    // Gemini 2.0 Parsed Legal Output
                  </div>
                  <p><span className="text-blue-400">"document_type"</span>: <span className="text-emerald-300">"Absolute Sale Deed"</span>,</p>
                  <p><span className="text-blue-400">"property_schedule"</span>: <span className="text-emerald-300">"Flat 402, Sunshine Heights"</span>,</p>
                  <p><span className="text-blue-400">"cts_number"</span>: <span className="text-amber-300">"CTS-589 / Survey 142/3"</span>,</p>
                  <p><span className="text-blue-400">"consideration"</span>: <span className="text-purple-300">8500000.00</span>,</p>
                  <p><span className="text-blue-400">"registration_no"</span>: <span className="text-amber-300">"8472/2020"</span>,</p>
                  <p><span className="text-blue-400">"verification_status"</span>: <span className="text-emerald-400">"VALIDATED_UNENCUMBERED"</span></p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero OpenAI dependency &bull; Multi-Key 429 auto-cooldown</span>
              </div>
            </div>

            {/* Column 2: Government SRO Cross-Verification */}
            <div className="p-6 sm:p-8 rounded-2xl theme-card border space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold theme-text-primary">State SRO Registry Cross-Check</h3>
                      <p className="text-[11px] theme-text-muted">Direct Maharashtra IGR & Delhi DORIS Queries</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono">
                    100% SRO Match
                  </span>
                </div>

                <p className="text-xs theme-text-secondary leading-relaxed">
                  Automatically queries official government Sub-Registrar portals to cross-verify deed numbers, owner names, and transaction dates, verifying that the property has zero prior recorded mortgage charges.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border theme-border bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="theme-text-primary flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-500" /> Maharashtra IGR e-Search
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">Book-I Index-II OK</span>
                    </div>
                    <p className="text-[11px] theme-text-muted">
                      Automated search across Pune, Mumbai, Thane & Nagpur SROs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border theme-border bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="theme-text-primary flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-indigo-500" /> Delhi DORIS Registry
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">Verified Clean</span>
                    </div>
                    <p className="text-[11px] theme-text-muted">
                      Sub-Registrar deed matching across all North, South & Central Delhi districts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Nil Encumbrance Certificate verified &bull; 30-Year Record Search</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 14-Video Demonstration Showcase ──────────────────────── */}
        <DemoVideoGallery />

        {/* ── 6 Core Platform Capabilities ──────────────────────────── */}
        <section id="features" className="space-y-8 pt-4">
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
              <h3 className="text-base font-bold theme-text-primary">Structured Gemini OCR Entity Matrix</h3>
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

            {/* Feature 6: Live Document Scrutinizer & TSR Editor */}
            <div className="p-6 rounded-2xl theme-surface border hover:border-blue-500/50 space-y-3 transition-all hover:-translate-y-1 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold theme-text-primary">Live Document Scrutinizer & TSR Editor</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Live in-browser editing of advocate opinions, instant export to institutional DOCX bank templates, and clean PDF printing via direct S3 delivery.
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
                Drop Sale Deeds, Parent Chain Deeds, 7/12 Extracts, Index-II, and Society NOCs. Direct S3 encrypted storage with SigV4 pre-signing.
              </p>
            </div>

            <div className="p-6 rounded-2xl theme-card border space-y-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold theme-text-primary">Gemini AI & SRO Verification</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Google Gemini 2.0 Flash parses parties, boundaries, and values while automated scripts cross-verify against State IGR indexes.
              </p>
            </div>

            <div className="p-6 rounded-2xl theme-card border space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold theme-text-primary">Export Bank-Ready TSR</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Generate bank-formatted DOCX or printed PDF Title Search Reports with advocate digital signatures delivered directly from S3.
              </p>
            </div>
          </div>
        </section>

        {/* ── Supported Bank Formats ─────────────────────────────────── */}
        <section id="banks" className="space-y-6 text-center pt-2">
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
