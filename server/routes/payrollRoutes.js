const express = require('express');
const router = express.Router();
const { createPayroll, getFacultyPayroll, getAllPayrolls, updatePayrollStatus, bulkGeneratePayroll } = require('../controllers/payrollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createPayroll)
    .get(protect, admin, getAllPayrolls);

router.route('/bulk')
    .post(protect, admin, bulkGeneratePayroll);

router.route('/faculty/:facultyId')
    .get(protect, getFacultyPayroll);

router.route('/:id')
    .put(protect, admin, updatePayrollStatus);

module.exports = router;
