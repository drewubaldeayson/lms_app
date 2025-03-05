// backend/routes/content.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const dirTree = require('directory-tree'); // Add this import

const VideoContent = require('../models/VideoContent');

// Get directory tree
router.get('/tree', (req, res) => {
  try {
    const markdownDir = path.join(process.cwd(), 'markdown-files');
    console.log('Markdown directory:', markdownDir); // Debug log

    const tree = dirTree(markdownDir, {
      extensions: /\.md$/,
      normalizePath: true,
      attributes: ['size', 'mtime'],
      exclude: /node_modules/
    });

    // Transform the tree to use relative paths
    const transformTree = (node) => {
      if (node.path) {
        // Make path relative to markdown-files directory
        node.path = path.relative(markdownDir, node.path).replace(/\\/g, '/');
      }
      if (node.children) {
        node.children = node.children.map(transformTree);
      }
      return node;
    };

    const transformedTree = transformTree(tree);
    console.log('Transformed tree:', JSON.stringify(transformedTree, null, 2)); // Debug log

    res.json({
      success: true,
      data: transformedTree
    });
  } catch (error) {
    console.error('Error getting directory tree:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching directory structure'
    });
  }
});

// Get file content
router.get('/file/:path(*)', async (req, res) => {
  try {
    const markdownDir = path.join(process.cwd(), 'markdown-files');
    const filePath = path.join(markdownDir, req.params.path);
    
    console.log('Requested path:', req.params.path);
    console.log('Full file path:', filePath);

    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('File exists at:', filePath);
    } catch (error) {
      console.error('File not found:', filePath);
      return res.status(404).json({
        success: false,
        message: `File not found: ${req.params.path}`
      });
    }

    // Read file content
    let  content = await fs.readFile(filePath, 'utf8');

    // Get the directory of the current markdown file
    const fileDir = path.dirname(req.params.path);

    content = content.replace(
      /!$$(.*?)$$$$(\.\/attachments\/[^)]+)$$/g,
      (match, altText, imagePath) => {
        // Remove './' from the path
        const relativePath = imagePath.replace('./', '');
        // Construct the full URL using the file's directory
        const fullUrl = `http://localhost:5000/${fileDir}/${relativePath}`;
        console.log('Image path transformed:', fullUrl);
        return `![${altText}](${fullUrl})`;
      }
    );

    
    // Extract headings
    const headings = [];
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
      });
    }

    // Get associated videos
    try {
        const videos = await VideoContent.find({ 
          markdownPath: req.params.path,
          active: true 
        }).sort('order');
        console.log('Found videos:', videos.length);
  
        res.json({
          success: true,
          data: {
            content,
            headings,
            path: req.params.path,
            videos: videos // Include videos in the response
          }
        });
    } catch (dbError) {
        console.error('Error fetching videos:', dbError);
        // Still return content even if video fetch fails
        res.json({
          success: true,
          data: {
            content,
            headings,
            path: req.params.path,
            videos: [] // Return empty array if video fetch fails
          }
        });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading file content',
      error: error.message
    });
  }
});

// Get videos for a specific markdown file
router.get('/videos/:path(*)', async (req, res) => {
    try {
      const videos = await VideoContent.find({ 
        markdownPath: req.params.path,
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

// Add a new video to a markdown file (for future admin use)
router.post('/videos/:path(*)', async (req, res) => {
    try {
      const { title, description, youtubeUrl, order } = req.body;
      
      const video = new VideoContent({
        title,
        description,
        youtubeUrl,
        markdownPath: req.params.path,
        order: order || 0
      });
  
      await video.save();
  
      res.json({
        success: true,
        data: video
      });
    } catch (error) {
      console.error('Error adding video:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding video'
      });
    }
});

module.exports = router;