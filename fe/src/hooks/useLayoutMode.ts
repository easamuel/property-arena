import { createContext, useContext } from 'react';
import { LayoutModeContextType } from '@/constants';

export const LayoutModeContext = createContext<LayoutModeContextType | undefined>(undefined);

export const useLayoutMode = (): LayoutModeContextType => {
  const context = useContext(LayoutModeContext);
  if (!context) {
    throw new Error('useLayoutMode must be used within a LayoutModeProvider');
  }
  return context;
};