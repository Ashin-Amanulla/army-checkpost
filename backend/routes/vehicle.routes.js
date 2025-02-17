const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const vehicleController = require('../controllers/vehicle.controller');
const { createAuditLog } = require('../controllers/auditLogController');
const { validateVehicleEntry } = require('../middleware/validateVehicle');

const wrapWithAudit = (handler, action) => {
    return async (req, res) => {
        try {
            const result = await handler(req, res);
            await createAuditLog(
                req,
                action,
                'VEHICLE',
                `${action}: Vehicle ${req.params.id || 'new'}`,
                {
                    vehicleId: req.params.id,
                    vehicleNumber: req.body.vehicleNumber,
                    checkpost: req.user.checkpost
                }
            );
            return result;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

router.use(protect);

router.post('/',
    authorize(['user', 'admin', 'super_admin']),
    upload.single('photo'),
    validateVehicleEntry,
    wrapWithAudit(vehicleController.createEntry, 'VEHICLE_ENTRY')
);

router.put('/:id',
    authorize(['admin', 'super_admin','user']),
    wrapWithAudit(vehicleController.exitEntry, 'VEHICLE_EXIT')
);

router.delete('/:id',
    authorize(['admin', 'super_admin']),
    wrapWithAudit(vehicleController.deleteEntry, 'VEHICLE_EXIT')
);

router.get('/',
    wrapWithAudit(vehicleController.getEntries, 'VIEW_VEHICLES')
);

router.get('/history/:vehicleNumber',
    wrapWithAudit(vehicleController.getVehicleHistory, 'VIEW_VEHICLES')
);

router.get('/:id',
    wrapWithAudit(vehicleController.getEntryById, 'VIEW_VEHICLES')
);

router.patch(
    '/:id',
    wrapWithAudit(vehicleController.updateVehicle, 'VEHICLE_UPDATE')
);

module.exports = router; 