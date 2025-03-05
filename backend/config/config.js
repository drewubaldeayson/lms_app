// backend/config/config.js
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' 
      ? '.env.production' 
      : '.env.development'
});
  
module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
};