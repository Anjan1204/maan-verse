const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Apply for leave
// @route   POST /api/leave
// @access  Private
const applyLeave = async (req, res, next) => {
    try {
        const { type, startDate, endDate, reason } = req.body;
        const leave = await LeaveRequest.create({
            user: req.user._id,
            role: req.user.role,
            type,
            startDate,
            endDate,
            reason
        });

        // Notify Admins
        const admins = await User.find({ role: 'admin' });
        const io = req.app.get('io');
        for (const admin of admins) {
            const notification = await Notification.create({
                recipient: admin._id,
                type: 'Leave',
                title: 'New Leave Request',
                message: `${req.user.name} (${req.user.role}) has applied for leave.`,
                link: '/leave'
            });
            if (io) io.to(admin._id.toString()).emit('notification:received', notification);
        }

        res.status(201).json(leave);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's leave requests
// @route   GET /api/leave/my
// @access  Private
const getMyLeaves = async (req, res, next) => {
    try {
        const leaves = await LeaveRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leave/admin
// @access  Private/Admin
const getAllLeaves = async (req, res, next) => {
    try {
        console.log('getAllLeaves called by:', req.user._id, req.user.role);
        const leaves = await LeaveRequest.find().populate('user', 'name role email').sort({ createdAt: -1 });
        console.log('Found leaves:', leaves.length);
        res.json(leaves);
    } catch (error) {
        console.error('getAllLeaves Error:', error);
        next(error);
    }
};

// @desc    Update leave status
// @route   PUT /api/leave/:id/status
// @access  Private/Admin
const updateLeaveStatus = async (req, res, next) => {
    try {
        const { status, adminRemark } = req.body;
        const leave = await LeaveRequest.findById(req.params.id);

        if (!leave) {
            res.status(404);
            throw new Error('Leave request not found');
        }

        leave.status = status;
        leave.adminRemark = adminRemark;
        leave.approvedBy = req.user._id;

        await leave.save();

        // Notify User
        const io = req.app.get('io');
        const notification = await Notification.create({
            recipient: leave.user,
            type: 'Leave',
            title: 'Leave Status Updated',
            message: `Your leave request has been ${status}.`,
            link: '/leave'
        });
        if (io) io.to(leave.user.toString()).emit('notification:received', notification);

        res.json(leave);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus
};
