// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username); // Debug log

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Invalid password'); // Debug log
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Success response
        return res.json({
            success: true,
            data: {
                token,
                username: user.username,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: `An error occurred during login: ${error.message || error}`
        });
    }
});


router.get('/validate-token', auth, async (req, res) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                valid: false, 
                message: 'No token provided' 
            });
        }

        // Extract the token (assuming "Bearer <token>" format)
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                valid: false, 
                message: 'Invalid token format' 
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user still exists
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                valid: false, 
                message: 'User no longer exists' 
            });
        }

        // Optional: Check for additional conditions like account status
        if (user.isDeactivated) {
            return res.status(401).json({ 
                valid: false, 
                message: 'Account is deactivated' 
            });
        }

        // Token is valid
        return res.json({ 
            valid: true,
            username: user.username,
            lastLogin: user.lastLogin
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                valid: false, 
                message: 'Token expired' 
            });
        }

        console.error('Token validation error:', error);
        return res.status(500).json({ 
            valid: false, 
            message: 'Internal server error during token validation' 
        });
    }
});


module.exports = router;