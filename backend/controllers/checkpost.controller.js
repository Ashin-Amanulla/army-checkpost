const Checkpost = require('../models/Checkpost');
const User = require('../models/User');

exports.createCheckpost = async (req, res) => {
    try {
        const checkpost = await Checkpost.create(req.body);
        res.status(201).json(checkpost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCheckposts = async (req, res) => {
    try {
        const checkposts = await Checkpost.find();
        res.json(checkposts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCheckpost = async (req, res) => {
    try {
        const checkpost = await Checkpost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!checkpost) {
            return res.status(404).json({ message: 'Checkpost not found' });
        }

        // If checkpost is deactivated, update associated users
        if (req.body.active === false) {
            // Find all users associated with this checkpost and deactivate them
            await User.updateMany(
                { checkpost: req.params.id },
                { active: false }
            );
        }

        res.json(checkpost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCheckpost = async (req, res) => {
    try {
        const checkpost = await Checkpost.findByIdAndDelete(
            req.params.id
        );

        if (!checkpost) {
            return res.status(404).json({ message: 'Checkpost not found' });
        }

        // Deactivate all users associated with this checkpost when it's deleted
        await User.updateMany(
            { checkpost: req.params.id },
            { active: false }
        );

        res.json({ message: 'Checkpost deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 