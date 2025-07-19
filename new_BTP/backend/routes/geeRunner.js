
// const express = require('express');
// const { exec } = require('child_process');
// const db = require('../db');
// const router = express.Router();

// router.post('/gee/run', async (req, res) => {
//   const { uploadId } = req.body;

//   // Input validation for uploadId
//   if (!uploadId || isNaN(uploadId)) return res.status(400).json({ message: 'Invalid or missing upload ID' });

//   // Get upload details from DB
//   db.query('SELECT * FROM uploads WHERE id = ?', [uploadId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database query failed', error: err });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Upload ID not found' });
//     }

//     const data = results[0];

//     // Prepare the command to run `run_gee.py`
//     // Pass the path of the ZIP file that was uploaded
//     const cmd = `python3 gee-scripts/run_gee.py --zipfile "${data.file_path.replace(/ /g, '\\ ')}" --sensor ${data.sensor_name} --index ${data.spectral_index} --start "${data.start_date}" --end "${data.end_date}"`;

//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         console.error('GEE script failed:', stderr);
//         return res.status(500).json({ message: 'GEE script execution failed', error: stderr });
//       }

//       // Handle potential empty or malformed stdout
//       if (!stdout) {
//         return res.status(500).json({ message: 'No output from GEE script' });
//       }

//       // Parse the JSON output from the Python script
//       let parsedOutput;
//       try {
//         parsedOutput = JSON.parse(stdout);
//       } catch (parseError) {
//         console.error('Failed to parse GEE script output:', parseError);
//         return res.status(500).json({ message: 'Failed to parse GEE script output', error: parseError });
//       }

//       // Respond with parsed data
//       return res.status(200).json({ message: 'GEE processing complete', data: parsedOutput });
//     });
//   });
// });

// module.exports = router;


// const express = require('express');
// const { exec } = require('child_process');
// const db = require('../db');
// const path = require('path');  // To resolve file paths
// const router = express.Router();

// router.post('/gee/run', async (req, res) => {
//   const { uploadId } = req.body;

//   // Input validation for uploadId
//   if (!uploadId || isNaN(uploadId)) return res.status(400).json({ message: 'Invalid or missing upload ID' });

//   // Get upload details from DB
//   db.query('SELECT * FROM uploads WHERE id = ?', [uploadId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database query failed', error: err });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Upload ID not found' });
//     }

//     const data = results[0];

//     // Prepare the command to run `run_gee.py`
//     // Pass the path of the ZIP file that was uploaded
//     const cmd = `python3 gee-scripts/run_gee.py --zipfile "${data.file_path.replace(/ /g, '\\ ')}" --sensor ${data.sensor_name} --index ${data.spectral_index} --start "${data.start_date}" --end "${data.end_date}"`;

//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         console.error('GEE script failed:', stderr);
//         return res.status(500).json({ message: 'GEE script execution failed', error: stderr });
//       }

//       // Handle potential empty or malformed stdout
//       if (!stdout) {
//         return res.status(500).json({ message: 'No output from GEE script' });
//       }

//       // Assuming stdout contains the path to the saved plot (output_plot.png)
//       const plotFilePath = stdout.trim();  // Ensure any extra spaces or newline are removed

//       // Check if the plot file exists
//       const plotFile = path.join(__dirname, 'gee-scripts', plotFilePath);
//       if (!path.existsSync(plotFile)) {
//         return res.status(500).json({ message: 'Plot file not found' });
//       }

//       // Send response with the plot file path
//       return res.status(200).json({ 
//         message: 'GEE processing complete', 
//         plotPath: `/path/to/plot/${plotFilePath}`  // Modify this according to your static folder setup
//       });
//     });
//   });
// });

// module.exports = router;

//////////
// const express = require('express');
// const { exec } = require('child_process');
// const db = require('../db');
// const path = require('path'); // To resolve file paths
// const fs = require('fs');  // To check if file exists
// const router = express.Router();

// // Ensure static files (like images) can be served from the 'gee-scripts' directory
// router.use('/plots', express.static(path.join(__dirname, '../gee-scripts')));

// router.post('/gee/run', async (req, res) => {
//   const { uploadId } = req.body;

//   // Input validation for uploadId
//   if (!uploadId || isNaN(uploadId)) return res.status(400).json({ message: 'Invalid or missing upload ID' });

//   // Get upload details from DB
//   db.query('SELECT * FROM uploads WHERE id = ?', [uploadId], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ message: 'Database query failed', error: err });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Upload ID not found' });
//     }

