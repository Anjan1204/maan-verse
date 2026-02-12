const express = require('express');
const router = express.Router();
const { getAllAdmins, approveAdmin, getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getAllAdmins);
router.route('/approve/:id').put(protect, admin, approveAdmin);
router.route('/profile').get(protect, admin, getAdminProfile).put(protect, admin, updateAdminProfile);

module.exports = router;
