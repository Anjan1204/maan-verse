const express = require('express');
const router = express.Router();
const { getBadges, awardBadge, getMyBadges } = require('../controllers/badgeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getBadges);

router.route('/my')
    .get(protect, getMyBadges);

router.route('/:id/award')
    .post(protect, admin, awardBadge);

module.exports = router;
