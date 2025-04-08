import React, { useState } from 'react';
import '../login.css';
import logo from '../assets/logo.png';

function Login() {
    // State hooks for form data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    // Form submit handler
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Username:', username);
      console.log('Password:', password);
  
      // Here you can handle authentication logic
    };
  
    return (
      <div className="auth-page">
        <div className="login-container">
        <img src={logo} alt="Logo" className="logo" />
          <h1>Login to MoEvents</h1>
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
              <input type="submit" value="Login" className="form-submit" />
            </div>
          </form>
          <p>Forgot Password? <a href="/forgot-password">Click Here</a></p>
          <p>Don't have an account? <a href="/signup">Sign up here</a></p>
  
          {/* Footer Section Inside the Login Box */}
          <footer className="login-footer">
            <p>© 2025 MoEvents. All Rights Reserved.</p>
          </footer>
        </div>
      </div>
    );
  }
  
  export default Login;