// backend/scripts/createDefaultUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


async function createDefaultUser() {
    try {
        const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongodb:27017/knowledge-base?authSource=admin`;
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ username: 'admin' });
        if (existingUser) {
            console.log('Admin user already exists');
            return;
        }

        // Create new admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = new User({
            username: 'admin',
            password: hashedPassword
        });

        await user.save();
        console.log('Initial admin user created successfully');

    } catch (error) {
        console.error('Error creating initial user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createDefaultUser();