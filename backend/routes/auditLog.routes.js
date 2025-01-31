const express = require('express');
const router = express.Router();
const { getLogs, exportLogs } = require('../controllers/auditLogController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize(['super_admin', 'admin']));

router.get('/', getLogs);
router.get('/export', exportLogs);

module.exports = router; 