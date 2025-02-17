const Settings = require('../models/Settings');

const settingsController = {
    updateSettings: async (req, res) => {
        try {
            const { rtoApiKey } = req.body;

            const settings = await Settings.findOneAndUpdate(
                {}, // empty filter to update first document
                {
                    rtoApiKey,
                    updatedBy: req.user._id,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );

            res.json({
                success: true,
                data: settings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getSettings: async (req, res) => {
        try {
            const settings = await Settings.findOne();
            res.json({
                success: true,
                data: settings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    verifyVehicle: async (req, res) => {
        try {
            const { vehicleNumber } = req.params;
            const settings = await Settings.findOne();

            if (!settings?.rtoApiKey) {
                return res.status(400).json({
                    success: false,
                    message: 'RTO API key not configured'
                });
            }

            const response = await fetch(
                `https://rappid.in/apis/rto/rc_vehicle_details.php?key=${settings.rtoApiKey}&vehicle_no=${vehicleNumber}&consent=y`
            );

            const data = await response.json();
            console.log(data);
            res.json({
                success: true,
                data:data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = settingsController; 