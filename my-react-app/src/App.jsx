import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import './App.css';

import SignupPage from './pages/SignupPage';  
import LoginPage from './pages/LoginPage'; 


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<SignupPage />} /> 
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
