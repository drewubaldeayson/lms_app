// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const searchRoutes = require('./routes/search');
const videoRoutes = require('./routes/video');
const userRoutes = require('./routes/users');

const config = require('./config/config');

const app = express();

console.log('Current environment:', process.env.NODE_ENV);
console.log('Using port:', config.port);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://170.64.202.114', 'http://170.64.202.114:80'],
    credentials: true
}));
app.use(express.json());

app.use('/api/content', express.static(path.join(__dirname, 'markdown-files')));

// Log all requests (for debugging)
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

app.listen(config.port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${config.port}`));