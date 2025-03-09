module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongodb:27017/knowledge-base?authSource=admin`,
    jwtSecret: process.env.JWT_SECRET,
};