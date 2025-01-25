import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/iiith-logo.png'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // if the user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard'); 
    }
  }, [navigate]);

  const handleLogin = (event) => {
    event.preventDefault();
    // send a request to your backend for verification(backend)
    if (email === 'user@example.com' && password === 'password123') {
      // Save the authentication token (use actual authentication flow )
      localStorage.setItem('authToken', 'your_auth_token');
      alert('Login successful!');
      navigate('/dashboard'); 
    } else {
      alert('Invalid credentials!');
    }
  };

  const skipLogin = () => {
    // If the user is already registered, skip the login
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    } else {
      alert('Please log in first');
    }
  };

  return (
    <>
      <div className="institution-logo">
        <img src={logo} alt="Institution Logo" />
      </div>
      <div className="project-overview">
        <h1>OptiSense</h1>
        <p>
          An Intelligent Tool for Remote Sensing Index Calculation and Sensor 
          Selection
        </p>
      </div>
      <div className="login-container">
        <div className="project-overview">
          <h1>Login Page</h1>
        </div>

        {/* If the user is not logged in, show the login form */}
        <form onSubmit={handleLogin} className="login-form">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>

       
      </div>
    </>
  );
}

export default LoginPage;
