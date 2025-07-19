//setting up mysql database connection using mysql12 package and environment variables stored in .env
//importing modules
const mysql = require("mysql2");

//dotenv loads contents of .env into process.env
//this allows sensitive information to be stored in .env and not in the code
require("dotenv").config();

//creating connection to mysql database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//connectong to database
db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

//exporting database connection
module.exports = db;
