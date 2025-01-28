const VehicleType = require('../models/VehicleType');

exports.createVehicleType = async (req, res) => {
    try {
        const vehicleType = await VehicleType.create(req.body);
        res.status(201).json(vehicleType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVehicleTypes = async (req, res) => {
    try {
        const vehicleTypes = await VehicleType.find({ active: true });
        res.json(vehicleTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateVehicleType = async (req, res) => {
    try {
        const vehicleType = await VehicleType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!vehicleType) {
            return res.status(404).json({ message: 'Vehicle type not found' });
        }

        res.json(vehicleType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteVehicleType = async (req, res) => {
    try {
        const vehicleType = await VehicleType.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!vehicleType) {
            return res.status(404).json({ message: 'Vehicle type not found' });
        }

        res.json({ message: 'Vehicle type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 