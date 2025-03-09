module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: `mongodb://admin:admin@mongodb:27017/?directConnection=true&authSource=admin`,
    jwtSecret: process.env.JWT_SECRET,
};