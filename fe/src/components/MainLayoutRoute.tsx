// src/components/MainLayoutRoute.tsx
import { useEffect } from 'react';
import { useLayoutMode } from '@/hooks/useLayoutMode';

interface Props {
  children: React.ReactNode;
}

/** Ensures agent/workspace routes use the sidebar shell — never bounce to home. */
export const MainLayoutRoute = ({ children }: Props) => {
  const { layoutMode, setLayoutMode } = useLayoutMode();

  useEffect(() => {
    if (layoutMode !== 'main') {
      setLayoutMode('main');
    }
  }, [layoutMode, setLayoutMode]);

  return <>{children}</>;
};
