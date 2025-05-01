import React, { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import useApi from "../hooks/useApi";

const AuthContext = createContext({
  isAuthenticated: false,
  role: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const { fetchData: logoutApi } = useApi("/auth/logout", "post", {
    immediate: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get the role
        setIsAuthenticated(true);
        setRole(decoded.role); // Set the role from the token
      } catch (err) {
        console.error("Invalid or expired token:", err);
        localStorage.removeItem("token"); // Remove invalid token
        setIsAuthenticated(false);
        setRole(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token); // Decode the token to get the role
    setRole(decoded.role); // Set the role from the token
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setRole(null); // Clear the role on logout
    } catch (err) {
      console.error("Logout API call failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);