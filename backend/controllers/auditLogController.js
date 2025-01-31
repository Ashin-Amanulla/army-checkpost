const AuditLog = require('../models/AuditLog');
const excel = require('exceljs');

// Utility function to create audit logs
const createAuditLog = async (req, action, module, description, details = null) => {
    try {
        const auditLog = new AuditLog({
            user: req.user?._id,
            action,
            module,
            description,
            details: sanitizeDetails(details),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });
        await auditLog.save();
    } catch (error) {
        console.error('Audit log creation failed:', error);
    }
};

// Helper function to sanitize details before saving
const sanitizeDetails = (details) => {
    if (!details) return null;

    // Create a copy to avoid modifying the original
    const sanitized = { ...details };

    // Remove sensitive fields
    const sensitiveFields = [
        'userId', '_id', 'password', 'token', 'refreshToken', 'apiKey',
        'secret', 'authorization', 'auth', 'key', 'hash', 'salt',
        'sessionId', 'deviceId', 'ip', 'userAgent'
    ];

    // Remove sensitive fields from root level
    sensitiveFields.forEach(field => {
        delete sanitized[field];
    });

    // If it's a changes object, sanitize both old and new values
    if (sanitized.changes) {
        const cleanedChanges = {};
        Object.entries(sanitized.changes).forEach(([key, value]) => {
            // Skip sensitive and ID fields
            if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase())) ||
                key.includes('Id') || key === '_id') {
                return;
            }

            // Format the values
            cleanedChanges[formatFieldName(key)] = {
                old: formatValue(value.old),
                new: formatValue(value.new)
            };
        });
        sanitized.changes = cleanedChanges;
    }

    // Format non-changes object
    if (!sanitized.changes) {
        const cleanedDetails = {};
        Object.entries(sanitized).forEach(([key, value]) => {
            if (!sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase())) &&
                !key.includes('Id') && key !== '_id') {
                cleanedDetails[formatFieldName(key)] = formatValue(value);
            }
        });
        return cleanedDetails;
    }

    return sanitized;
};

// Helper function to format field names
const formatFieldName = (field) => {
    return field
        // Convert camelCase to spaces
        .replace(/([A-Z])/g, ' $1')
        // Convert snake_case to spaces
        .replace(/_/g, ' ')
        // Capitalize first letter of each word
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
};

// Helper function to format values
const formatValue = (value) => {
    if (value === null || value === undefined) return 'None';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return format(value, 'dd/MM/yyyy HH:mm:ss');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

// Get all audit logs with filtering
const getLogs = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            action,
            module,
            user,
            page = 1,
            limit = 50
        } = req.query;

        console.log('Query params:', req.query); // Debug log

        const query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (action && action !== 'undefined' && action !== '') {
            query.action = action;
        }
        if (module && module !== 'undefined' && module !== '') {
            query.module = module;
        }
        if (user && user !== 'undefined' && user !== '') {
            query.user = user;
        }

        console.log('MongoDB query:', query); // Debug log

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate({
                path: 'user',
                select: 'username email fullName role checkpost',
                populate: {
                    path: 'checkpost',
                    select: 'name code location'
                }
            })
            .lean();

        const total = await AuditLog.countDocuments(query);

        console.log(`Found ${logs.length} logs`); // Debug log

        res.json({
            data: logs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            message: 'Failed to fetch audit logs',
            error: error.message
        });
    }
};

// Export audit logs to Excel
const exportLogs = async (req, res) => {
    try {
        const { startDate, endDate, action, module, user } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        if (action) query.action = action;
        if (module) query.module = module;
        if (user) query.user = user;

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .populate('user', 'username email checkpost')
            .populate({
                path: 'user',
                populate: {
                    path: 'checkpost',
                    select: 'name code'
                }
            });

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Audit Logs');

        worksheet.columns = [
            { header: 'Timestamp', key: 'timestamp', width: 20 },
            { header: 'User', key: 'user', width: 25 },
            { header: 'Checkpost', key: 'checkpost', width: 15 },
            { header: 'Action', key: 'action', width: 15 },
            { header: 'Module', key: 'module', width: 15 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Details', key: 'details', width: 50 }
        ];

        logs.forEach(log => {
            worksheet.addRow({
                timestamp: log.timestamp.toLocaleString(),
                user: log.user ? `${log.user.fullName} (${log.user.username})` : 'System',
                checkpost: log.user?.checkpost?.name || 'N/A',
                action: log.action,
                module: log.module,
                description: log.description,
                details: formatDetails(log.details)
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=audit-logs.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Failed to export audit logs' });
    }
};

// Helper function to format details for export
const formatDetails = (details) => {
    if (!details) return '';

    if (details.changes) {
        return Object.entries(details.changes)
            .map(([field, { old, new: newVal }]) => {
                const oldValue = formatValue(old);
                const newValue = formatValue(newVal);
                if (oldValue === newValue) return null;
                return `${field}:\n  From: ${oldValue}\n  To: ${newValue}`;
            })
            .filter(Boolean)
            .join('\n\n');
    }

    return Object.entries(details)
        .map(([key, value]) => `${formatFieldName(key)}: ${formatValue(value)}`)
        .join('\n');
};

module.exports = {
    createAuditLog,
    getLogs,
    exportLogs
}; 