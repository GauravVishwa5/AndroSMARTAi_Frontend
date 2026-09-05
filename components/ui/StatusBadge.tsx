'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  RotateCw,
  HelpCircle,
} from 'lucide-react';

export type StatusType =
  | 'verified'
  | 'clear'
  | 'pending'
  | 'warning'
  | 'caution'
  | 'critical'
  | 'rejected'
  | 'in-progress'
  | 'in_progress'
  | 'resolved'
  | 'human-verified'
  | 'neutral';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = 'sm',
  showIcon = true,
  className = '',
}: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().replace(/_/g, '-');

  let config: {
    bg: string;
    border: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultLabel: string;
  } = {
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    icon: HelpCircle,
    defaultLabel: 'Unknown',
  };

  switch (normalized) {
    case 'verified':
    case 'clear':
      config = {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        text: 'text-emerald-800 dark:text-emerald-300',
        icon: CheckCircle2,
        defaultLabel: 'Verified',
      };
      break;

    case 'human-verified':
      config = {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-300 dark:border-emerald-700',
        text: 'text-emerald-800 dark:text-emerald-300 font-semibold',
        icon: ShieldCheck,
        defaultLabel: 'Human Verified',
      };
      break;

    case 'pending':
      config = {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-800/60',
        text: 'text-amber-800 dark:text-amber-300',
        icon: Clock,
        defaultLabel: 'Pending Scrutiny',
      };
      break;

    case 'warning':
    case 'caution':
      config = {
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-200 dark:border-yellow-800/60',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: AlertTriangle,
        defaultLabel: 'Warning',
      };
      break;

    case 'critical':
    case 'rejected':
    case 'encumbered':
      config = {
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        border: 'border-rose-200 dark:border-rose-800/60',
        text: 'text-rose-800 dark:text-rose-300 font-semibold',
        icon: AlertOctagon,
        defaultLabel: 'Critical Flag',
      };
      break;

    case 'in-progress':
      config = {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800/60',
        text: 'text-blue-800 dark:text-blue-300',
        icon: RotateCw,
        defaultLabel: 'In Progress',
      };
      break;

    case 'resolved':
      config = {
        bg: 'bg-slate-100 dark:bg-slate-800/60',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        icon: ShieldCheck,
        defaultLabel: 'Resolved',
      };
      break;

    default:
      config = {
        bg: 'bg-slate-100 dark:bg-slate-800',
        border: 'border-slate-300 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        icon: HelpCircle,
        defaultLabel: label || status,
      };
  }

  const Icon = config.icon;
  const displayText = label || config.defaultLabel;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded border font-medium leading-tight select-none ${config.bg} ${config.border} ${config.text} ${sizeClasses} ${className}`}
      role="status"
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />}
      <span>{displayText}</span>
    </span>
  );
}

export default StatusBadge;

