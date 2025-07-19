const AdmZip = require('adm-zip'); //library which allows to read and inspect .zip
const path = require('path'); // to extract file extensions from filenames

//file extensions allowed in zip file
const ALLOWED_EXTENSIONS = ['.shp', '.prj', '.shx', '.qmd', '.dbf', '.cpg'];
const REQUIRED_EXTENSIONS = ['.shp', '.shx', '.dbf'];

function validateZip(filePath) {
    try {
      const zip = new AdmZip(filePath); //reads zipfile
      const zipEntries = zip.getEntries(); //extract file entries inside zip
  
      if (zipEntries.length === 0) {
        return { valid: false, message: 'ZIP file is empty.' };
      }
      // Track found extensions
      const foundExtensions = new Set();
      for (const entry of zipEntries) {
        const ext = path.extname(entry.entryName).toLowerCase(); //get file extension

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return { valid: false, message: `Invalid file format found: ${entry.entryName}` };
        }

        foundExtensions.add(ext);
      }
      
      //check for atleast extensions
      for (const requiredExt of REQUIRED_EXTENSIONS) {
        if (!foundExtensions.has(requiredExt)) {
          return {
            valid: false,
            message: `Missing required file: ${requiredExt} file is not found in the ZIP.`,
          };
        }
      }
      
      return { valid: true };
    } catch (err) {
      return { valid: false, message: 'Invalid ZIP file or corrupt archive.' };
    }
  }
  
  module.exports = validateZip;
  

