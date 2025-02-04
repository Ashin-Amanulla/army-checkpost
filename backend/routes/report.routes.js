const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { exportReport } = require('../controllers/report.controller');

// Protect all report routes
router.use(protect);
router.use(authorize(['super_admin', 'admin']));

// Export report route
router.get('/export', exportReport);

module.exports = router; 