// src/components/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import logow from "../assets/logo.png";
import Button from "./atoms/button";
import "../styles/signup.css";


function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verify_password: "",
    role: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { fetchData, loading } = useApi("/auth/signup", "post", {
    immediate: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.verify_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetchData(formData);
      if (res?.username) {
        navigate("/login");
      } else {
        setErrorMessage("Sign up failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage("Error creating account.");
    }
  };

  return (
    <div className="auth-page">
      <div className="signup-container">
        <img src={logow} alt="Logo" className="logo" />
        <h1>MoEvents</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            name="verify_password"
            type="password"
            placeholder="Confirm Password"
            value={formData.verify_password}
            onChange={handleChange}
            className="form-input"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button variant="default" primaryText="Sign Up" fullWidth />
        </form>
        <p>
          Already have an account? <a href="/login">Sign In</a>
        </p>
        <footer className="login-footer">
          <p>© 2025 MoEvents. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default SignUp;
