// constants
const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3001;
const CMS = require("./CMS.js");

// Require dotenv to load environment variables
require("dotenv").config();

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

// Start CMS
const cms = new CMS(db);

cms.run();
