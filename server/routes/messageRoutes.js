const express = require('express');
const router = express.Router();
const {
    getOrCreateConversation,
    sendMessage,
    getMessages,
    getMyConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/conversations')
    .get(protect, getMyConversations);

router.route('/conversation')
    .post(protect, getOrCreateConversation);

router.route('/conversation/:id')
    .get(protect, getMessages);

router.route('/messages')
    .post(protect, sendMessage);

module.exports = router;
