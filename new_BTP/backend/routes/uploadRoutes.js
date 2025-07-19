// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const db = require('../db'); 
// const validateZip = require('./validateZip'); // added line
// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });
// const uploadToDrive = require('./googledrive'); 
// const runGEE = require('../gee-scripts/geeRunner'); // ✅ Make sure the path is correct


// router.post('/upload', upload.single('file'), async (req, res) => {
//   const { userId, sensorName, spectralIndex, startDate, endDate } = req.body;
//   const file = req.file;

//   if (!file) return res.status(400).json({ message: 'No file uploaded' });

//   //added part
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === '.zip') {
//     const result = validateZip(file.path);
//     if (!result.valid) {
//       fs.unlinkSync(file.path); // if invalid delete file to avoid storing junk on sevrer
//       return res.status(400).json({ message: `Invalid ZIP content: ${result.message}` });
//     }
//   } 
//   else if (!['.shp', '.prj', '.shx', '.qmd', '.dbf', '.cpg'].includes(ext)) {
//     fs.unlinkSync(file.path); // clean up
//     return res.status(400).json({ message: 'Invalid file format. Only .zip or one of the following types are accepted: .shp, .prj, .shx, .qmd, .dbf, .cpg' });
//   }
//   // // // // /// //////////////////////////

//   try {
//     const driveFileId = await uploadToDrive(file.path, file.originalname);
//     db.query(
//       'INSERT INTO uploads (user_id, sensor_name, spectral_index, start_date, end_date, file_name,file_path, drive_file_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//       [userId, sensorName, spectralIndex, startDate, endDate, file.originalname,file.path, driveFileId],
//       (err, result) => {
//         if (err) return res.status(500).json({ message: 'DB insert error', error: err });

//         return res.status(200).json({ 
//           message: 'File uploaded to Drive successfully', 
//           driveFileId, 
//           uploadId: result.insertId 
//         });
//       }
//     );
//   } catch (err) {
//     console.error('Upload to Drive failed:', err);
//     return res.status(500).json({ message: 'Google Drive upload failed', error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process'); // ✅ Import child_process
const db = require('../db'); 
const validateZip = require('./validateZip');
const uploadToDrive = require('./googledrive');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  const { userId, sensorName, spectralIndex, startDate, endDate } = req.body;
  const file = req.file;

  console.log('Received sensorName:', sensorName);
  console.log('Type of sensorName:', typeof sensorName);

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.zip') {
    const result = validateZip(file.path);
    if (!result.valid) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: `Invalid ZIP content: ${result.message}` });
    }
  } else if (!['.shp', '.prj', '.shx', '.qmd', '.dbf', '.cpg'].includes(ext)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ message: 'Invalid file format. Only .zip or one of: .shp, .prj, .shx, .qmd, .dbf, .cpg' });
  }

  try {
    console.log('Uploading file to Google Drive...');
    const driveFileId = await uploadToDrive(file.path, file.originalname);
    console.log('File uploaded to Drive. Drive ID:', driveFileId);

    console.log('Triggering Earth Engine script...');
    
    // ✅ Call the Python script directly
    const pythonProcess = spawn('python', [
      'gee-scripts/run_gee.py',
      '--sensor', sensorName,
      '--index', spectralIndex,
      '--start', startDate,
      '--end', endDate,
      '--shapefile', path.join(__dirname, '../shapefiles/ghmc.zip')
    ]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ message: 'Earth Engine script failed.' });
      }

      console.log('Earth Engine script executed successfully.');

      db.query(
        'INSERT INTO uploads (user_id, sensor_name, spectral_index, start_date, end_date, file_name, file_path, drive_file_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, sensorName, spectralIndex, startDate, endDate, file.originalname, file.path, driveFileId],
        (err, result) => {
          if (err) {
            console.error('Database insert failed:', err);
            return res.status(500).json({ message: 'DB insert error', error: err });
          }

          console.log('Upload metadata saved to DB.');
          return res.status(200).json({
            message: 'File uploaded, GEE script triggered, and DB updated.',
            driveFileId,
            uploadId: result.insertId,
            plotPath: 'output_plot.png'
          });
        }
      );
    });
  } catch (err) {
    console.error('Error during upload and processing:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
