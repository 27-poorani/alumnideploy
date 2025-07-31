import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and doesn't match, redirect to appropriate page
  if (requiredRole && role !== requiredRole) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'alumni') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute; 