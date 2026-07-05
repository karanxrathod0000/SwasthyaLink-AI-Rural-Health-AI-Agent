import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  // ✅ For demo: always render children
  // For production: return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  return <>{children}</>;
};
