const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyLeave);

router.route('/my')
    .get(protect, getMyLeaves);

router.route('/admin')
    .get(protect, admin, getAllLeaves);

router.route('/:id/status')
    .put(protect, admin, updateLeaveStatus);

module.exports = router;
