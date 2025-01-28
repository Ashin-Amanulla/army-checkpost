const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const deleteAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteOne({ username: 'admin' });
        console.log('Admin deleted');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteAdmin(); 