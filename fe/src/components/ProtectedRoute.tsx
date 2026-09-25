// src/components/ProtectedRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  /** When set, only users with this role may proceed */
  requireRole?: string | string[];
}

export function ProtectedRoute({
  children,
  fallback = null,
  requireRole,
}: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole) {
    const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
    const role = (user?.role || '').toLowerCase();
    if (!allowed.map((r) => r.toLowerCase()).includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
