const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard.controller');

router.use(protect);

router.get('/stats', dashboardController.getStats);
router.get('/today', dashboardController.getTodayStats);

module.exports = router; 