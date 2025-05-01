const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('checkpost').select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update password if provided
        if (password) {
            user.password = password;
            await user.save(); // This will trigger the password hash middleware
        }

        // Update other fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Instead of deleting the user, set them as inactive
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                active: false,
                deactivatedAt: new Date()
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User deactivated successfully',
            user: {
                id: user._id,
                username: user.username,
                active: user.active
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 