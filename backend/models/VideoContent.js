const mongoose = require('mongoose');

const videoContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  youtubeUrl: {
    type: String,
    required: true
  },
  markdownPath: {
    type: String,
    required: true,
    // This will store the relative path to the markdown file
    // e.g., "0101-Setup-Procedures/010101-Setup-System.md"
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoContent', videoContentSchema);