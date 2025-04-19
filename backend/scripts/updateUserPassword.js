
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function updateUserPassword(username, newPassword) {
    try {
        const connectionString = `mongodb://admin:admin@mongodb:27017/?directConnection=true&authSource=admin`;

        console.log('Connecting to MongoDB with URI:', 
            connectionString.replace(/:([^:@]{1,}?)@/, ':****@'));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ username: username });
        
        if (!user) {
            console.log(`User with username '${username}' not found`);
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        console.log(`Password for user '${username}' updated successfully`);
    } catch (error) {
        console.error('Error updating user password:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// The 1st parameter is the username while the other is the password. 
// Specify the username in the 1st parameter first then change the password in the right side.
// Run this command after updating this
// docker-compose -f docker-compose.dev.yml exec backend node scripts/updateUserPassword.js
updateUserPassword('admin', 'newPassword123');
