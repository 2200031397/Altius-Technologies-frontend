// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
// Install with: npm install jwt-decode

const ProtectedRoute = ({ children, roles }) => {
  const token = Cookies.get('authToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const user = jwtDecode(token);
    if (!roles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  } catch (error) {
    console.error('Token validation error:', error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
