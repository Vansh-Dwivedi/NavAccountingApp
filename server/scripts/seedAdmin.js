require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all existing users');

    // Create admin user
    const adminUser = new User({
      email: 'admin@navaccounting.com',
      username: 'admin',
      password: await bcrypt.hash('Admin@123', 10),
      pin: '1234', // Default sleep PIN
      role: 'admin',
      isVerified: true,
      firmId: 'ADMIN001',
      
    });

    await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Username:', adminUser.username);
    console.log('Password: Admin@123');
    console.log('Sleep PIN: 1234');
    console.log('Firm ID:', adminUser.firmId);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
