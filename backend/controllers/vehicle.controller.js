const VehicleEntry = require('../models/Vehicle');

const vehicleController = {
    // Create new vehicle entry
    createEntry: async (req, res) => {
        try {
            console.log('Full Request:', {
                body: req.body,
                file: req.file,
                user: req.user,
                headers: req.headers['content-type']
            });

            // Validate required fields
            if (!req.body.vehicleNumber || !req.body.vehicleType ||
                !req.body.driverName || !req.body.driverPhone ||
                !req.body.purpose) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const entry = await VehicleEntry.create({
                vehicleNumber: req.body.vehicleNumber,
                vehicleType: req.body.vehicleType,
                driverName: req.body.driverName,
                driverPhone: req.body.driverPhone,
                purpose: req.body.purpose,
                createdBy: req.user._id,
                checkpost: req.body.checkpost || req.user.checkpost,
                photoUrl: req.file ? (req.file.location || `/uploads/${req.file.filename}`) : null
            });

            const populatedEntry = await VehicleEntry.findById(entry._id)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code')
                .populate('createdBy', 'username fullName');

            res.status(201).json({
                success: true,
                data: populatedEntry
            });
        } catch (error) {
            console.error('Error in createEntry:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all vehicle entries with filters
    getEntries: async (req, res) => {
        try {
            const { startDate, endDate, vehicleType, checkpost, search, page = 1, limit = 10 } = req.query;
            let query = {};

            // Date filter
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Other filters
            if (vehicleType) query.vehicleType = vehicleType;
            if (checkpost) query.checkpost = checkpost;
            if (search) {
                query.$or = [
                    { vehicleNumber: new RegExp(search, 'i') },
                    { driverName: new RegExp(search, 'i') }
                ];
            }

            // Checkpost restriction for regular users
            if (req.user.role === 'user') {
                query.checkpost = req.user.checkpost;
            }

            const skip = (page - 1) * limit;

            const [entries, total] = await Promise.all([
                VehicleEntry.find(query)
                    .populate('vehicleType', 'name')
                    .populate('checkpost', 'name code location')
                    .populate('createdBy', 'username fullName')
                    .select('vehicleNumber vehicleType checkpost createdBy driverName driverPhone purpose photoUrl createdAt')
                    .sort('-createdAt')
                    .skip(skip)
                    .limit(Number(limit)),
                VehicleEntry.countDocuments(query)
            ]);

            res.json({
                success: true,
                data: entries,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get single entry by ID
    getEntryById: async (req, res) => {
        try {
            const entry = await VehicleEntry.findById(req.params.id)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code location')
                .populate('createdBy', 'username fullName');

            if (!entry) {
                return res.status(404).json({
                    success: false,
                    message: 'Entry not found'
                });
            }

            res.json({
                success: true,
                data: entry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get vehicle history by vehicle number
    getVehicleHistory: async (req, res) => {
        try {
            const entries = await VehicleEntry.find({
                vehicleNumber: new RegExp(req.params.vehicleNumber, 'i')
            })
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code')
                .populate('createdBy', 'username fullName')
                .sort('-createdAt');

            res.json({
                success: true,
                data: entries
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Handle photo upload
    uploadPhoto: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const photoUrl = req.file.location || `/uploads/${req.file.filename}`;

            res.json({
                success: true,
                data: { photoUrl }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to upload photo'
            });
        }
    },

    updateExit: async (req, res) => {
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
    },

    createVehicle: async (req, res) => {
        try {
            const {
                vehicleNumber,
                vehicleType,
                checkpost
            } = req.body;

            const vehicle = new VehicleEntry({
                vehicleNumber,
                vehicleType,
                checkpost: checkpost || req.user.checkpost,
                createdBy: req.user._id
            });

            await vehicle.save();

            res.status(201).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getVehicles: async (req, res) => {
        try {
            const checkpostFilter =
                ['super_admin', 'admin'].includes(req.user.role)
                    ? {}
                    : { checkpost: req.user.checkpost };

            const vehicles = await VehicleEntry.find(checkpostFilter)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code')
                .populate('createdBy', 'username')
                .sort('-createdAt');

            res.json({
                success: true,
                data: vehicles
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = vehicleController; 