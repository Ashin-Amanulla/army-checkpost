const VehicleEntry = require('../models/Vehicle');

exports.createEntry = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vehicle photo is required' });
        }
console.log(req.file);
        const entry = await VehicleEntry.create({
            ...req.body,
            photoUrl: req.file.location,
            entryBy: req.user._id,
            checkpost: req.user.checkpost
        });

        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateExit = async (req, res) => {
    try {
        const entry = await VehicleEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        if (entry.checkpost.toString() !== req.user.checkpost.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        entry.exitTime = Date.now();
        entry.status = 'exited';
        await entry.save();

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEntries = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            vehicleType,
            checkpost,
            status
        } = req.query;

        let query = {};

        if (startDate && endDate) {
            query.entryTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (vehicleType) query.vehicleType = vehicleType;
        if (checkpost) query.checkpost = checkpost;
        if (status) query.status = status;

        // If user role is 'user', only show their checkpost entries
        if (req.user.role === 'user') {
            query.checkpost = req.user.checkpost;
        }

        const entries = await VehicleEntry.find(query)
            .populate('vehicleType')
            .populate('checkpost')
            .populate('entryBy', 'fullName')
            .sort('-entryTime');

        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVehicleHistory = async (req, res) => {
    try {
        const entries = await VehicleEntry.find({
            vehicleNumber: req.params.vehicleNumber
        })
            .populate('vehicleType')
            .populate('checkpost')
            .populate('entryBy', 'fullName')
            .sort('-entryTime');

        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEntryById = async (req, res) => {
    try {
        const entry = await VehicleEntry.findById(req.params.id)
            .populate('vehicleType')
            .populate('checkpost')
            .populate('entryBy', 'fullName');

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 