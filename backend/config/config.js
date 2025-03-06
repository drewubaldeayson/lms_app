module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/knowledge-base',
    jwtSecret: process.env.JWT_SECRET || 'jasodifjasoifjoajfodajfosidjfoiasdjfosaidfjosaifjiasof',
};