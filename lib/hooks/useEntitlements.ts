'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { ModuleKey, SessionAccessScope } from '@/types/auth';

export function useEntitlements() {
  const { user, moduleAccess } = useAuthStore();

  const isSuperAdminOrAdmin = Boolean(
    user?.is_admin ||
    user?.is_superuser ||
    user?.role?.toLowerCase()?.includes('admin') ||
    user?.role?.toLowerCase()?.includes('super') ||
    user?.role?.toLowerCase()?.includes('devops')
  );

  const hasModuleAccess = (module: ModuleKey): boolean => {
    if (isSuperAdminOrAdmin) return true;
    return Boolean(moduleAccess?.[module]?.is_active);
  };

  const getSessionScope = (module: ModuleKey): SessionAccessScope => {
    if (isSuperAdminOrAdmin) return 'global';
    return moduleAccess?.[module]?.session_access || 'personal';
  };

  return {
    user,
    isAdmin: isSuperAdminOrAdmin,
    isSuperAdmin: Boolean(user?.is_superuser || user?.role?.toLowerCase()?.includes('super')),
    hasModuleAccess,
    getSessionScope,
  };
}
