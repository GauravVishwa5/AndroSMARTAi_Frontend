'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/lib/store/authStore';
import { useThemeStore } from '@/lib/store/themeStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeFromStorage } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeFromStorage();
    initializeTheme();
  }, [initializeFromStorage, initializeTheme]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
