// src/components/MainLayoutRoute.tsx
import { Navigate } from 'react-router-dom';
import { useLayoutMode } from '@/hooks/useLayoutMode';

interface Props {
  children: React.ReactNode;
}

export const MainLayoutRoute = ({ children }: Props) => {
  const { layoutMode } = useLayoutMode();

  if (layoutMode !== 'main') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
