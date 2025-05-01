// frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { token, role: userRole } = useAuth();

  if (!token)               return <Navigate to="/login" />;
  if (userRole !== role)    return <Navigate to="/unauthorized" />;
  return children;
}
