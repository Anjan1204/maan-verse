const Badge = require('../models/Badge');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
const getBadges = async (req, res, next) => {
    try {
        const badges = await Badge.find();
        res.json(badges);
    } catch (error) {
        next(error);
    }
};

// @desc    Award badge to user (Admin only for now)
// @route   POST /api/badges/:id/award
// @access  Private/Admin
const awardBadge = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const badge = await Badge.findById(req.params.id);

        if (!badge) {
            res.status(404);
            throw new Error('Badge not found');
        }

        if (badge.recipients.some(r => r.user.toString() === userId)) {
            res.status(400);
            throw new Error('User already has this badge');
        }

        badge.recipients.push({ user: userId });
        await badge.save();
        res.json(badge);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's badges
// @route   GET /api/badges/my
// @access  Private
const getMyBadges = async (req, res, next) => {
    try {
        const badges = await Badge.find({
            'recipients.user': req.user._id
        });
        res.json(badges);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBadges,
    awardBadge,
    getMyBadges
};
