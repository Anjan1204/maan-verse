const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getDashboardStats,
    updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

module.exports = router;
