const ForumThread = require('../models/ForumThread');
const ForumComment = require('../models/ForumComment');
const Course = require('../models/Course');

// @desc    Create new forum thread
// @route   POST /api/forum/threads
// @access  Private
const createThread = async (req, res, next) => {
    try {
        const { title, content, courseId, isAnnouncement, tags } = req.body;

        const thread = await ForumThread.create({
            title,
            content,
            course: courseId,
            author: req.user._id,
            isAnnouncement: req.user.role === 'faculty' || req.user.role === 'admin' ? isAnnouncement : false,
            tags
        });

        res.status(201).json(thread);
    } catch (error) {
        next(error);
    }
};

// @desc    Get threads for a course
// @route   GET /api/forum/course/:courseId
// @access  Private
const getCourseThreads = async (req, res, next) => {
    try {
        const threads = await ForumThread.find({ course: req.params.courseId })
            .populate('author', 'name profile.avatar role')
            .sort({ createdAt: -1 });
        res.json(threads);
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to thread
// @route   POST /api/forum/threads/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const comment = await ForumComment.create({
            thread: req.params.id,
            author: req.user._id,
            content
        });

        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
};

// @desc    Get comments for a thread
// @route   GET /api/forum/threads/:id/comments
// @access  Private
const getThreadComments = async (req, res, next) => {
    try {
        const comments = await ForumComment.find({ thread: req.params.id })
            .populate('author', 'name profile.avatar role')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// @desc    Like a comment
// @route   PUT /api/forum/comments/:id/like
// @access  Private
const likeComment = async (req, res, next) => {
    try {
        const comment = await ForumComment.findById(req.params.id);
        if (!comment) {
            res.status(404);
            throw new Error('Comment not found');
        }

        if (comment.likes.includes(req.user._id)) {
            comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            comment.likes.push(req.user._id);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createThread,
    getCourseThreads,
    addComment,
    getThreadComments,
    likeComment
};
