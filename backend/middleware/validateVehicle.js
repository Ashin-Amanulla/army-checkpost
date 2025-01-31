const validateVehicleEntry = async (req, res, next) => {
    try {
        console.log('Validation middleware:', {
            body: req.body,
            file: req.file,
            contentType: req.headers['content-type']
        });

        const { vehicleNumber, vehicleType, driverName, driverPhone, purpose, checkpost } = req.body;

        // Basic validation
        if (!vehicleNumber || !vehicleType || !driverName || !driverPhone || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Checkpost validation
        if (req.user.role === 'user') {
            // Regular users can only create entries for their assigned checkpost
            req.body.checkpost = req.user.checkpost;
        } else if (!checkpost) {
            // Admin/super_admin must specify a checkpost
            return res.status(400).json({
                success: false,
                message: 'Checkpost is required'
            });
        }

        next();
    } catch (error) {
        console.error('Error in validation:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    validateVehicleEntry
}; 