// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";

// 1) Update default shape to include token & role
const AuthContext = createContext({
  token: null,
  role: null,
  isAuthenticated: false,
  login: (data) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  // 2) Keep token & role in state, initialize from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole]   = useState(() => localStorage.getItem("role"));
  const { fetchData: logoutApi } = useApi("/auth/logout", "post", {
    immediate: false,
  });

  // 3) Sync token from localStorage on mount (optional if you want refresh)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  // 4) login() now expects an object with both token and role
  const login = ({ token: newToken, role: newRole }) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setToken(null);
      setRole(null);
    } catch (error) {
      console.error("Logout API call failed", error);
    }
  };

  const isAuthenticated = Boolean(token && role); // Check if both token and role exist

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5) Hook remains the same
export const useAuth = () => useContext(AuthContext);
