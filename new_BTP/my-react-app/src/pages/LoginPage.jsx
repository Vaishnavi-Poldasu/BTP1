import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/iiith-logo.png';
import lsi from '../assets/lsi_logo.png';
import bgImage from '../assets/white.png'; // your background image

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response ? err.response.data.message : 'Server error!');
    }
  };

  return (
    <div
      className="login-page-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-overlay"></div>

      <div className="logo-bar">
        <img src={logo} alt="Institution Logo" className="resized-image" />
        <img src={lsi} alt="LSI Logo" className="resized-image" />
      </div>

      <div className="glass-login-box">
        <h2>OptiSense</h2>
        <p className="tagline">
          An Intelligent Tool for Remote Sensing Index Calculation and Sensor Selection
        </p>
        <h3>Login</h3>
        <form onSubmit={handleLogin} className="login-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
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
    </div>
  );
}

export default LoginPage;
