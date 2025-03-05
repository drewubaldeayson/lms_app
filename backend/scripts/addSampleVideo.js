// backend/scripts/addSampleVideos.js
require('dotenv').config();
const mongoose = require('mongoose');
const VideoContent = require('../models/VideoContent');

const sampleVideos = [
  {
    title: "Setup System Tutorial",
    description: "A comprehensive guide on how to set up the system",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example YouTube video
    markdownPath: "0101-Setup-Procedures/010101-Setup-System.md",
    order: 1,
    active: true
  },
  {
    title: "Version Control Setup",
    description: "Learn how to set up version control for the project",
    youtubeUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ", // Different example video
    markdownPath: "0101-Setup-Procedures/010102-Version-Setup.md",
    order: 1,
    active: true
  },
  // Add more sample videos as needed
];

const addSampleVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge-base');
    console.log('Connected to MongoDB');

    // Clear existing videos
    await VideoContent.deleteMany({});
    console.log('Cleared existing videos');

    // Add new sample videos
    const result = await VideoContent.insertMany(sampleVideos);
    console.log('Added sample videos:', result);

    console.log('Sample videos have been added successfully');
  } catch (error) {
    console.error('Error adding sample videos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

addSampleVideos();