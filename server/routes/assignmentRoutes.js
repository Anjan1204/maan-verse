const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getCourseAssignments,
    submitAssignment,
    getAssignmentSubmissions,
    gradeSubmission
} = require('../controllers/assignmentController');
const { protect, faculty, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, faculty, createAssignment);

router.route('/course/:courseId')
    .get(protect, getCourseAssignments);

router.route('/:id/submit')
    .post(protect, submitAssignment);

router.route('/:id/submissions')
    .get(protect, faculty, getAssignmentSubmissions);

router.route('/submissions/:submissionId/grade')
    .put(protect, faculty, gradeSubmission);

module.exports = router;
