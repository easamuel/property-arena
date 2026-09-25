// src/hooks/useRequireAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Returns a function you can call from an event handler.
 * It will redirect to /login if unauthenticated,
 * otherwise it simply invokes your action.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Wrap in useCallback to ensure function stability across renders
  const requireAuth = useCallback((action: () => void) => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else {
      action();
    }
  }, [isAuthenticated, navigate]);

  return requireAuth;
}