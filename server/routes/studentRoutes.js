const express = require('express');
const router = express.Router();
const {
    getStudentDashboard,
    getTimetable,
    getAttendance,
    getStudentExams,
    getStudentResults
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getStudentDashboard);
router.get('/timetable', protect, getTimetable);
router.get('/attendance', protect, getAttendance);
router.get('/exams', protect, getStudentExams);
router.get('/results', protect, getStudentResults);

module.exports = router;
