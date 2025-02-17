const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const settingsController = require('../controllers/settings.controller');

router.use(protect);

router.get('/',
    authorize(['super_admin']),
    settingsController.getSettings
);

router.put('/',
    authorize(['super_admin']),
    settingsController.updateSettings
);

router.get('/verify-vehicle/:vehicleNumber',
    authorize(['admin', 'super_admin']),
    settingsController.verifyVehicle
);

module.exports = router; 