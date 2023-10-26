const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");

// Require dotenv to load environment variables
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: process.env.PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employees_db database.`)
);
