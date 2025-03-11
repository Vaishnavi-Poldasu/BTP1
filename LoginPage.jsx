import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/iiith-logo.png'; 
import lsi from '../assets/lsi_logo.png'; 
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async(event) => {
    event.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username, // Use the email as the username
        password,
      });

      // If login is successful, store the JWT token in localStorage
      localStorage.setItem('authToken', response.data.token);
      alert('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      // Handle login failure (invalid credentials)
      alert(err.response ? err.response.data.message : 'Server error!');
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
      {/* <div className="institution-logo">
        <img src={logo} alt="Institution Logo" />
        <img src={lsi} alt="LSI Logo" />
      </div> */}

       <div className="image-container">
          <img src={logo} alt="Institution Logo" className="resized-image" />
          <img src={lsi} alt="LSI Logo" className="resized-image" />
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
    </>
  );
}

export default LoginPage;
