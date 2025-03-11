import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/iiith-logo.png';
import lsi from '../assets/lsi_logo.png';
import landsat from '../assets/landsat.jpg';
import sentinel from '../assets/sentinel.jpg';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sensorName, setSensorName] = useState('');
  const [userId, setUserId] = useState('');
  const [showUploadColumn1, setShowUploadColumn1] = useState(false);
  const [showUploadColumn2, setShowUploadColumn2] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const spectralIndices = [
    "NDVI (Normalized Difference Vegetation Index)",
    "EVI (Enhanced Vegetation Index)",
    "EVI2 (Enhanced Vegetation Index 2)",
    "NDWI (Normalized Difference Water Index)"
  ];

  /*  Authentication Logic (Currently Disabled)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Unauthorized access! Please log in.');
      navigate('/login');
    }
  }, [navigate]);
  */
  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
    setShowDate(true);
  };

  const handleIndexSelection = (event, column) => {
    setSelectedIndex(event.target.value);
    if (column === 1) {
      setShowUploadColumn1(true);
      setShowUploadColumn2(false);
    } else {
      setShowUploadColumn2(true);
      setShowUploadColumn1(false);
    }
    setShowDate(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!uploadedFile || !selectedIndex || !sensorName || !userId || !startDate || !endDate) {
      alert("Please fill all the fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('userId', userId);
    formData.append('sensorName', sensorName);
    formData.append('spectralIndex', selectedIndex);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    try {
      await axios.post('http://localhost:5000/api/upload', formData);
      alert("Data successfully uploaded and stored in database!");
    } catch (error) {
      alert("Error uploading data!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="image-container">
        <img src={logo} alt="Institution Logo" className="resized-image" />
        <img src={lsi} alt="LSI Logo" className="resized-image" />
      </div>

      <div className="upload-section">
        <h2>Upload Shapefile & Select Spectral Index</h2>

        <h3>Select Spectral Index:</h3>
        <div className="spectral-container">

          <div className="spectral-column">
            <img src={landsat} alt="Landsat Sensor" className="landsat-image" />
            <h4>Remote Sensing indices - Landsat Sensor</h4>
            {spectralIndices.map((index) => (
              <label key={index} className="spectral-label">
                <input
                  type="radio"
                  name="spectralIndex"
                  value={index}
                  onChange={(e) => handleIndexSelection(e, 1)}
                />
                {index}
              </label>
            ))}

            {showUploadColumn1 && (
              <div>
                <label>Upload Shapefile (Accepted: .zip, .shp, .prj, .shx, .qmd, .dbf, .cpg): </label>
                <input 
                  type="file" 
                  accept=".zip,.shp,.prj,.shx,.qmd,.dbf,.cpg" 
                  onChange={handleFileUpload} 
                />
              </div>
            )}

            {showDate && showUploadColumn1 && (
              <div>
                <label>Start Date:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <label>End Date:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="spectral-column">
            <img src={sentinel} alt="Sentinel Sensor" className="sentinel-image" />
            <h4>Remote Sensing indices - Sentinel Sensor</h4>
            {spectralIndices.map((index) => (
              <label key={index} className="spectral-label">
                <input
                  type="radio"
                  name="spectralIndex"
                  value={index}
                  onChange={(e) => handleIndexSelection(e, 2)}
                />
                {index}
              </label>
            ))}

            {showUploadColumn2 && (
              <div>
                <label>Upload Shapefile (Accepted: .zip, .shp, .prj, .shx, .qmd, .dbf, .cpg): </label>
                <input 
                  type="file" 
                  accept=".zip,.shp,.prj,.shx,.qmd,.dbf,.cpg" 
                  onChange={handleFileUpload} 
                />
              </div>
            )}

            {showDate && showUploadColumn2 && (
              <div>
                <label>Start Date:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <label>End Date:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </div>

        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;
