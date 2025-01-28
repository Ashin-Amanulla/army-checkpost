const mongoose = require('mongoose');

const vehicleEntrySchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleType',
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    driverPhone: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    checkpost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkpost',
        required: true
    },
    entryBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    exitTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['entered', 'exited'],
        default: 'entered'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VehicleEntry', vehicleEntrySchema); 