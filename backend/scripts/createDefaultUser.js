// backend/scripts/createDefaultUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const defaultUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'training', password: 'Muli-training-101' }
];


// async function createDefaultUser() {
//     try { 

//         // Log the connection string (remove sensitive info)
//         const connectionString = `mongodb://admin:admin@mongodb:27017/?directConnection=true&authSource=admin`;


//         console.log('Connecting to MongoDB with URI:', 
//             connectionString.replace(/:([^:@]{1,}?)@/, ':****@'));

//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('Connected to MongoDB');
        
//         // Check if user already exists
//         const existingUser = await User.findOne({ username: defaultUser.username });
        
//         if (existingUser) {
//             console.log('Default user already exists');
//             createTrainingUser();
//             return;
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(defaultUser.password, salt);

//         // Create new user
//         const user = new User({
//             username: defaultUser.username,
//             password: hashedPassword
//         });

//         await user.save();
//         console.log('Default user created successfully');
//     } catch (error) {
//         console.error('Error creating default user:', error);
//     } finally {
//         await mongoose.disconnect();
//         console.log('Disconnected from MongoDB');
//     }
// }

async function createDefaultUser() {
    try { 

        // Log the connection string (remove sensitive info)
        const connectionString = `mongodb://admin:admin@mongodb:27017/?directConnection=true&authSource=admin`;


        console.log('Connecting to MongoDB with URI:', 
            connectionString.replace(/:([^:@]{1,}?)@/, ':****@'));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');


        for (const userData of defaultUsers) {
        
            // Check if user already exists
            const existingUser = await User.findOne({ username: userData.username });
            
            if (existingUser) {
                console.log('User already exists');
                return;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // Create new user
            const user = new User({
                username: userData.username,
                password: hashedPassword
            });

            await user.save();
            console.log('User created successfully');
        }
    } catch (error) {
        console.error('Error creating Training user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createDefaultUser();
