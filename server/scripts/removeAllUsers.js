require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const removeAllUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users from the database`);

    process.exit(0);
  } catch (error) {
    console.error('Error removing users:', error);
    process.exit(1);
  }
};

removeAllUsers();
