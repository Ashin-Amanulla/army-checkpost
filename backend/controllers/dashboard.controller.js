const VehicleEntry = require('../models/Vehicle');
const VehicleType = require('../models/VehicleType');
const { startOfWeek, eachDayOfInterval, format, startOfToday, endOfToday, subDays, startOfDay, startOfMonth } = require('date-fns');
const Checkpost = require('../models/Checkpost');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const SiteVisit = require('../models/SiteVisit');

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

            // Get time range filter based on query param
            let timeFilter = {};
            switch (req.query.timeRange) {
                case 'weekly':
                    timeFilter = { createdAt: { $gte: weekStart } };
                    break;
                case 'monthly':
                    timeFilter = { createdAt: { $gte: monthStart } };
                    break;
                // 'alltime' doesn't need a filter
            }

            // Combine filters
            const combinedFilter = {
                ...checkpostFilter,
                ...timeFilter
            };

            // Get all required stats
            const [
                todayEntries,
                totalEntries,
                weeklyTotal,
                monthlyTotal,
                activeCheckposts,
                activeVehicles,
                vehicleTypeData,
                checkpostDistribution,
                recentEntries,
                rawLastLogins,
                siteVisits,
                adminVisits,
                userVisits,
                adminLastLogins
            ] = await Promise.all([
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: today }
                }),
                VehicleEntry.countDocuments(combinedFilter),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: weekStart }
                }),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    createdAt: { $gte: monthStart }
                }),
                Checkpost.countDocuments({ active: true }),
                VehicleEntry.countDocuments({
                    ...checkpostFilter,
                    dispatch: false
                }),
                getVehicleTypeDistribution(combinedFilter),
                getCheckpostDistribution(combinedFilter),
                VehicleEntry.find(checkpostFilter)
                    .sort('-createdAt')
                    .limit(10)
                    .populate('vehicleType', 'name')
                    .populate('checkpost', 'name'),
                AuditLog.find({
                    action: {
                        $in: ['USER_LOGIN', 'VEHICLE_ENTRY', 'VEHICLE_EXIT', 'USER_UPDATE']
                    }
                })
                    .sort('-timestamp')
                    .limit(5)
                    .populate('user', 'username role')
                    .lean()
                    .exec(),
                AuditLog.countDocuments({ action: 'USER_LOGIN' }),
                SiteVisit.countDocuments(),
                SiteVisit.countDocuments({ role: { $in: ['admin', 'super_admin'] } }),
                SiteVisit.countDocuments({ role: 'user' }),
                User.find({
                    role: { $in: ['admin', 'super_admin'] },
                    lastLogin: { $exists: true }
                })
                    .select('username role lastLogin')
                    .sort('-lastLogin')
                    .limit(5)
                    .lean()
                    .exec()
            ]);

            // Format the last logins data
            const formattedLastLogins = rawLastLogins.map(log => ({
                _id: log._id,
                username: log.user?.username || 'System',
                action: log.action,
                timestamp: log.timestamp,
                details: log.details
            }));

            console.log('Combined Filter:', combinedFilter);
            console.log('Checkpost Distribution:', checkpostDistribution);

            res.json({
                success: true,
                data: {
                    todayEntries,
                    totalEntries,
                    weeklyTotal,
                    monthlyTotal,
                    activeCheckposts,
                    activeVehicles,
                    vehicleTypeData,
                    checkpostDistribution,
                    recentEntries,
                    lastLogins: formattedLastLogins,
                    siteVisits: {
                        total: siteVisits,
                        admin: adminVisits,
                        user: userVisits
                    },
                    adminLastLogins: adminLastLogins || []
                }
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    getTodayStats: async (req, res) => {
        try {
            const today = new Date();
            const startDate = startOfToday(today);
            const endDate = endOfToday(today);
            const result = await Promise.all([
                VehicleEntry.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
                VehicleEntry.countDocuments({ dispatchDate: { $gte: startDate, $lte: endDate }, dispatch: true }),
            ])

            res.json({
                success: true,
                data: {
                    totalEntries: result[0],
                    dispatchedEntries: result[1],
                }
            });

        } catch (error) {
            console.error('Error in getTodayStats:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

const getCheckpostDistribution = async (filter) => {
    return VehicleEntry.aggregate([
        {
            $match: filter
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
            $match: {
                "checkpostInfo": { $ne: [] }
            }
        },
        {
            $project: {
                _id: 0,
                name: { $arrayElemAt: ["$checkpostInfo.name", 0] },
                value: 1,
                active: { $arrayElemAt: ['$checkpostInfo.active', 0] }
            }
        },
        {
            $sort: { value: -1 }
        }
    ]);
};

async function getVehicleTypeDistribution(filter) {
    return VehicleEntry.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$vehicleType',
                value: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'vehicletypes',
                localField: '_id',
                foreignField: '_id',
                as: 'typeInfo'
            }
        },
        {
            $project: {
                _id: 0,
                name: { $arrayElemAt: ['$typeInfo.name', 0] },
                value: 1
            }
        }
    ]);
}

module.exports = dashboardController; 