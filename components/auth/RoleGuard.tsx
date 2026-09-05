'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  fallbackUrl?: string;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  fallbackUrl = '/branch',
  children,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();

  const userRole = (user?.role || '').toLowerCase();
  const isSuperAdminOrAdmin = Boolean(
    user?.is_admin ||
    user?.is_superuser ||
    userRole.includes('admin') ||
    userRole.includes('super') ||
    userRole.includes('devops')
  );

  const hasAccess =
    isSuperAdminOrAdmin ||
    allowedRoles.some((role) => userRole.includes(role.toLowerCase()));

  if (!hasAccess && isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl theme-surface border shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold theme-text-primary">Restricted Authorization Module</h2>
          <p className="text-xs theme-text-secondary mt-1">
            Your current role (<strong className="theme-text-primary">{userRole || 'Standard User'}</strong>) does not have entitlement permissions to access this administrative view.
          </p>
        </div>

        <div className="p-3 rounded-xl theme-card border text-[11px] theme-text-muted font-mono">
          Required Role: {allowedRoles.join(' or ')}
        </div>

        <div className="pt-2">
          <Link
            href={fallbackUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Safe Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;
