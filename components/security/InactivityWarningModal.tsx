'use client';

import React from 'react';
import { ShieldAlert, Clock, LogOut, CheckCircle } from 'lucide-react';
import { useSessionInactivity } from '@/lib/hooks/useSessionInactivity';

export function InactivityWarningModal() {
  const { showWarning, secondsRemaining, staySignedIn, logoutNow } = useSessionInactivity();

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-2xl theme-surface border shadow-2xl space-y-5 animate-scaleUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold theme-text-primary">Banking Inactivity Auto-Lock</h3>
            <p className="text-xs theme-text-secondary">Security policy: 15-minute idle limit</p>
          </div>
        </div>

        <div className="p-4 rounded-xl theme-card border text-center space-y-2">
          <p className="text-xs theme-text-secondary">
            Your session has been idle. For compliance and data protection, you will be automatically logged out in:
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-lg">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={logoutNow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl theme-card border text-xs font-semibold theme-text-primary hover:text-red-500 hover:border-red-500/50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Now</span>
          </button>
          <button
            type="button"
            onClick={staySignedIn}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Stay Signed In</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InactivityWarningModal;
