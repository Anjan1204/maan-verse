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

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile || {},
            adminProfile: user.adminProfile || {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Admin Profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        console.log(`[PRO-SAVE] Updating admin profile: ${user.name}`);

        // Update name
        if (req.body.name) user.name = req.body.name;

        // Handle Email (unique check)
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(400);
                throw new Error('Email address already in use');
            }
            user.email = req.body.email;
        }

        // Update basic profile (avatar, bio)
        if (req.body.profile) {
            user.profile = {
                ...(user.profile ? (typeof user.profile.toObject === 'function' ? user.profile.toObject() : user.profile) : {}),
                ...req.body.profile
            };
            user.markModified('profile');
        }

        // Update admin-specific profile
        if (req.body.adminProfile) {
            user.adminProfile = {
                ...(user.adminProfile ? (typeof user.adminProfile.toObject === 'function' ? user.adminProfile.toObject() : user.adminProfile) : {}),
                ...req.body.adminProfile
            };

            // Handle Join Date
            if (req.body.adminProfile.joinDate) {
                const joinDateObj = new Date(req.body.adminProfile.joinDate);
                if (!isNaN(joinDateObj.getTime())) {
                    user.adminProfile.joinDate = joinDateObj;
                }
            } else if (req.body.adminProfile.joinDate === '') {
                user.adminProfile.joinDate = null;
            }

            user.markModified('adminProfile');
        }

        const updatedUser = await user.save();
        console.log('[PRO-SAVE] Admin update successful:', updatedUser.email);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile,
            adminProfile: updatedUser.adminProfile
        });
    } catch (error) {
        console.error('[PRO-ERROR] updateAdminProfile failure:', error);
        next(error);
    }
};

module.exports = { getAllAdmins, approveAdmin, getAdminProfile, updateAdminProfile };
