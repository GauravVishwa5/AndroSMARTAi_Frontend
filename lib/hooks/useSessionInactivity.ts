'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_TIMEOUT_MS = 14 * 60 * 1000;    // 14 minutes (60s countdown)

export function useSessionInactivity() {
  const { logout, isAuthenticated } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  const warnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = useCallback(() => {
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const triggerLogout = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?reason=inactivity';
    }
  }, [clearAllTimers, logout]);

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    clearAllTimers();
    setShowWarning(false);
    setSecondsRemaining(60);

    // Set 14-minute warning timer
    warnTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsRemaining(60);

      // Start 60-second countdown interval
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            triggerLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIMEOUT_MS);

    // Set 15-minute hard logout timer
    logoutTimerRef.current = setTimeout(() => {
      triggerLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [isAuthenticated, clearAllTimers, triggerLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleUserActivity = () => {
      if (!showWarning) {
        resetInactivityTimer();
      }
    };

    activityEvents.forEach((ev) => window.addEventListener(ev, handleUserActivity));
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearAllTimers();
    };
  }, [isAuthenticated, showWarning, resetInactivityTimer, clearAllTimers]);

  return {
    showWarning,
    secondsRemaining,
    staySignedIn: resetInactivityTimer,
    logoutNow: triggerLogout,
  };
}

export default useSessionInactivity;
