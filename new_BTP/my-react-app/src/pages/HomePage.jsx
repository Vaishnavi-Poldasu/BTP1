import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bgImage from '../assets/bg.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay"></div>

      {/* Top-right buttons */}
      <div className="top-right-buttons">
        <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
        <button onClick={() => navigate('/signup')} className="btn btn-secondary">Sign Up</button>
      </div>

      {/* Optional center message */}
      <div className="center-content">
        <h1>OptiSense</h1>
        <p>An Intelligent Tool for Remote Sensing Index Calculation and Sensor Selection</p>
      </div>
    </div>
  );
};

export default HomePage;
