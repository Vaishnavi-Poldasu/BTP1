import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import './App.css';

import SignupPage from './pages/SignupPage';  
import LoginPage from './pages/LoginPage'; 
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage'; 


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
