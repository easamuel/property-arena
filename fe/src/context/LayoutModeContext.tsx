import React, { useState, ReactNode } from 'react';
import { LayoutMode, LayoutModeContextType } from '@/constants';
import { LayoutModeContext } from '@/hooks/useLayoutMode';

export const LayoutModeProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('user');

  const value: LayoutModeContextType = {
    layoutMode,
    setLayoutMode,
  };

  return (
    <LayoutModeContext.Provider value={value}>
      {children}
    </LayoutModeContext.Provider>
  );
};