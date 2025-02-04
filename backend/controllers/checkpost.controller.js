const Checkpost = require('../models/Checkpost');

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

        res.json(checkpost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCheckpost = async (req, res) => {
    try {
        const checkpost = await Checkpost.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!checkpost) {
            return res.status(404).json({ message: 'Checkpost not found' });
        }

        res.json({ message: 'Checkpost deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 