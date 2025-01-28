const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema); 