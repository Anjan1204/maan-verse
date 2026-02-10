const User = require('../models/User');

// @desc    Get all admins
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (error) {
        next(error);
    }
};

// @desc    Approve an admin
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
const approveAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isApproved = true;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllAdmins, approveAdmin };
