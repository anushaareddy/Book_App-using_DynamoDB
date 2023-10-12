// Import required modules
const express = require('express'); // Web framework for Node.js
const dotenv = require('dotenv'); // Load environment variables from a .env file
const morgan = require('morgan'); // HTTP request logger middleware
const bodyParser = require('body-parser'); // Parse incoming request bodies
const path = require('path'); // Utilities for working with file and directory paths

const app = express(); // Create an instance of the express application

app.use(express.json()); // Parse JSON request bodies

// Define routes for serving static files from specified directories
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000; // Set the port for the server to listen on

app.use(morgan('tiny')); // Log HTTP requests in a compact format

// Set up body parser to handle URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs"); // Set the view engine for rendering dynamic content

// Require and use your defined routes
app.use('/', require('./server/routes/router'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
