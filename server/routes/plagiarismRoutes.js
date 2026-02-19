const express = require('express');
const router = express.Router();
const { checkPlagiarism } = require('../controllers/plagiarismController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.get('/check/:submissionId', protect, faculty, checkPlagiarism);

module.exports = router;
