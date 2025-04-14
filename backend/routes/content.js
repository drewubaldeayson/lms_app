// backend/routes/content.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const dirTree = require('directory-tree'); // Add this import
const API_URL = process.env.REACT_APP_API_URL || 'https://docs.muli.com.au:5000';
const VideoContent = require('../models/VideoContent');

// Get directory tree
router.get('/tree', (req, res) => {
  try {
    const markdownDir = path.join(process.cwd(), 'markdown-files');
    console.log('Markdown directory:', markdownDir); // Debug log

    const tree = dirTree(markdownDir, {
      // extensions: /\.md$/,
      normalizePath: true,
      attributes: ['size', 'mtime'],
      exclude: /node_modules/
    });

    const transformTree = (node) => {
      if (node.path) {
        // Make path relative to markdown-files directory
        node.path = path.relative(markdownDir, node.path).replace(/\\/g, '/');
      }
      
      // Custom sorting function
      const customSort = (a, b) => {
        // Extract numeric prefixes
        const extractPrefix = (filename) => {
          const match = filename.match(/^(\d+(?:\.\d+)*)/);
          return match ? match[1].split('.').map(Number) : [];
        };
    
        const prefixA = extractPrefix(a.name);
        const prefixB = extractPrefix(b.name);
    
        // Compare numeric prefixes
        for (let i = 0; i < Math.min(prefixA.length, prefixB.length); i++) {
          if (prefixA[i] !== prefixB[i]) {
            return prefixA[i] - prefixB[i];
          }
        }
    
        // If prefixes are the same, compare lengths
        return prefixA.length - prefixB.length;
      };
    
      // Sort children if they exist
      if (node.children) {
        node.children = node.children
          .map(transformTree) // Recursively transform child nodes
          .sort(customSort);
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
    const defaultMarkdownDir = path.join(process.cwd(), 'markdown-files');
    const manualMarkdownDir = path.join(process.cwd(), 'markdown-files-manual');

    let filePath = path.join(defaultMarkdownDir, req.params.path);
    let markdownDir = defaultMarkdownDir;

    try {
      await fs.access(filePath);
    } catch (defaultError) {
      // If not in default, try manual directory
      filePath = path.join(manualMarkdownDir, req.params.path);
      markdownDir = manualMarkdownDir;
      
      try {
        await fs.access(filePath);
      } catch (manualError) {
        console.error('File not found in either directory:', req.params.path);
        return res.status(404).json({
          success: false,
          message: `File not found: ${req.params.path}`
        });
      }
    }

    // Read file content
    let content = await fs.readFile(filePath, 'utf8');

    // Get the directory of the current markdown file
    const fileDir = path.dirname(req.params.path);

    content = content.replace(
      /!\$\$(.*?)\$\$\$\$(\.\/attachments\/[^)]+)\$\$/g,
      (match, altText, imagePath) => {
        const relativePath = imagePath.replace('./', '');
        const encodedPath = encodeURIComponent(relativePath);
        
        const fullUrl = `${API_URL}/api/content/${path.dirname(req.params.path)}/attachments/${encodedPath}`;
    
        console.log('Image path transformed:', fullUrl);
        return `![${altText}](${fullUrl})`;
      }
    );

    // Extract headings
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;
    let uniqueIds = new Set();
    
    while ((match = headingRegex.exec(content)) !== null) {
      // Clean the heading text (remove markdown formatting)
      const cleanText = match[2]
        // Remove bold and italic markdown
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // Remove code backticks
        .replace(/`([^`]+)`/g, '$1')
        // Remove links
        .replace(/$$([^$$]+)\]$$[^$$]+\)/g, '$1')
        .trim();

      // Generate base ID
      let baseId = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens


      // Ensure unique ID
      let id = baseId;
      let counter = 1;
      while (uniqueIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }
      uniqueIds.add(id);
      
      headings.push({
        level: match[1].length,
        text: cleanText,
        id: id
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

router.put('/file/:path(*)', async (req, res) => {
  try {
    const markdownDir = path.join(process.cwd(), 'markdown-files');
    const filePath = path.join(markdownDir, req.params.path);
    const { content } = req.body;

    // Validate path and content
    if (!req.params.path || !content) {
      return res.status(400).json({
        success: false,
        message: 'Path and content are required'
      });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('File not found:', filePath);
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }


    // Ensure the file is within the markdown-files directory
    const relativePath = path.relative(markdownDir, filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid file path'
      });
    }

    // Ensure it's a markdown file
    if (!filePath.endsWith('.md')) {
      return res.status(403).json({
        success: false,
        message: 'Can only edit markdown files'
      });
    }

    // Write the updated content to the file
    const updatedContent = await fs.writeFile(filePath, content, 'utf8');

     // Extract headings from updated content
     const headings = [];
     const headingRegex = /^(#{1,3})\s+(.+)$/gm;
     let match;
     
     while ((match = headingRegex.exec(updatedContent)) !== null) {
       headings.push({
         level: match[1].length,
         text: match[2],
         id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
       });
     }
 
     res.json({
       success: true,
       data: {
         content: updatedContent,
         headings,
         message: 'Content updated successfully'
       }
     });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
});



//manual content

router.get('/tree/manual', (req, res) => {
  try {
    const markdownDir = path.join(process.cwd(), 'markdown-files-manual');
    console.log('Markdown directory:', markdownDir); // Debug log

    const tree = dirTree(markdownDir, {
      // extensions: /\.md$/,
      normalizePath: true,
      attributes: ['size', 'mtime'],
      exclude: /node_modules/
    });

    const transformTree = (node) => {
      if (node.path) {
        // Make path relative to markdown-files directory
        node.path = path.relative(markdownDir, node.path).replace(/\\/g, '/');
      }
      
      // Custom sorting function
      const customSort = (a, b) => {
        // Extract numeric prefixes
        const extractPrefix = (filename) => {
          const match = filename.match(/^(\d+(?:\.\d+)*)/);
          return match ? match[1].split('.').map(Number) : [];
        };
    
        const prefixA = extractPrefix(a.name);
        const prefixB = extractPrefix(b.name);
    
        // Compare numeric prefixes
        for (let i = 0; i < Math.min(prefixA.length, prefixB.length); i++) {
          if (prefixA[i] !== prefixB[i]) {
            return prefixA[i] - prefixB[i];
          }
        }
    
        // If prefixes are the same, compare lengths
        return prefixA.length - prefixB.length;
      };
    
      // Sort children if they exist
      if (node.children) {
        node.children = node.children
          .map(transformTree) // Recursively transform child nodes
          .sort(customSort);
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

module.exports = router;