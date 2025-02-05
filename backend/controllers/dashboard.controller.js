const VehicleEntry = require('../models/Vehicle');
const VehicleType = require('../models/VehicleType');
const { startOfWeek, eachDayOfInterval, format, startOfToday, endOfToday, subDays, startOfDay, startOfMonth } = require('date-fns');
const Checkpost = require('../models/Checkpost');

const dashboardController = {
    getStats: async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const weekStart = startOfWeek(today);
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            // Get user's checkpost filter
            const checkpostFilter = req.user.role === 'user'
                ? { checkpost: req.user.checkpost }
                : {};

            // Get basic stats
            const [
                todayEntries,
                totalEntries,
                weeklyTotal,
                monthlyTotal,
                activeCheckposts
            ] = await Promise.all([
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: today }
                }),
                VehicleEntry.countDocuments(checkpostFilter),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: weekStart }
                }),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: monthStart }
                }),
                Checkpost.countDocuments({ active: true })
            ]);

            // Get weekly trends
            const weeklyTrends = await VehicleEntry.aggregate([
                {
                    $match: {
                        ...checkpostFilter,
                        createdAt: { $gte: weekStart }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1
                    }
                },
                { $sort: { date: 1 } }
            ]);

            // Get distribution data for different time ranges
            const [dailyDist, weeklyDist, monthlyDist] = await Promise.all([
                getCheckpostDistribution(startOfDay(new Date()), checkpostFilter),
                getCheckpostDistribution(startOfWeek(new Date()), checkpostFilter),
                getCheckpostDistribution(startOfMonth(new Date()), checkpostFilter)
            ]);

            // Get recent entries
            const recentEntries = await VehicleEntry.find(checkpostFilter)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code')
                .populate('createdBy', 'username')
                .sort('-createdAt')
                .limit(10);

            res.json({
                success: true,
                data: {
                    todayEntries,
                    activeCheckposts,
                    totalEntries,
                    weeklyTotal,
                    monthlyTotal,
                    recentEntries,
                    weeklyTrends,
                    dailyCheckpostDistribution: dailyDist,
                    weeklyCheckpostDistribution: weeklyDist,
                    monthlyCheckpostDistribution: monthlyDist
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

const getCheckpostDistribution = async (startDate, baseFilter = {}) => {
    return VehicleEntry.aggregate([
        {
            $match: {
                ...baseFilter,
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: "$checkpost",
                value: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "checkposts",
                localField: "_id",
                foreignField: "_id",
                as: "checkpostInfo"
            }
        },
        {
            $project: {
                _id: 0,
                name: { $arrayElemAt: ["$checkpostInfo.name", 0] },
                value: 1
            }
        }
    ]);
};

module.exports = dashboardController; 