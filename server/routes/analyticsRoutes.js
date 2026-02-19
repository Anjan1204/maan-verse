const express = require('express');
const router = express.Router();
const { getStudentAnalytics, getFacultyAnalytics } = require('../controllers/analyticsController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.get('/student', protect, getStudentAnalytics);
router.get('/faculty', protect, faculty, getFacultyAnalytics);

module.exports = router;
