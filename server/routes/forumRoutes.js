const express = require('express');
const router = express.Router();
const {
    createThread,
    getCourseThreads,
    addComment,
    getThreadComments,
    likeComment
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.route('/threads')
    .post(protect, createThread);

router.route('/course/:courseId')
    .get(protect, getCourseThreads);

router.route('/threads/:id/comments')
    .post(protect, addComment)
    .get(protect, getThreadComments);

router.route('/comments/:id/like')
    .put(protect, likeComment);

module.exports = router;
