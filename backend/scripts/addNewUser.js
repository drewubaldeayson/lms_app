// backend/scripts/addNewUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const defaultUser = {
    username: 'training',
    password: 'Muli-training-101'
};

async function addNewUser() {
    try { 

        // Log the connection string (remove sensitive info)
        const connectionString = `mongodb://admin:admin@mongodb:27017/?directConnection=true&authSource=admin`;


        console.log('Connecting to MongoDB with URI:', 
            connectionString.replace(/:([^:@]{1,}?)@/, ':****@'));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Check if user already exists
        const existingUser = await User.findOne({ username: defaultUser.username });
        
        if (existingUser) {
            console.log('Default user already exists');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultUser.password, salt);

        // Create new user
        const user = new User({
            username: defaultUser.username,
            password: hashedPassword
        });

        await user.save();
        console.log('Default user created successfully');
    } catch (error) {
        console.error('Error creating default user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

addNewUser();