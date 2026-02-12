const express = require('express');
const router = express.Router();
const {
    getFacultyDashboard,
    getMyClasses,
    markAttendance,
    getStudentsForClass,
    updateMySubjects,
    getFacultyTimetable,
    addTimetableSlot,
    removeTimetableSlot,
    getFacultyProfile,
    updateFacultyProfile
} = require('../controllers/facultyController');
const { protect, faculty } = require('../middleware/authMiddleware'); // Assuming we have 'faculty' middleware or check role in controller

// Add a specific middleware check if needed, or rely on protect + checking role in controller or creating a 'faculty' check middleware
const facultyCheck = (req, res, next) => {
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401);
        const error = new Error('Not authorized as faculty');
        next(error);
    }
};

router.get('/dashboard', protect, facultyCheck, getFacultyDashboard);
router.get('/classes', protect, facultyCheck, getMyClasses);
router.post('/attendance', protect, facultyCheck, markAttendance);
router.get('/students', protect, facultyCheck, getStudentsForClass);
router.post('/subjects', protect, facultyCheck, updateMySubjects);
router.get('/timetable', protect, facultyCheck, getFacultyTimetable);
router.post('/timetable', protect, facultyCheck, addTimetableSlot);
router.delete('/timetable/:id', protect, facultyCheck, removeTimetableSlot);
router.get('/profile', protect, facultyCheck, getFacultyProfile);
router.put('/profile', protect, facultyCheck, updateFacultyProfile);

module.exports = router;
