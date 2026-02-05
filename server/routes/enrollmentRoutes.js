const express = require('express');
const router = express.Router();
const {
    enrollInCourse,
    getMyEnrollments,
    getCourseEnrollments,
    updateProgress,
} = require('../controllers/enrollmentController');
const { protect, faculty, admin } = require('../middleware/authMiddleware');

router.post('/', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);
router.put('/progress', protect, updateProgress);
router.get('/course/:id', protect, faculty, getCourseEnrollments);

module.exports = router;
