// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";

const AuthContext = createContext({
  isAuthenticated: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { fetchData: logoutApi } = useApi("/auth/logout", "post", {
    immediate: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout API call failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);
