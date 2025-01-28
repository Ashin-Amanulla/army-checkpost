const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ username: 'admin' });
        console.log('Admin details:', {
            exists: !!admin,
            username: admin?.username,
            role: admin?.role,
            hasPassword: !!admin?.password,
            passwordLength: admin?.password?.length
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyAdmin(); 