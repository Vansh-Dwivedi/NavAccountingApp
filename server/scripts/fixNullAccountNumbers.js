const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixNullAccountNumbers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find all users with null accountNumber
    const usersWithNullAccount = await User.find({ accountNumber: null });
    console.log(`Found ${usersWithNullAccount.length} users with null accountNumber`);

    // Update each user with a unique account number
    for (const user of usersWithNullAccount) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000);
      const accountNumber = `F-${randomNum}`; // F for Fixed
      
      await User.findByIdAndUpdate(user._id, { accountNumber });
      console.log(`Updated user ${user.email} with account number ${accountNumber}`);
    }

    console.log('All null accountNumber users have been updated');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixNullAccountNumbers();
