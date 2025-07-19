const express = require("express");
const cors = require("cors"); //allows the server to respond to requests from different origins,basically frontend-backend communication.
require("dotenv").config();
console.log("Loading authRoutes...");
const authRoutes = require("./routes/authRoutes");
console.log("Loading uploadRoutes...");
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
app.use(express.json());//middleware to parse json date from req body
app.use(cors());//middleware to allow cross-origin requests

//gee
console.log("Loading geeRunner...");
const geeRunner = require('./routes/geeRunner');
app.use('/api/gee', geeRunner);

const path = require('path');
// Serve static files from the 'backend' folder, exposing them as '/output_plot.png'
app.use('/static', express.static(path.join(__dirname)));

// Routes
app.use("/api/auth", authRoutes); //middleware to handle routes
app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
