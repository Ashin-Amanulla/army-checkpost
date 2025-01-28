const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createCheckpost,
    getCheckposts,
    updateCheckpost,
    deleteCheckpost
} = require('../controllers/checkpost.controller');

/**
 * @swagger
 * /checkposts:
 *   post:
 *     summary: Create new checkpost
 *     tags: [Checkposts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Checkpost created successfully
 *
 *   get:
 *     summary: Get all checkposts
 *     tags: [Checkposts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of checkposts
 */

router.post('/', protect, authorize('super_admin'), createCheckpost);
router.get('/', protect, getCheckposts);
router.put('/:id', protect, authorize('super_admin'), updateCheckpost);
router.delete('/:id', protect, authorize('super_admin'), deleteCheckpost);

module.exports = router; 