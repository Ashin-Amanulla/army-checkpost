const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');
const { createAuditLog } = require('../controllers/auditLogController');

// Wrap controller functions to include audit logging
const wrapWithAudit = (handler, action, module) => {
    return async (req, res) => {
        try {
            const result = await handler(req, res);
            await createAuditLog(
                req,
                action,
                module,
                `${action}: ${req.method} ${req.originalUrl}`,
                { userId: req.user?._id, ...req.body }
            );
            return result;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

// Public routes
router.post('/register',
    validateRegister,
    wrapWithAudit(authController.register, 'USER_REGISTER', 'AUTH')
);

router.post('/login',
    validateLogin,
    wrapWithAudit(authController.login, 'USER_LOGIN', 'AUTH')
);

// Protected routes
router.use(protect);

router.get('/me',
    wrapWithAudit(authController.getMe, 'VIEW_PROFILE', 'USER')
);

router.put('/profile',
    wrapWithAudit(authController.updateProfile, 'UPDATE_PROFILE', 'USER')
);

// Admin only routes
router.get('/users',
    authorize(['admin', 'super_admin']),
    wrapWithAudit(authController.getUsers, 'VIEW_USERS', 'USER')
);

module.exports = router; 