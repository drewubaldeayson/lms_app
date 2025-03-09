// backend/scripts/changePassword.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => {
    rl.question(query, resolve);
});

const changePassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://170.64.202.114:27017/knowledge-base');
        console.log('Connected to MongoDB');

        // Get new password
        const password = await question('Enter new password: ');
        const confirmPassword = await question('Confirm new password: ');

        // Check if passwords match
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        // Validate password
        if (password.length < 8) {
            console.error('Password must be at least 8 characters long');
            return;
        }

        // Find admin user
        const user = await User.findOne({ username: 'admin' });
        if (!user) {
            console.error('Admin user not found');
            return;
        }

        // Hash and update password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();

        console.log('Password updated successfully');

    } catch (error) {
        console.error('Error changing password:', error);
    } finally {
        rl.close();
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

changePassword();