import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — Guard based on authentication & role
 * @param {string} requiredRole - 'admin' | 'player' | undefined (any authenticated)
 * @param {string} redirectTo - fallback redirect path
 */
export default function ProtectedRoute({ requiredRole, redirectTo = '/login' }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to their appropriate dashboard
    const fallback = role === 'admin' ? '/admin/dashboard' : '/player/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
