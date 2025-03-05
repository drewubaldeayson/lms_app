// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.put('/update-username', auth, async (req, res) => {
  try {
    const { newUsername } = req.body;

    if (!newUsername || newUsername.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ 
      username: newUsername,
      _id: { $ne: req.userData.userId }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Update username
    const user = await User.findByIdAndUpdate(
      req.userData.userId,
      { username: newUsername },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        username: user.username
      }
    });

  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating username'
    });
  }
});

module.exports = router;