import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import logo from '../assets/iiith-logo.png';
import lsi from '../assets/lsi_logo.png';
import bgImage from '../assets/white.png';
function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [organization, setOrganization] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        fullName,
        dob,
        organization,
        username,
        password,
      });

      if (response.data.message === 'User registered successfully!') {
        setIsRegistered(true);
        alert('User registered successfully!');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Server error');
      alert('Error during signup!');
    }
  };

  return (
    <div className="signup-page-container" style={{ backgroundImage: `url(${bgImage})` }}>
      
      <div className="signup-overlay"></div>

      <div className="logo-bar">
        <img src={logo} alt="Institution Logo" className="resized-image" />
        <img src={lsi} alt="LSI Logo" className="resized-image" />
      </div>

      <div className="glass-signup-box">
        <h2>OptiSense</h2>
        <p className="tagline">
          An Intelligent Tool for Remote Sensing Index Calculation and Sensor Selection
        </p>
        <h3>Sign Up</h3>

        {!isRegistered ? (
          <form onSubmit={handleSubmit} className="signup-form">
  <div className="form-group">
    <label htmlFor="fullName">Full Name</label>
    <input
      type="text"
      id="fullName"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="dob">Date of Birth</label>
    <input
      type="date"
      id="dob"
      value={dob}
      onChange={(e) => setDob(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="organization">Organization</label>
    <input
      type="text"
      id="organization"
      value={organization}
      onChange={(e) => setOrganization(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="username">Username</label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit">Sign Up</button>
</form>

        ) : (
          <div className="already-registered">
            <h2>You have already registered!</h2>
            <p><Link to="/login">Click here to log in</Link></p>
          </div>
        )}

        <div className="login-link">
          <p>Already registered? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
