import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem('userRole');

  if (!allowedRoles.includes(userRole)) {
    // Redirect to a "Unauthorized" page or the login page
    return <Navigate to="/unauthorized" />; // You'll need to create an Unauthorized component
  }

  return children;
}

export default ProtectedRoute;