const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_post_app', {
      family: 4 // Force IPv4 to resolve any local IPv6 connection issues
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}. Continuing with in-memory fallback.`);
    // process.exit(1);
  }
};

module.exports = connectDB;
