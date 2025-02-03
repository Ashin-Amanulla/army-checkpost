const VehicleEntry = require('../models/Vehicle');
const VehicleType = require('../models/VehicleType');
const { startOfWeek, eachDayOfInterval, format, startOfToday, endOfToday, subDays } = require('date-fns');

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
                activeVehicles,
                totalEntries,
                weeklyTotal,
                monthlyTotal
            ] = await Promise.all([
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: today }
                }),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    status: 'entered'
                }),
                VehicleEntry.countDocuments(checkpostFilter),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: weekStart }
                }),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: monthStart }
                })
            ]);

            // Get vehicle type distribution
            const vehicleTypeData = await VehicleEntry.aggregate([
                { $match: checkpostFilter },
                {
                    $lookup: {
                        from: 'vehicletypes',
                        localField: 'vehicleType',
                        foreignField: '_id',
                        as: 'vehicleType'
                    }
                },
                { $unwind: '$vehicleType' },
                {
                    $group: {
                        _id: '$vehicleType._id',
                        name: { $first: '$vehicleType.name' },
                        value: { $sum: 1 }
                    }
                }
            ]);

            // Get weekly trends
            const weeklyTrends = await Promise.all(
                eachDayOfInterval({ start: weekStart, end: today })
                    .map(async (date) => {
                        const nextDay = new Date(date);
                        nextDay.setDate(date.getDate() + 1);
                        
                        const count = await VehicleEntry.countDocuments({
                            ...checkpostFilter,
                            createdAt: {
                                $gte: date,
                                $lt: nextDay
                            }
                        });

                        return {
                            day: format(date, 'EEE'),
                            entries: count
                        };
                    })
            );

            // Get hourly distribution for today
            const hourlyDistribution = await VehicleEntry.aggregate([
                {
                    $match: {
                        ...checkpostFilter,
                        createdAt: {
                            $gte: startOfToday(),
                            $lte: endOfToday()
                        }
                    }
                },
                {
                    $group: {
                        _id: { $hour: '$createdAt' },
                        entries: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        hour: '$_id',
                        entries: 1,
                        _id: 0
                    }
                },
                { $sort: { hour: 1 } }
            ]);

            // Get recent entries
            const recentEntries = await VehicleEntry.find(checkpostFilter)
                .populate('vehicleType', 'name')
                .populate('checkpost', 'name code')
                .populate('createdBy', 'username')
                .sort('-createdAt')
                .limit(5);

            // Get checkpost analytics
            const checkpostAnalytics = await VehicleEntry.aggregate([
                {
                    $match: {
                        createdAt: { $gte: subDays(today, 30) } // Last 30 days
                    }
                },
                {
                    $lookup: {
                        from: 'checkposts',
                        localField: 'checkpost',
                        foreignField: '_id',
                        as: 'checkpost'
                    }
                },
                { $unwind: '$checkpost' },
                {
                    $group: {
                        _id: {
                            checkpost: '$checkpost._id',
                            date: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$createdAt'
                                }
                            }
                        },
                        checkpostName: { $first: '$checkpost.name' },
                        dailyCount: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.checkpost',
                        checkpostName: { $first: '$checkpostName' },
                        dailyData: {
                            $push: {
                                date: '$_id.date',
                                count: '$dailyCount'
                            }
                        },
                        totalEntries: { $sum: '$dailyCount' },
                        avgDailyEntries: { $avg: '$dailyCount' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: '$checkpostName',
                        dailyData: 1,
                        totalEntries: 1,
                        avgDailyEntries: { $round: ['$avgDailyEntries', 1] }
                    }
                },
                { $sort: { totalEntries: -1 } }
            ]);

            res.json({
                success: true,
                data: {
                    todayEntries,
                    activeVehicles,
                    totalEntries,
                    weeklyTotal,
                    monthlyTotal,
                    recentEntries,
                    vehicleTypeData,
                    weeklyTrends,
                    hourlyDistribution,
                    checkpostAnalytics
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