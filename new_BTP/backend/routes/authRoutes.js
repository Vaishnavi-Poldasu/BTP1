const express = require("express");//express is web framework for handling routes
const bcrypt = require("bcryptjs");//used for hashing passwords
const jwt = require("jsonwebtoken"); //generates tokens for user authentication
const db = require("../db"); //connection to mysql database from db.js

const multer = require('multer');//used for handling file uploads
const AdmZip = require('adm-zip');//used for handling zip files
const fs = require('fs');//used for file system operations
const path = require('path');//used for handling file paths
const {google}= require('googleapis');//used for google drive API
const { version } = require('os');

require('dotenv').config();
const router = express.Router();
router.post('/signup', async (req, res) => {
    const { fullName, dob, organization, username, password } = req.body;
    console.log('Received signup request:', req.body);

    try {
        // Check if username already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, userResult) => {
            if (err) {
                console.error('Database error during username check:', err);
                return res.status(500).json({ message: 'Server error', error: err.message });
            }
            if (userResult.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Check if organization exists
            console.log(`Checking organization: '${organization}'`);
            db.query('SELECT org_id FROM organizations WHERE org_name = ?', [organization], async (err, orgResult) => {
                if (err) {
                    console.error('Database error during organization lookup:', err);
                    return res.status(500).json({ message: 'Server error', error: err.message });
                }

                let org_id;
                if (orgResult.length === 0) {
                    // Organization does not exist, insert it
                    console.log(`Organization '${organization}' not found. Inserting into database...`);
                    db.query('INSERT INTO organizations (org_name) VALUES (?)', [organization], (err, insertResult) => {
                        if (err) {
                            console.error('Database error during organization insertion:', err);
                            return res.status(500).json({ message: 'Server error', error: err.message });
                        }
                        org_id = insertResult.insertId;
                        console.log(`New organization added with org_id: ${org_id}`);

                        // Proceed to insert the user
                        insertUser();
                    });
                } else {
                    // Organization exists, get org_id
                    org_id = orgResult[0].org_id;
                    console.log(`Using existing org_id: ${org_id}`);
                    insertUser();
                }

                // Function to insert user after getting org_id
                async function insertUser() {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    console.log('Password hashed. Inserting new user...');

                    db.query(
                        'INSERT INTO users (username, password, fullName, dob, org_id) VALUES (?, ?, ?, ?, ?)',
                        [username, hashedPassword, fullName, dob, org_id],
                        (err, insertResult) => {
                            if (err) {
                                console.error('Database error during user insertion:', err);
                                return res.status(500).json({ message: 'Server error', error: err.message });
                            }
                            console.log('User registered successfully:', insertResult);
                            return res.status(201).json({ message: 'User registered successfully!' });
                        }
                    );
                }
            });
        });
    } catch (err) {
        console.error('Error during signup process:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
      //we need to query the db to check if the user exists
      if (err) return res.status(500).json({ message: 'Server error' });
      if (result.length === 0) return res.status(400).json({ message: 'User not found' });
      // Compare passwords
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      // Generate JWT Token,it generate using user's id,token expires in 1 hour
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token,userID:user.id, username: user.username });
    });
});
module.exports = router