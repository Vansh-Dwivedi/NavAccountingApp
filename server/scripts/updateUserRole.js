require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateFirstUserRole() {
    try {
        const uri = "mongodb://admin:Vansh-2001@ec2-13-52-123-244.us-west-1.compute.amazonaws.com:27017/nav-accounting-2?authSource=admin";
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const firstUser = await User.findOne({});
        if (!firstUser) {
            console.log('No users found in the database');
            return;
        }

        firstUser.role = 'admin';
        await firstUser.save();

        console.log(`Updated user ${firstUser.email} role to admin`);
    } catch (error) {
        console.error('Error updating user role:', error);
    } finally {
        await mongoose.connection.close();
    }
}

updateFirstUserRole();
