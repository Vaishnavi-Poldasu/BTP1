// import React, { useEffect,useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import logo from '../assets/iiith-logo.png';
// import lsi from '../assets/lsi_logo.png';
// import landsat from '../assets/landsat.jpg';
// import sentinel from '../assets/sentinel.jpg';
// import './Dashboard.css';

// function Dashboard() {
//   const navigate = useNavigate();
//   const [selectedIndex, setSelectedIndex] = useState('');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [sensorName, setSensorName] = useState('');
//   const [userId, setUserId] = useState('');
//   const [showUploadColumn1, setShowUploadColumn1] = useState(false);
//   const [showUploadColumn2, setShowUploadColumn2] = useState(false);
//   const [showDate, setShowDate] = useState(false);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [plotUrl, setPlotUrl] = useState(''); // New state to store the plot URL

//   const spectralIndices = [
//     "NDVI (Normalized Difference Vegetation Index)",
//     "EVI (Enhanced Vegetation Index)",
//     "EVI2 (Enhanced Vegetation Index 2)",
//     "NDWI (Normalized Difference Water Index)"
//   ];

//   useEffect(()=>{
//     const storedUserId = localStorage.getItem('userID');
//     if (storedUserId) {
//       setUserId(storedUserId); 
//     } else {
//       console.error("User ID not found in localStorage.");
//     }
//   },[]);
//   const handleFileUpload = (event) => {
//     setUploadedFile(event.target.files[0]);
//     setShowDate(true);
//   };

//   const handleIndexSelection = (event, column) => {
//     setSelectedIndex(event.target.value);
//     if (column === 1) {
//       setShowUploadColumn1(true);
//       setShowUploadColumn2(false);
//       setSensorName("Landsat Sensor");
//     } else {
//       setShowUploadColumn2(true);
//       setShowUploadColumn1(false);
//       setSensorName("Sentinel Sensor");
//     }
//     setShowDate(false);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!uploadedFile || !selectedIndex || !sensorName || !userId || !startDate || !endDate) {
//       alert("Please fill all the fields and upload a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', uploadedFile);
//     formData.append('userId', userId);
//     formData.append('sensorName', sensorName);
//     formData.append('spectralIndex', selectedIndex);
//     formData.append('startDate', startDate);
//     formData.append('endDate', endDate);

//     //added part - change
//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData);
//       alert("Data successfully uploaded and stored in database!");

//       // After successful upload, get the plot path from the backend response
//       const plotPath = response.data.plotPath; // This should be the relative path to the plot
//       setPlotUrl(`http://localhost:5000${plotPath}`); // Construct the full URL to the plot
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Error uploading data!";
//       alert(errorMsg);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userID');
//     navigate('/login');
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="image-container">
//         <img src={logo} alt="Institution Logo" className="resized-image" />
//         <img src={lsi} alt="LSI Logo" className="resized-image" />
//       </div>

//       <div className="upload-section">
//         <h2>Upload Shapefile & Select Spectral Index</h2>

//         <h3>Select Spectral Index:</h3>
//         <div className="spectral-container">

//           <div className="spectral-column">
//             <img src={landsat} alt="Landsat Sensor" className="landsat-image" />
//             <h4>Remote Sensing indices - Landsat Sensor</h4>
//             {spectralIndices.map((index) => (
//               <label key={index} className="spectral-label">
//                 <input
//                   type="radio"
//                   name="spectralIndex"
//                   value={index}
//                   onChange={(e) => handleIndexSelection(e, 1)}
//                 />
//                 {index}
//               </label>
//             ))}

//             {showUploadColumn1 && (
//               <div>
//                 <label>Upload Shapefile (Accepted: .zip, .shp, .prj, .shx, .qmd, .dbf, .cpg): </label>
//                 <input 
//                   type="file" 
//                   accept=".zip,.shp,.prj,.shx,.qmd,.dbf,.cpg" 
//                   onChange={handleFileUpload} 
//                 />
//               </div>
//             )}

//             {showDate && showUploadColumn1 && (
//               <div>
//                 <label>Start Date:</label>
//                 <input 
//                   type="date" 
//                   value={startDate} 
//                   onChange={(e) => setStartDate(e.target.value)}
//                   required
//                 />
//                 <label>End Date:</label>
//                 <input 
//                   type="date" 
//                   value={endDate} 
//                   onChange={(e) => setEndDate(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//           </div>

//           <div className="spectral-column">
//             <img src={sentinel} alt="Sentinel Sensor" className="sentinel-image" />
//             <h4>Remote Sensing indices - Sentinel Sensor</h4>
//             {spectralIndices.map((index) => (
//               <label key={index} className="spectral-label">
//                 <input
//                   type="radio"
//                   name="spectralIndex"
//                   value={index}
//                   onChange={(e) => handleIndexSelection(e, 2)}
//                 />
//                 {index}
//               </label>
//             ))}

//             {showUploadColumn2 && (
//               <div>
//                 <label>Upload Shapefile (Accepted: .zip, .shp, .prj, .shx, .qmd, .dbf, .cpg): </label>
//                 <input 
//                   type="file" 
//                   accept=".zip,.shp,.prj,.shx,.qmd,.dbf,.cpg" 
//                   onChange={handleFileUpload} 
//                 />
//               </div>
//             )}

//             {showDate && showUploadColumn2 && (
//               <div>
//                 <label>Start Date:</label>
//                 <input 
//                   type="date" 
//                   value={startDate} 
//                   onChange={(e) => setStartDate(e.target.value)}
//                   required
//                 />
//                 <label>End Date:</label>
//                 <input 
//                   type="date" 
//                   value={endDate} 
//                   onChange={(e) => setEndDate(e.target.value)}
//                   required
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <button onClick={handleSubmit} className="submit-button">Submit</button>
//       </div>

//       <button onClick={handleLogout} className="logout-button">Logout</button>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from 'react';
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
  const [plotUrl, setPlotUrl] = useState(''); // New state to store the plot URL
  const [csvUrl, setCsvUrl] = useState('');

  const spectralIndices = [
    "NDVI (Normalized Difference Vegetation Index)",
    "EVI (Enhanced Vegetation Index)",
    "EVI2 (Enhanced Vegetation Index 2)",
    "NDWI (Normalized Difference Water Index)"
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem('userID');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage.");
    }
  }, []);

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
    setShowDate(true);
  };

  const handleIndexSelection = (event, column) => {
    setSelectedIndex(event.target.value);
    if (column === 1) {
      setShowUploadColumn1(true);
      setShowUploadColumn2(false);
      setSensorName("Landsat Sensor");
    } else {
      setShowUploadColumn2(true);
      setShowUploadColumn1(false);
      setSensorName("Sentinel Sensor");
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

      // After successful upload, get the plot path from the backend response
      
      setPlotUrl(`http://localhost:5000/static/output_plot.png`);
      setCsvUrl('http://localhost:5000/static/output_data.csv') // Construct the full URL to the plot
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error uploading data!";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
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

      {plotUrl && (
        <div className="plot-container">
          <h3>Generated Plot</h3>
          <img src={plotUrl} alt="Generated Plot" className="generated-plot" />
          {csvUrl && (
            <div className="csv-download-container">
              <h3>Download CSV Data</h3>
              <a href={csvUrl} download className="download-button">
                Download CSV
              </a>
            </div>
          )}

        </div>
      )}

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;
