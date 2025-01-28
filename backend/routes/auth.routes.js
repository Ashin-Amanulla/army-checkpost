const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - fullName
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [super_admin, admin, user]
 *               checkpost:
 *                 type: string
 *                 description: Checkpost ID (required for user role)
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router; 