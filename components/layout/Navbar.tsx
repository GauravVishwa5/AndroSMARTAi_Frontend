'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Search, Bell, Shield, LogOut, Building2, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by REQ-#, Owner, CTS No, Property..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Active Branch indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Axis Bank — Andheri West Branch</span>
        </div>

        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-semibold text-xs text-white shadow-md shadow-blue-500/20">
            {user?.first_name ? user.first_name[0] : user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {user?.is_admin ? 'Super Admin' : 'Legal Investigator'}
            </p>
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
