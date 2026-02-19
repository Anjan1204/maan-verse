const express = require('express');
const router = express.Router();
const { chatWithLink } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Route to chat with AI
// Protected route to ensure only logged in users can use it
router.post('/chat', protect, chatWithLink);

module.exports = router;
