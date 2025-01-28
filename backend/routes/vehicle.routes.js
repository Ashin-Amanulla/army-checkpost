const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createEntry,
    updateExit,
    getEntries,
    getVehicleHistory,
    getEntryById
} = require('../controllers/vehicle.controller');

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create new vehicle entry
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleNumber
 *               - vehicleType
 *               - driverName
 *               - driverPhone
 *               - purpose
 *               - photo
 *             properties:
 *               vehicleNumber:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *               driverName:
 *                 type: string
 *               driverPhone:
 *                 type: string
 *               purpose:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehicle entry created successfully
 *
 *   get:
 *     summary: Get vehicle entries
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: vehicleType
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [entered, exited]
 *     responses:
 *       200:
 *         description: List of vehicle entries
 */

router.post('/', protect, authorize('user'), upload.single('photo'), createEntry);
router.put('/:id/exit', protect, authorize('user'), updateExit);
router.get('/', protect, getEntries);
router.get('/history/:vehicleNumber', protect, getVehicleHistory);
router.get('/:id', protect, getEntryById);

module.exports = router; 