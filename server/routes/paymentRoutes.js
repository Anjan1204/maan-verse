const express = require('express');
const router = express.Router();
const { completePayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/complete', protect, completePayment);

module.exports = router;