//     const data = results[0];

//     // Prepare the command to run `run_gee.py`
//     const cmd = `python3 gee-scripts/run_gee.py --zipfile "${data.file_path.replace(/ /g, '\\ ')}" --sensor ${data.sensor_name} --index ${data.spectral_index} --start "${data.start_date}" --end "${data.end_date}"`;

//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         console.error('GEE script failed:', stderr);
//         return res.status(500).json({ message: 'GEE script execution failed', error: stderr });
//       }

//       // Handle potential empty or malformed stdout
//       if (!stdout) {
//         return res.status(500).json({ message: 'No output from GEE script' });
//       }

//       // Extract plot path from stdout
//       const plotFilePath = stdout.trim();  // Assuming stdout is the relative path

//       // Construct full file path for the plot
//       const plotFile = path.join(__dirname, '../gee-scripts', plotFilePath);

//       // Check if the plot file exists
//       if (!fs.existsSync(plotFile)) {
//         return res.status(500).json({ message: 'Plot file not found' });
//       }

//       // Send response with the plot file path
//       return res.status(200).json({
//         message: 'GEE processing complete',
//         plotPath: `/plots/${path.basename(plotFilePath)}`  // Use '/plots' for static serving
//       });
//     });
//   });
// });

// module.exports = router;


//new
const express = require('express');
const { exec } = require('child_process');
const db = require('../db');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Serve static files like PNG/CSV from gee-scripts folder
router.use('/plots', express.static(path.join(__dirname, '../gee-scripts')));

router.post('/gee/run', async (req, res) => {
  const { uploadId } = req.body;

  console.log('Received request to /gee/run with uploadId:', uploadId);

  if (!uploadId || isNaN(uploadId)) {
    console.log('Invalid or missing upload ID');
    return res.status(400).json({ message: 'Invalid or missing upload ID' });
  }

  // Step 1: Fetch metadata from database
  db.query('SELECT * FROM uploads WHERE id = ?', [uploadId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database query failed', error: err });
    }

    if (results.length === 0) {
      console.log('No upload found with given ID');
      return res.status(404).json({ message: 'Upload ID not found in DB' });
    }

    const data = results[0];
    console.log('Fetched metadata from DB:', data);

    // Step 2: Look for the zip file in the uploads directory
    const uploadsDir = path.join(__dirname, '../gee-scripts');
    console.log('Looking for zip file in:', uploadsDir);

    const zipFile = fs.readdirSync(uploadsDir).find(file =>
      file.includes(`upload_${uploadId}`) && file.endsWith('.zip')
    );

    if (!zipFile) {
      console.log('Matching zip file not found for uploadId:', uploadId);
      return res.status(404).json({ message: 'Zip file not found in uploads directory' });
    }

    const zipFilePath = path.join(uploadsDir, zipFile);
    console.log('Using zip file:', zipFilePath);

    // Step 3: Construct and execute the command
    const cmd = `python3 gee-scripts/run_gee.py --zipfile "${zipFilePath}" --sensor "${data.sensor_name}" --index "${data.spectral_index}" --start "${data.start_date}" --end "${data.end_date}"`;

    console.log('Running command:', cmd);

    exec(cmd, (error, stdout, stderr) => {
      console.log('--- Python Script Execution ---');
      console.log('STDOUT:\n', stdout);
      console.log('STDERR:\n', stderr);
      
      if (error) {
        console.error('GEE script execution failed:', stderr);
        return res.status(500).json({ message: 'GEE script execution failed', error: stderr });
      }

      const lines = stdout.trim().split('\n');
      const plotFileName = lines.find(line => line.trim().endsWith('.png'));
      const csvFileName = lines.find(line => line.trim().endsWith('.csv'));

      const plotFile = path.join(__dirname, '../gee-scripts', plotFileName);
      const csvFile = path.join(__dirname, '../gee-scripts', csvFileName);

      if (!fs.existsSync(plotFile) || !fs.existsSync(csvFile)) {
        console.log('Plot or CSV file does not exist');
        return res.status(500).json({ message: 'Plot or CSV file not found' });
      }

      const responsePlotPath = `/plots/${path.basename(plotFileName)}`;
      const responseCsvPath = `/plots/${path.basename(csvFileName)}`;

      return res.status(200).json({
        message: 'GEE processing complete',
        plotPath: responsePlotPath,
        csvPath: responseCsvPath
      });
    });
  });
});

module.exports = router;
