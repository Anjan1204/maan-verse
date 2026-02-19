const Notice = require('../models/Notice');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res, next) => {
    try {
        const { type, targetAudience, keyword } = req.query;

        let query = {};

        // Filter by type if provided
        if (type) {
            query.type = type;
        }

        // Filter by target audience if provided
        if (targetAudience) {
            query.targetAudience = targetAudience;
        }

        // Search by title or message
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { message: { $regex: keyword, $options: 'i' } }
            ];
        }

        const notices = await Notice.find(query)
            .populate('postedBy', 'name email')
            .sort({ date: -1 });

        res.json(notices);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (notice) {
            res.json(notice);
        } else {
            res.status(404);
            throw new Error('Notice not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res, next) => {
    try {
        const { title, message, type, targetAudience, date } = req.body;

        const notice = await Notice.create({
            title,
            message,
            type,
            targetAudience,
            date: date || Date.now(),
            postedBy: req.user._id,
            isPublished: true
        });

        // Notify Target Audience
        const io = req.app.get('io');
        let userFilter = {};
        if (targetAudience === 'Student') userFilter.role = 'student';
        else if (targetAudience === 'Faculty') userFilter.role = 'faculty';
        // if 'All', filter remains empty (all users)

        const users = await User.find(userFilter);
        for (const u of users) {
            // Don't notify the poster
            if (u._id.toString() === req.user._id.toString()) continue;

            const notification = await Notification.create({
                recipient: u._id,
                type: 'Notice',
                title: 'New Notice Published',
                message: title,
                link: '/notices'
            });
            if (io) io.to(u._id.toString()).emit('notification:received', notification);
        }

        res.status(201).json(notice);
    } catch (error) {
        next(error);
    }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            notice.title = req.body.title || notice.title;
            notice.message = req.body.message || notice.message;
            notice.type = req.body.type || notice.type;
            notice.targetAudience = req.body.targetAudience || notice.targetAudience;

            if (req.body.date) {
                notice.date = req.body.date;
            }

            if (req.body.isPublished !== undefined) {
                notice.isPublished = req.body.isPublished;
            }

            const updatedNotice = await notice.save();
            res.json(updatedNotice);
        } else {
            res.status(404);
            throw new Error('Notice not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            await notice.deleteOne();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404);
            throw new Error('Notice not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle publish status
// @route   PATCH /api/notices/:id/publish
// @access  Private/Admin
const togglePublishNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            notice.isPublished = !notice.isPublished;
            const updatedNotice = await notice.save();
            res.json(updatedNotice);
        } else {
            res.status(404);
            throw new Error('Notice not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    togglePublishNotice
};
