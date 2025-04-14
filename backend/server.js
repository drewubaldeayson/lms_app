// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const searchRoutes = require('./routes/search');
const videoRoutes = require('./routes/video');
const userRoutes = require('./routes/users');
const auth = require('./middleware/auth');

const config = require('./config/config');

const app = express();

console.log('Current environment:', process.env.NODE_ENV);
console.log('Using port:', config.port);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://170.64.202.114', 'http://170.64.202.114:80',
    'http://docs.muli.com.au',
    'https://docs.muli.com.au'],
  credentials: true
}));
app.use(express.json());


// Custom middleware to serve from multiple directories
const multiDirectoryAttachmentStatic = () => {
    return (req, res, next) => {
      // Decode the path to handle URL-encoded characters
      const requestedPath = decodeURIComponent(req.path.replace(/^\//, ''));
      
      console.log('Requested attachment path:', requestedPath);
  
      // Potential directories to check
      const directories = [
        path.join(__dirname, 'markdown-files'),
        path.join(__dirname, 'markdown-files-manual')
      ];
  
      // Function to find the full path of the attachment
      const findAttachmentPath = (directories) => {
        for (const baseDir of directories) {
          // Split the path to handle nested directories
          const pathParts = requestedPath.split('/');
          
          // Try different path combinations
          const possiblePaths = [
            // Direct path
            path.join(baseDir, requestedPath),
            
            // Path with 'attachments' inserted
            path.join(baseDir, ...pathParts.slice(0, -1), 'attachments', pathParts[pathParts.length - 1]),
            
            // Path where 'attachments' might be a sibling directory
            path.join(baseDir, path.dirname(requestedPath), 'attachments', path.basename(requestedPath))
          ];
  
          for (const fullPath of possiblePaths) {
            console.log('Checking path:', fullPath);
            
            if (fs.existsSync(fullPath)) {
              console.log('Found attachment at:', fullPath);
              return fullPath;
            }
          }
        }
        return null;
      };
  
      // Find the attachment path
      const attachmentPath = findAttachmentPath(directories);
  
      if (attachmentPath) {
        // Serve the file directly
        return res.sendFile(attachmentPath);
      }
  
      // If no file found, log and pass to next middleware
      console.error('Attachment not found:', requestedPath);
      next();
    };
};

app.use('/api/content', multiDirectoryAttachmentStatic());

// Log all requests (for debugging)
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    next();
});


app.use((req, res, next) => {
    const allowedPaths = ['/api/auth', '/api/content', '/api/search', '/api/videos', '/api/users'];
    const isAllowedPath = allowedPaths.some(path => req.url.startsWith(path));

    if (!isAllowedPath) {
        return res.status(403).json({
            success: false,
            message: 'Access to this resource is forbidden'
        });
    }
    next();
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', auth,  contentRoutes);
app.use('/api/search', auth, searchRoutes);
app.use('/api/videos',auth, videoRoutes);
app.use('/api/users', auth, userRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

app.listen(config.port, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${config.port}`));