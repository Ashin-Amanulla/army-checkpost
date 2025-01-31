const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        uppercase: true
    },
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleType',
        required: true
    },
    checkpost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkpost',
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
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema); 