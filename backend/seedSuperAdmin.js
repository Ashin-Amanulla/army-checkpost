// seedSuperAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path to your User model
require("dotenv").config();

// Replace with your actual MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/army-checkpost";

const seedSuperAdmin = async () => {
  try {
    // Configure mongoose connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("Connected to MongoDB");

    // Check if super admin exists
    const adminExists = await User.findOne({ username: "xyvin_super_admin" });
    if (adminExists) {
      console.log("Super admin already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await User.create({
      username: "xyvin_super_admin",
      password: "xyvin@123",
      email: "xyvin@gmail.com",
      role: "super_admin",
      active: true,
    });

    console.log("Super admin created:", superAdmin);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding super admin:", error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the seeding
module.exports = seedSuperAdmin;
