const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createInquiry);
router.get('/', protect, admin, getInquiries);
router.put('/:id', protect, admin, updateInquiryStatus);

module.exports = router;
