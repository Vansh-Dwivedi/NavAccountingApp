const mongoose = require('mongoose');
require('dotenv').config();

const removeUniqueConstraint = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Get the database instance
    const db = mongoose.connection.db;
    
    // Drop the index on accountNumber
    await db.collection('users').dropIndex('accountNumber_1');
    console.log('Successfully dropped the unique index on accountNumber');
    
    // Create a new non-unique index if needed
    // await db.collection('users').createIndex({ accountNumber: 1 }, { unique: false });
    // console.log('Created new non-unique index on accountNumber');

    console.log('Operation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

removeUniqueConstraint();
