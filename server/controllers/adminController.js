const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AdminRegistrationRequest = require('../models/AdminRegistrationRequest');

// @desc    Get all admins
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllAdmins = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending admin registration requests
// @route   GET /api/admin/pending-requests
// @access  Private/Admin
const getPendingRegistrationRequests = async (req, res, next) => {
    try {
        const requests = await AdminRegistrationRequest.find({});
        res.json(requests);
    } catch (error) {
        next(error);
    }
};

// @desc    Approve an admin registration request
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
const approveAdmin = async (req, res, next) => {
    try {
        const registrationRequest = await AdminRegistrationRequest.findById(req.params.id);

        if (registrationRequest) {
            // Create the actual user
            const user = await User.create({
                name: registrationRequest.name,
                email: registrationRequest.email,
                password: registrationRequest.password, // This is already hashed
                role: 'admin',
                isApproved: true,
                isMainAdmin: false
            });

            if (user) {
                // Delete the request
                await registrationRequest.deleteOne();
                res.json({ message: 'Admin request approved and user created' });
            } else {
                res.status(400);
                throw new Error('Failed to create user from request');
            }
        } else {
            // Fallback for existing unapproved users (if any)
            const user = await User.findById(req.params.id);
            if (user && user.role === 'admin' && !user.isApproved) {
                user.isApproved = true;
                await user.save();
                return res.json({ message: 'Admin approved successfully' });
            }
            res.status(404);
            throw new Error('Registration request not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getAdminProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile || {},
                adminProfile: user.adminProfile || {},
            });
        } else {
            res.status(404);
            throw new Error('Admin not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            // Handle basic profile (bio, avatar)
            if (req.body.profile) {
                user.profile = {
                    bio: req.body.profile.bio || (user.profile ? user.profile.bio : ''),
                    avatar: req.body.profile.avatar || (user.profile ? user.profile.avatar : '')
                };
                user.markModified('profile');
            }

            // Handle admin specific profile
            if (req.body.adminProfile) {
                user.adminProfile = {
                    employeeId: req.body.adminProfile.employeeId || (user.adminProfile ? user.adminProfile.employeeId : ''),
                    department: req.body.adminProfile.department || (user.adminProfile ? user.adminProfile.department : ''),
                    designation: req.body.adminProfile.designation || (user.adminProfile ? user.adminProfile.designation : ''),
                    phone: req.body.adminProfile.phone || (user.adminProfile ? user.adminProfile.phone : ''),
                    joinDate: user.adminProfile ? user.adminProfile.joinDate : null
                };

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
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile,
                adminProfile: updatedUser.adminProfile,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('Admin not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reject/Delete a pending admin registration request
// @route   DELETE /api/admin/reject/:id
// @access  Private/Admin
const rejectAdmin = async (req, res, next) => {
    try {
        const registrationRequest = await AdminRegistrationRequest.findById(req.params.id);

        if (registrationRequest) {
            await registrationRequest.deleteOne();
            res.json({ message: 'Admin registration request rejected' });
        } else {
            // Fallback for existing unapproved users (if any)
            const user = await User.findById(req.params.id);
            if (user && user.role === 'admin' && !user.isApproved) {
                await user.deleteOne();
                return res.json({ message: 'Admin request rejected and user removed' });
            }
            res.status(404);
            throw new Error('Registration request not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAdmins,
    getPendingRegistrationRequests,
    approveAdmin,
    getAdminProfile,
    updateAdminProfile,
    rejectAdmin
};
