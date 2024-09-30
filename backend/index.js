const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// Initialize environment variables
dotenv.config();

// Create an Express application
const app = express();
const PORT = 3000;

// Get API key and URL from environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Utility function to handle errors
const handleError = (res, message, status = 500) => {
  console.error(message);
  res.status(status).json({ error: message });
};

// Route to get weather data
app.get('/api/weather', async (req, res) => {
  const { city, lat, lon } = req.query;

  // Parameters for the weather API request
  const params = {
    appid: WEATHER_API_KEY,
    units: 'metric',
  };

  // Determine whether to use coordinates or city name
  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else if (city) {
    params.q = city;
  } else {
    return handleError(res, 'City or coordinates are required', 400);
  }

  try {
    const response = await axios.get(WEATHER_API_URL, { params });
    res.json(response.data);
  } catch (error) {
    const errorMessage = 'Error fetching weather data';
    const errorDetails = {
      message: error.message || 'No message',
      status: error.response?.status || 'No status',
      data: error.response?.data || 'No data',
      params,
    };
    handleError(res, errorMessage, error.response?.status || 500);
  }
});

//google authauthorize


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
