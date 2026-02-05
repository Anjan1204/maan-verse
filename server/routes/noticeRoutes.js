const express = require('express');
const router = express.Router();
const {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    togglePublishNotice
} = require('../controllers/noticeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getNotices)
    .post(protect, admin, createNotice);

router.route('/:id')
    .get(getNoticeById)
    .put(protect, admin, updateNotice)
    .delete(protect, admin, deleteNotice);

router.route('/:id/publish')
    .patch(protect, admin, togglePublishNotice);

module.exports = router;
