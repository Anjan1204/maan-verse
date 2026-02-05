const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCoursesAdmin,
} = require('../controllers/courseController');
const { protect, faculty, admin } = require('../middleware/authMiddleware');

// Admin route to get all courses (must be before '/' route)
router.get('/admin/all', protect, admin, getAllCoursesAdmin);

router.route('/')
    .get(getCourses)
    .post(protect, faculty, createCourse);

router.route('/:id')
    .get(getCourseById)
    .put(protect, faculty, updateCourse)
    .delete(protect, faculty, deleteCourse);

module.exports = router;
