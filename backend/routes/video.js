// backend/routes/video.js
const express = require('express');
const router = express.Router();
const VideoContent = require('../models/VideoContent');

// Get videos for a specific markdown file
router.get('/by-markdown/:path(*)', async (req, res) => {
  try {
    const markdownPath = req.params.path;
    const videos = await VideoContent.find({ 
      markdownPath, 
      active: true 
    }).sort('order');

    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos'
    });
  }
});

module.exports = router;