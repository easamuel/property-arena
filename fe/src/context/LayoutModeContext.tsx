import React, { useEffect, useState, ReactNode } from 'react';
import { LayoutMode, LayoutModeContextType } from '@/constants';
import { LayoutModeContext } from '@/hooks/useLayoutMode';

const STORAGE_KEY = 'pa-layout-mode';

function readStored(): LayoutMode {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === 'main' || v === 'user') return v;
  } catch {
    /* ignore */
  }
  return 'user';
}

export const LayoutModeProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(readStored);

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    try {
      sessionStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, layoutMode);
    } catch {
      /* ignore */
    }
  }, [layoutMode]);

  const value: LayoutModeContextType = {
    layoutMode,
    setLayoutMode,
  };

  return (
    <LayoutModeContext.Provider value={value}>{children}</LayoutModeContext.Provider>
  );
};
