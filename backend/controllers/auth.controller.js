const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

exports.register = async (req, res) => {
    try {
        const { username, password, email, role, checkpost } = req.body;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({
            username,
            password,
            email,
            role,
            checkpost
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                tokenCreatedAt: new Date().toISOString()
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 