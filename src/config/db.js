const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async (start) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected!');
        start();
    } catch(error) {
        console.log("❌ MongoDB connection failed!");
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;
