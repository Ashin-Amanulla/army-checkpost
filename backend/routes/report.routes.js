const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { exportReport } = require('../controllers/report.controller');

router.use(protect);

router.get('/export', exportReport);

module.exports = router; 