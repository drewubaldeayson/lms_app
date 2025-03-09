module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://admin:admin@mongodb:27017/knowledge-base?authSource=admin',
    jwtSecret: process.env.JWT_SECRET || 'jasodifjasoifjoajfodajfosidjfoiasdjfosaidfjosaifjiasof',
};