import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/login.css'; 
import logow from '../assets/logo.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);

    // 🔐 Simple hardcoded check (replace with real auth later)
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin'); // ✅ Navigate to AdminDashboard
    } else {
      alert('Invalid credentials');
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
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <input type="submit" value="Sign In" className="form-submit" />
          </div>
        </form>
        <p>Forgot Password? <a href="/forgot-password">Click Here</a></p>
        <p>Don't have an account? <a href="/signup">Sign up here</a></p>

        <footer className="login-footer">
          <p>© 2025 MoEvents. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
