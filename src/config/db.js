const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async (start) => {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/dern-support');
            console.log('✅ MongoDB connected!');
            start();
            return;
        } catch(error) {
            retries++;
            console.log(`❌ MongoDB connection attempt ${retries} failed!`);
            console.error(error);
            
            if (retries === maxRetries) {
                if (process.env.NODE_ENV === 'production') {
                    console.error('Failed to connect to MongoDB after multiple retries');
                    // In production, we might want to notify admin/DevOps here
                    process.exit(1);
                } else {
                    console.error('Failed to connect to MongoDB - continuing without database');
                    start();
                }
            } else {
                // Wait for 5 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}

module.exports = connectDB;
