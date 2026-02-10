const express = require('express');
const router = express.Router();
const { getAllAdmins, approveAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getAllAdmins);
router.route('/approve/:id').put(protect, admin, approveAdmin);

module.exports = router;
