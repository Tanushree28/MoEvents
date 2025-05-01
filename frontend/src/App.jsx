// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Login            from "./components/Login";
import SignUp           from "./components/SignUp";
import AdminDashboard   from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { useAuth }      from "./contexts/AuthContext";

// 🔒 ProtectedRoute now drops users with the wrong role back to “/”
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in → send to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && role !== requiredRole) {
    // Logged in but wrong role → send to home
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            ) : (
              <SignUp />
            )
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            <h1 className="text-center text-3xl mt-10">
              Welcome to MoEvents
            </h1>
          }
        />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
