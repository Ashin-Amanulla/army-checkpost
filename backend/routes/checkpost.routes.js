const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createAuditLog } = require('../controllers/auditLogController');
const {
    createCheckpost,
    getCheckposts,
    updateCheckpost,
    deleteCheckpost
} = require('../controllers/checkpost.controller');

const wrapWithAudit = (handler, action) => {
    return async (req, res) => {
        try {
            const result = await handler(req, res);
            await createAuditLog(
                req,
                action,
                'CHECKPOST',
                `${action}: Checkpost ${req.params.id || 'new'}`,
                {
                    checkpostId: req.params.id,
                    checkpostName: req.body.name,
                    changes: req.body
                }
            );
            return result;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

router.use(protect);

router.get('/', wrapWithAudit(getCheckposts, 'VIEW_CHECKPOSTS'));

router.use(authorize(['super_admin', 'admin']));
router.post('/', wrapWithAudit(createCheckpost, 'CHECKPOST_CREATE'));
router.use(authorize(['super_admin']));

router.put('/:id', wrapWithAudit(updateCheckpost, 'CHECKPOST_UPDATE'));
router.delete('/:id', wrapWithAudit(deleteCheckpost, 'CHECKPOST_DELETE'));

module.exports = router; 