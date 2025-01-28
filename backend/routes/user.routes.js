const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

router.use(protect);
router.use(authorize('super_admin'));

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 