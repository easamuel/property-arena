// src/components/MainLayoutRoute.tsx
import { useEffect, useRef } from 'react';
import { useLayoutMode } from '@/hooks/useLayoutMode';
import { useAuthStore } from '@/store/authStore';

interface Props {
  children: React.ReactNode;
}

const WORKSPACE_ROLES = new Set(['agent', 'developer', 'landlord', 'admin', 'agency']);

/**
 * Workspace pages prefer the sidebar shell for pro accounts on first entry.
 * Never re-forces mode — so the layout switcher can move to marketplace chrome freely.
 */
export const MainLayoutRoute = ({ children }: Props) => {
  const { setLayoutMode } = useLayoutMode();
  const role = String(useAuthStore((s) => s.user?.role) || '').toLowerCase();
  const entered = useRef(false);

  useEffect(() => {
    if (entered.current) return;
    entered.current = true;
    if (WORKSPACE_ROLES.has(role)) {
      setLayoutMode('main');
    }
  }, [role, setLayoutMode]);

  return <>{children}</>;
};
