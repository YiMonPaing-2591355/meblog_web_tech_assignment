import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
