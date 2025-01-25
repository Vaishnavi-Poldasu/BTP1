import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // To navigate to the login page
import './SignupPage.css';
import logo from '../assets/iiith-logo.png';  


function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [organization, setOrganization] = useState('');
  const [purpose, setPurpose] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);  // if the user is already registered

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('User registered successfully!');
    setIsRegistered(true);  
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
  <div className="signup-container">
    

    <div className="login-link">
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>

    {!isRegistered ? (
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Full Name:
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </label>
        <label>
          Organization:
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </label>

        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <button type="submit">Sign Up</button>
      </form>
    ) : (
      <div className="already-registered">
        <h2>You have already registered!</h2>
        <p>
          <Link to="/login">Click here to log in</Link>
        </p>
      </div>
    )}
  </div>
</>
  );
}

export default SignupPage;
