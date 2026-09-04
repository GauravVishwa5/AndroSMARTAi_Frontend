'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Building,
  UserCheck,
  Scale,
  TrendingDown,
  Info,
} from 'lucide-react';
import { CollateralRiskScore, RiskSignal } from '@/types/enterprise';

interface RiskScoreGaugeProps {
  assessment: CollateralRiskScore | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onJumpToFinding?: (findingId?: string | null) => void;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  assessment,
  isLoading = false,
  onRefresh,
  onJumpToFinding,
}) => {
  if (!assessment) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <Scale className="w-8 h-8 mx-auto mb-2 text-slate-400 animate-pulse" />
        <p className="text-sm font-medium">Evaluating Collateral Risk Engine...</p>
      </div>
    );
  }

  const rawScore = assessment.composite_risk_score ?? assessment.risk_score ?? 0;
  const score = typeof rawScore === 'number' && !isNaN(rawScore) ? rawScore : 0;

  // Grade resolver supporting 'A'|'B'|'C'|'D' as well as backend strings 'LOW_RISK', 'MEDIUM_RISK', etc.
  const rawGrade = assessment.grade || assessment.risk_grade || '';
  const resolveGrade = (g: string, s: number): 'A' | 'B' | 'C' | 'D' => {
    const upper = (g || '').toUpperCase();
    if (upper === 'A' || upper.includes('LOW')) return 'A';
    if (upper === 'B' || upper.includes('MEDIUM') || upper.includes('MODERATE')) return 'B';
    if (upper === 'C' || upper.includes('HIGH') || upper.includes('CAUTION')) return 'C';
    if (upper === 'D' || upper.includes('CRITICAL') || upper.includes('IMPAIRED')) return 'D';
    if (s <= 25) return 'A';
    if (s <= 55) return 'B';
    if (s <= 75) return 'C';
    return 'D';
  };
  const grade = resolveGrade(rawGrade, score);

  // Grade styling with guaranteed fallback
  const GRADE_CONFIG = {
    A: {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      label: 'Low Collateral Risk',
      description: 'Clear marketable title with verified registry trace and chain integrity.',
      gaugeStroke: '#10B981',
    },
    B: {
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'Moderate Collateral Risk',
      description: 'Minor procedural defects or secondary document gaps present.',
      gaugeStroke: '#3B82F6',
    },
    C: {
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      label: 'High Collateral Risk',
      description: 'Substantial title defects, tax dues, or adverse encumbrance flagged.',
      gaugeStroke: '#F59E0B',
    },
    D: {
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800',
      label: 'Critical Legal Defect',
      description: 'Broken chain of title, pending litigation, or active statutory attachment.',
      gaugeStroke: '#EF4444',
    },
  };

  const gradeMeta = GRADE_CONFIG[grade] || GRADE_CONFIG['A'];

  // Safe breakdown & signals
  const breakdown = assessment.breakdown || ({} as any);
  const signals = Array.isArray(assessment.signals) ? assessment.signals : [];

  // SVG Gauge calculations (semi-circle / 180 degrees)
  const radius = 68;
  const circumference = Math.PI * radius; // Half circle
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const dimensionCards = [
    {
      title: 'Title Integrity',
      key: 'title_integrity',
      score: breakdown?.title_integrity ?? 0,
      max: 35,
      icon: Scale,
      color: 'text-blue-600',
      desc: 'Chain continuity, devolution, legal ownership',
    },
    {
      title: 'Encumbrance & SRO',
      key: 'encumbrance',
      score: breakdown?.encumbrance ?? 0,
      max: 30,
      icon: Building,
      color: 'text-violet-600',
      desc: 'Registry match, mortgages, lis pendens',
    },
    {
      title: 'Document Chain',
      key: 'documentation',
      score: breakdown?.documentation ?? 0,
      max: 20,
      icon: FileCheck,
      color: 'text-emerald-600',
      desc: 'Sanction plans, tax receipts, originals',
    },
    {
      title: 'Identity & KYC',
      key: 'identity_kyc',
      score: breakdown?.identity_kyc ?? 0,
      max: 15,
      icon: UserCheck,
      color: 'text-cyan-600',
      desc: 'PAN / Aadhaar alignment, alias checks',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Upper Panel: Visual Gauge & Verdict Summary */}
      <div className="p-4 rounded-xl theme-surface border shadow-sm flex flex-col md:flex-row items-center gap-6">
        {/* SVG Gauge */}
        <div className="relative flex flex-col items-center shrink-0">
          <svg width="180" height="110" viewBox="0 0 180 110" className="overflow-visible">
            {/* Background Arc */}
            <path
              d="M 20 100 A 70 70 0 0 1 160 100"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="14"
              strokeLinecap="round"
              className="dark:stroke-slate-700"
            />
            {/* Filled Progress Arc */}
            <path
              d="M 20 100 A 70 70 0 0 1 160 100"
              fill="none"
              stroke={gradeMeta.gaugeStroke}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Centered Score & Grade */}
          <div className="absolute top-12 flex flex-col items-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              / 100 Risk Points
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${gradeMeta.bg} ${gradeMeta.color} border ${gradeMeta.border}`}>
              Grade {grade}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {gradeMeta.label}
            </span>
          </div>
        </div>

        {/* Verdict Details & Executive Summary */}
        <div className="flex-1 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Institutional Risk Determination
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
            {assessment.summary || gradeMeta.description}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on multi-dimensional analysis of registered deeds, encumbrance certificates, survey reports, and automated policy rules.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>0-25: Prime (A)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>26-55: Standard (B)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>56-75: Cautionary (C)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>76-100: Impaired (D)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dimension Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {dimensionCards.map((dim) => {
          const Icon = dim.icon;
          const percentage = Math.round((dim.score / dim.max) * 100);
          return (
            <div
              key={dim.key}
              className="p-3 rounded-lg theme-surface border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {dim.title}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${dim.color} shrink-0`} />
                </div>
                <p className="text-[10px] text-slate-400 truncate mb-2">{dim.desc}</p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {dim.score}
                    <span className="text-[10px] font-normal text-slate-400"> / {dim.max}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {percentage}%
                  </span>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explainable Signals & Risk Penalties Breakdown */}
      {signals && signals.length > 0 && (
        <div className="p-3.5 rounded-xl theme-surface border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              Risk Penalty Breakdown ({signals.length} Signal{signals.length > 1 ? 's' : ''})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Deterministic point deductions
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {signals.map((sig: RiskSignal, idx: number) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 shrink-0">
                    +{sig.penalty} pts
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {sig.reason}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      Code: {sig.code} | {sig.dimension}
                    </span>
                  </div>
                </div>

                {sig.finding_id && onJumpToFinding && (
                  <button
                    onClick={() => onJumpToFinding(sig.finding_id)}
                    className="text-[10px] font-semibold text-blue-600 hover:underline shrink-0 cursor-pointer"
                  >
                    View Finding
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskScoreGauge;
