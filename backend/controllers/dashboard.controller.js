const VehicleEntry = require('../models/Vehicle');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());

            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            // Get user's checkpost
            const checkpostFilter = req.user.role === 'user'
                ? { checkpost: req.user.checkpost }
                : {};

            // Get all stats in parallel
            const [
                todayEntries,
                activeVehicles,
                totalEntries,
                weeklyTotal,
                monthlyTotal
            ] = await Promise.all([
                // Today's entries
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: today }
                }),

                // Active vehicles
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    status: 'entered'
                }),

                // Total entries
                VehicleEntry.countDocuments(checkpostFilter),

                // Weekly total
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: weekStart }
                }),

                // Monthly total
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: monthStart }
                })
            ]);

            // Get recent entries
            const recentEntries = await VehicleEntry.find(checkpostFilter)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name')
                .populate('createdBy', 'username')
                .sort('-createdAt')
                .limit(5);

            res.json({
                success: true,
                data: {
                    todayEntries,
                    activeVehicles,
                    totalEntries,
                    recentEntries,
                    weeklyTotal,
                    monthlyTotal
                }
            });
        } catch (error) {
            console.error('Error in getStats:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = dashboardController; 