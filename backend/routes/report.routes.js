const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { exportReport } = require('../controllers/report.controller');

// Remove admin-only restriction, allow all authenticated users
router.use(protect);

// Export report route
router.get('/export', exportReport);

module.exports = router; 