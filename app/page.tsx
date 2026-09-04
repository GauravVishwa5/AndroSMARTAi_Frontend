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
  ShieldAlert,
  Fingerprint,
  TrendingDown,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { DemoVideoGallery } from '@/components/landing/DemoVideoGallery';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, initializeFromStorage } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState<
    'TIMELINE' | 'FINDINGS' | 'RISK_GATE' | 'MAKER_CHECKER' | 'TSR'
  >('TIMELINE');

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
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium theme-text-secondary shrink-0">
          <a href="#pillars" className="hover:theme-text-primary transition-colors flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Platform</span>
          </a>
          <a href="#workflow" className="hover:theme-text-primary transition-colors">
            How It Works
          </a>
          <a href="#banks" className="hover:theme-text-primary transition-colors">
            Bank Standards
          </a>
          <Link
            href="/requests"
            className="hover:theme-text-primary transition-colors flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold"
          >
            <span>Workspace</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Live
            </span>
          </Link>
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
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 z-30 theme-surface border-b theme-border p-5 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium theme-text-primary">
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between"
            >
              <span>Platform</span>
              <ShieldCheck className="w-4 h-4" />
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#banks"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Bank Standards
            </a>
            <Link
              href="/requests"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold"
            >
              <span>Case Workspace</span>
              <ArrowRight className="w-4 h-4" />
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
            <span>Institutional Collateral Intelligence for Banks &amp; NBFCs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold theme-text-primary tracking-tight leading-[1.15]">
            Verify Faster. Detect Risk Earlier.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Disburse with Confidence.
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Bank-grade collateral intelligence platform transforming mortgage title scrutiny into automated, evidence-backed intelligence. Featuring deterministic 0–100 Collateral Risk Scoring, automated Disbursement Readiness Gates with condition precedent extraction, 1-click citation navigation, and dual-control advocate sign-off.
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
              href="#pillars"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl theme-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border theme-border shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>4 Enterprise Pillars</span>
            </a>

            <a
              href="#roles"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl theme-surface hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border theme-border shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>4 Role Gateways</span>
            </a>
          </div>

          {/* Trust Highlights Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>0–100 Explainable Risk Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Maker-Checker Dual Control</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-violet-500" />
              <span>PostgreSQL Append-Only Audit Trail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>State Land Registry Cross-Check</span>
            </div>
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
                { id: 'FINDINGS', label: 'Evidence Findings', icon: ShieldAlert },
                { id: 'RISK_GATE', label: 'Risk & Readiness Gate', icon: ShieldCheck },
                { id: 'MAKER_CHECKER', label: 'Advocate Sign-Off', icon: Award },
                { id: 'TSR', label: 'Bank TSR Report', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeHeroTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHeroTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
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

            {/* Evidence-Backed Findings Matrix View */}
            {activeHeroTab === 'FINDINGS' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Evidence-Backed Findings Matrix (Page-Anchored Citations)</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                      0 Open Critical
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                      1 Pre-Disbursement CP
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      3 Resolved
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3.5 rounded-xl theme-card border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                          RESOLVED
                        </span>
                        <span className="font-bold theme-text-primary">Survey & CTS Sub-Division Alignment</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-semibold border border-blue-500/20">
                        <FileText className="w-3 h-3" /> Sale_Deed_2018.pdf : p.14
                      </span>
                    </div>
                    <p className="text-[11px] theme-text-secondary leading-relaxed">
                      Initial query on CTS 589 vs 589/2 sub-division successfully cured via Supplementary Rectification Deed #1294 registered on 14/02/2026.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl theme-card border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                          CONDITION PRECEDENT
                        </span>
                        <span className="font-bold theme-text-primary">Original Title Document Deposit</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-semibold border border-blue-500/20">
                        <FileText className="w-3 h-3" /> Allotment_1998.pdf : p.1
                      </span>
                    </div>
                    <p className="text-[11px] theme-text-secondary leading-relaxed">
                      Borrower to deposit original registered Parent Allotment Deed dated 12/03/1998 into physical branch custody prior to loan disbursement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Collateral Risk Score & Disbursement Readiness Gate View */}
            {activeHeroTab === 'RISK_GATE' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>0–100 Collateral Risk Engine &amp; Disbursement Gate</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 w-fit">
                    Score: 18 / 100 &bull; Grade A (Prime Marketable)
                  </span>
                </div>

                {/* 4 Dimension Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl theme-card border space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Title Integrity</span>
                    <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">35 / 35</div>
                    <p className="text-[10px] theme-text-muted">Unbroken 30-year genealogy</p>
                  </div>
                  <div className="p-3 rounded-xl theme-card border space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Encumbrance & SRO</span>
                    <div className="text-base font-extrabold text-violet-600 dark:text-violet-400">30 / 30</div>
                    <p className="text-[10px] theme-text-muted">Zero adverse registry charges</p>
                  </div>
                  <div className="p-3 rounded-xl theme-card border space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Document Chain</span>
                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">18 / 20</div>
                    <p className="text-[10px] theme-text-muted">Parent deed certified copy ok</p>
                  </div>
                  <div className="p-3 rounded-xl theme-card border space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Identity & KYC</span>
                    <div className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">15 / 15</div>
                    <p className="text-[10px] theme-text-muted">PAN / Aadhaar exact match</p>
                  </div>
                </div>

                {/* Gate Indicator */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      <strong>Gate Status: CONDITIONAL DISBURSEMENT</strong> &mdash; 1 Pre-Disbursement Condition Precedent (CP) required prior to loan drawdown.
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 font-bold text-[10px] uppercase font-mono shrink-0">
                    CP-1 Active
                  </span>
                </div>
              </div>
            )}

            {/* Dual-Control Advocate Review View */}
            {activeHeroTab === 'MAKER_CHECKER' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold theme-text-primary flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span>Dual-Control Legal Review &amp; Tamper-Evident Digital Seal</span>
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 w-fit">
                    Section 24 Dual Sign-Off Complete
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Maker Card */}
                  <div className="p-3.5 rounded-xl theme-card border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Investigating Advocate (Maker)</span>
                      <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">BCI: D/1420/2012</span>
                    </div>
                    <p className="font-bold theme-text-primary text-sm">Adv. Suresh Verma</p>
                    <p className="text-[11px] theme-text-secondary italic">
                      &ldquo;Title verified continuous and marketable from 1998 to 2026. Approved subject to physical deposit of allotment original.&rdquo;
                    </p>
                  </div>

                  {/* Checker Card */}
                  <div className="p-3.5 rounded-xl theme-card border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Senior Counsel (Checker)</span>
                      <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Approved</span>
                    </div>
                    <p className="font-bold theme-text-primary text-sm">Adv. Ananya Iyer (Senior Partner)</p>
                    <p className="text-[11px] theme-text-secondary italic">
                      &ldquo;Concur with findings. Collateral cleared for mortgage sanction. Conditions precedent logged in credit gate.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Digital Seal Digest */}
                <div className="p-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Fingerprint className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-slate-400">SHA-256 Digital Seal:</span>
                    <span className="text-slate-200 truncate">9f8e7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f7a8b9c0d1e2f3a4b5c6d7e8f</span>
                  </div>
                  <span className="text-emerald-400 font-bold shrink-0 ml-2">VERIFIED UNTAMPERED</span>
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
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">0 – 100</span>
            <p className="text-xs font-semibold theme-text-primary">Deterministic Risk Score</p>
            <p className="text-[11px] theme-text-muted">Explainable 4-dimension model</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100% SRO</span>
            <p className="text-xs font-semibold theme-text-primary">Registry Cross-Verification</p>
            <p className="text-[11px] theme-text-muted">Maharashtra e-Search &amp; Delhi DORIS</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">1-Click</span>
            <p className="text-xs font-semibold theme-text-primary">Verifiable Citation Jump</p>
            <p className="text-[11px] theme-text-muted">Page-anchored deed evidence</p>
          </div>

          <div className="p-5 rounded-2xl theme-surface border text-center space-y-1 shadow-xs">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">Dual-Control</span>
            <p className="text-xs font-semibold theme-text-primary">Maker-Checker Governance</p>
            <p className="text-[11px] theme-text-muted">Bar Council ID &amp; SHA-256 seal</p>
          </div>
        </div>

        {/* ── 4 Institutional Pillars of Collateral Intelligence ─────── */}
        <section id="pillars" className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Product Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold theme-text-primary">
              The 4 Pillars of Bank-Grade Collateral Intelligence
            </h2>
            <p className="text-xs sm:text-sm theme-text-secondary max-w-2xl mx-auto">
              Engineered to replace subjective legal scrutiny with verifiable evidence, deterministic risk scoring, automated disbursement gates, and dual-control sign-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl theme-surface border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 transition-all space-y-4 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  PILLAR 1
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary">
                  Evidence-Backed Findings &amp; 1-Click Citation Jump
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Verbatim Source Anchoring
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every title break, survey subdivision mismatch, and encumbrance defect is converted into a canonical finding anchored to the exact deed page and text snippet. Reviewers verify findings in one click with zero manual searching.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Page-level canvas highlight &amp; in-place advocate waiver notes</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl theme-surface border border-slate-200 dark:border-slate-800/80 hover:border-violet-500/50 transition-all space-y-4 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold border border-violet-500/20">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  PILLAR 2
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary">
                  Deterministic 0–100 Collateral Risk Engine
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Explainable Multi-Dimension Scoring
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes a mathematically reproducible risk score across Title Integrity (/35), Encumbrance &amp; Registry (/30), Document Chain (/20), and Identity &amp; KYC (/15). Every deduction provides an exact explainability trail with zero black-box hallucination.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Grade A/B/C/D classification with tenant policy weight overrides</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl theme-surface border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all space-y-4 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  PILLAR 3
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary">
                  Automated Disbursement Readiness Gate
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Machine-Readable Conditions Precedent (CP)
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eliminates credit committee bottlenecks with automated readiness status: READY (clean clear title), CONDITIONAL (actionable CPs required before loan drawdown), or BLOCKED (fatal title or statutory attachment blocker).
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct LOS/LMS integration readiness for instantaneous sanctioning</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl theme-surface border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4 shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  PILLAR 4
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary">
                  Dual-Control Advocate Sign-off &amp; SHA-256 Seal
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Section 24 Maker-Checker Governance
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enforces institutional separation of duties. Empaneled Advocate (Maker) records Bar Council ID and submits preliminary opinion; Senior Counsel (Checker) validates title conditions and seals with a tamper-evident SHA-256 digital digest.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Enforced by PostgreSQL append-only immutability database triggers</span>
              </div>
            </div>
          </div>
        </section>

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
            <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-90 group-hover:h-1.5 transition-all" />

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-500/20 shadow-xs group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Intake SLA
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">Role 1: Bank Maker</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Branch Officer
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loan Intake & SLA Queue</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fast 3-step loan property intake wizard, CTS / Survey geolocation, direct S3 collateral uploads, and real-time branch SLA countdowns.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>3-Step Intake Wizard</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Direct Encrypted S3 Uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Branch SLA Countdown Watch</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href="/branch"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 cursor-pointer"
                >
                  <span>Launch Branch Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Role 2: Legal Advocate */}
            <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-90 group-hover:h-1.5 transition-all" />

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20 shadow-xs group-hover:scale-105 transition-transform">
                    <Scale className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Scrutiny Ready
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">Role 2: Legal Checker</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Panel Advocate
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Legal Scrutiny Workspace</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Interactive 30-year devolution tree, 6-point encumbrance matrix, conflict detector, and live in-browser TSR opinion drafting.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>30-Yr Devolution Graph</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Conflict Detection Engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Live In-Browser TSR Editor</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href="/legal"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 cursor-pointer"
                >
                  <span>Open Scrutiny Queue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Role 3: Borrower Portal */}
            <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-90 group-hover:h-1.5 transition-all" />

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Self-Service
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">Role 3: Borrower</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Loan Borrower
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applicant Self-Service Portal</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Token-based secure activation, real-time 4-milestone legal progress tracking, deficiency document upload, and zero cross-tenant data leaks.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>4-Milestone Progress Tracker</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Deficiency Document Upload</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Encrypted Zero-Token Leakage</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2 space-y-2">
                <Link
                  href="/applicant/dashboard"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 cursor-pointer"
                >
                  <span>Borrower Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/applicant/activate"
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] transition-colors"
                >
                  <span>🔑 Activate Account via Token</span>
                </Link>
              </div>
            </div>

            {/* Role 4: System Admin */}
            <div className="group relative p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/60 dark:hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between overflow-hidden">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-90 group-hover:h-1.5 transition-all" />

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 shadow-xs group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    7-Key Pool 100%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">Role 4: Governance</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Platform Admin
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Governance & Telemetry</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Multi-tenant RBAC organization management, role entitlements, Gemini 7-key failover pool health, and database connection telemetry.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Multi-Tenant RBAC & Orgs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Gemini 7-Key Pool Health</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>System Capacity & DB Telemetry</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition-all shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/30 cursor-pointer"
                >
                  <span>Admin Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
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
