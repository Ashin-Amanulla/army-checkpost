const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createVehicleType,
    getVehicleTypes,
    updateVehicleType,
    deleteVehicleType
} = require('../controllers/vehicleType.controller');

router.post('/', protect, authorize('super_admin', 'admin'), createVehicleType);
router.get('/', protect, getVehicleTypes);
router.put('/:id', protect, authorize('super_admin', 'admin'), updateVehicleType);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteVehicleType);

module.exports = router; 