const mongoose = require('mongoose');

const checkpostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Checkpost', checkpostSchema); 