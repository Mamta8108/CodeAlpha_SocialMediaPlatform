const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make the uploads folder publicly accessible so images/videos can load
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

// Database Connection & Server Start
mongoose.connect('mongodb://127.0.0.1:27017/codealpha_socialmedia')
  .then(() => {
    app.listen(5001, () => console.log('Server running on http://localhost:5001'));
  })
  .catch(err => console.error('Database connection error:', err));