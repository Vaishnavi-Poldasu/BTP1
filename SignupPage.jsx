import React, { useState } from 'react';
import axios from 'axios'; // To make API requests
import { Link,useNavigate} from 'react-router-dom'; // To navigate to the login page
import './SignupPage.css';
import logo from '../assets/iiith-logo.png';  
import lsi from '../assets/lsi_logo.png'; 

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [organization, setOrganization] = useState('');
  const [purpose, setPurpose] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);  // if the user is already registered
  const [error, setError] = useState('');  // To store the error message
  const navigate = useNavigate();
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        fullName,
        dob,
        organization,
        username,
        password
      });
      console.log('Response from backend:', response.data);  // Log response
      if (response.data.message === 'User registered successfully!') {
        setIsRegistered(true); // Mark user as registered
        alert('User registered successfully!');
        navigate('/login'); // Redirect to login page
      }
    } catch (err) {
      // Handle any errors (e.g., username already exists)
      setError(err.response ? err.response.data.message : 'Server error');
      alert('Error during signup!');
    } 
  };

  return (
    
    <>
  {/* <div className="institution-logo">
    <img src={logo} alt="Institution Logo" />
    <img src={lsi} alt="lsi Logo" />
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
  <div className="signup-container">

    {!isRegistered ? (
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        <label>
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </label>
        <label>
          Organization
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </label>

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

    <div className="login-link">
          <p>
            Already registered? <Link to="/login">Login here</Link>
          </p>
    </div>
  </div>
</>
  );
}

export default SignupPage;
