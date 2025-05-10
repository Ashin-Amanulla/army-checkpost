// seedSuperAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path to your User model
require('dotenv').config();

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/army-checkpost';

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if super admin exists
        const adminExists = await User.deleteOne({ username: 'super_admin' });
        // if (adminExists) {
        //     console.log('Super admin already exists');
        //     process.exit(0);
        // }

        // Create super admin
        const superAdmin = await User.create({
            username: 'xyvin_super_admin',
            password: 'xyvin@123',
            email: 'xyvin@gmail.com',
            role: 'super_admin',
            active: true
        });

        console.log('Super admin created:', superAdmin);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding super admin:', error);
        process.exit(1);
    }
};

// Run the seeding
module.exports = seedSuperAdmin;
