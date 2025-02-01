const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow system-generated logs
    },
    action: {
        type: String,
        required: true,
        enum: [
            'VEHICLE_ENTRY',
            'VEHICLE_EXIT',
            'USER_CREATE',
            'USER_UPDATE',
            'USER_DELETE',
            'USER_LOGIN',
            'LOGIN',
            'LOGOUT',
            'CHECKPOST_CREATE',
            'CHECKPOST_UPDATE',
            'SETTINGS_UPDATE',
            'VIEW',
            'VIEW_PROFILE',
            'VIEW_USERS',
            'VIEW_VEHICLES',
            'VIEW_CHECKPOSTS'
        ]
    },
    module: {
        type: String,
        required: true,
        enum: ['VEHICLE', 'USER', 'CHECKPOST', 'VEHICLE_TYPE', 'AUTH', 'SETTINGS']
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String
});

// Index for better query performance
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ module: 1 });
auditLogSchema.index({ user: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog; 