const express = require('express');
const router = express.Router();
const {
    getAllAdmins,
    getPendingRegistrationRequests,
    approveAdmin,
    getAdminProfile,
    updateAdminProfile,
    rejectAdmin
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getAllAdmins);
router.get('/pending-requests', protect, admin, getPendingRegistrationRequests);
router.get('/profile', protect, admin, getAdminProfile);
router.put('/profile', protect, admin, updateAdminProfile);
router.put('/approve/:id', protect, admin, approveAdmin);
router.delete('/reject/:id', protect, admin, rejectAdmin);

module.exports = router;
