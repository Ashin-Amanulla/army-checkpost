const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    rtoApiKey: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings; 