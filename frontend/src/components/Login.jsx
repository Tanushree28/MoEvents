import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css";
import logow from "../assets/logo.png";
import Button from "./atoms/button";
import jwtDecode from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { fetchData } = useApi("/auth/login", "post", { immediate: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await fetchData({ username, password });
      if (data?.token) {
        login(data.token);
        const decoded = jwtDecode(data.token); // Decode the token to get the role
        if (decoded.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (decoded.role === "student") {
          navigate("/student/dashboard", { replace: true });
        } else {
          setErrorMessage("Invalid role. Please contact support.");
        }
      } else {
        setErrorMessage("Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Invalid credentials or server error.");
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <img src={logow} alt="Logo" className="logo" />
        <h1>MoEvents</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <Button variant="default" primaryText="Sign In" fullWidth />
        </form>
        <p>
          Forgot Password? <a href="/forgot-password">Click Here</a>
        </p>
        <p>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
        <footer className="login-footer">
          <p>© 2025 MoEvents. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;