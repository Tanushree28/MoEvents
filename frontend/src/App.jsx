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
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard"; // 👈 import student dashboard
import { useAuth } from "./contexts/AuthContext";

// 🔒 Route wrapper for admin
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <SignUp />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Student Dashboard route */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Default Route */}
        <Route path="/" element={<h1 className="text-center text-3xl mt-10">Welcome to MoEvents</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
