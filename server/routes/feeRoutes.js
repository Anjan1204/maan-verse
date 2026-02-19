const express = require('express');
const router = express.Router();
const { createFee, getStudentFees, getAllFees, updateFeeStatus, bulkAssignFees } = require('../controllers/feeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createFee)
    .get(protect, admin, getAllFees);

router.route('/bulk')
    .post(protect, admin, bulkAssignFees);

router.route('/student/:studentId')
    .get(protect, getStudentFees);

router.route('/:id')
    .put(protect, admin, updateFeeStatus);

module.exports = router;
