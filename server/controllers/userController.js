const User = require('../models/User');
const Course = require('../models/Course');
const generateToken = require('../utils/generateToken');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                studentProfile: user.studentProfile,
                facultyProfile: user.facultyProfile,
                attendance: user.attendance,
                isActive: user.isActive
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        console.log(`[PRO-SAVE] Updating profile for user: ${user.name} (${user.role})`);

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

        // Update Profile (Avatar/Bio)
        if (req.body.profile) {
            user.profile = {
                bio: req.body.profile.bio !== undefined ? req.body.profile.bio : (user.profile ? user.profile.bio : ''),
                avatar: req.body.profile.avatar !== undefined ? req.body.profile.avatar : (user.profile ? user.profile.avatar : '')
            };
            user.markModified('profile');
        }

        // Update Role-Specific Profiles
        if (user.role === 'student' && req.body.studentProfile) {
            user.studentProfile = {
                rollNo: req.body.studentProfile.rollNo !== undefined ? req.body.studentProfile.rollNo : (user.studentProfile ? user.studentProfile.rollNo : ''),
                branch: req.body.studentProfile.branch !== undefined ? req.body.studentProfile.branch : (user.studentProfile ? user.studentProfile.branch : ''),
                semester: req.body.studentProfile.semester !== undefined ? req.body.studentProfile.semester : (user.studentProfile ? user.studentProfile.semester : ''),
                phone: req.body.studentProfile.phone !== undefined ? req.body.studentProfile.phone : (user.studentProfile ? user.studentProfile.phone : ''),
                address: req.body.studentProfile.address !== undefined ? req.body.studentProfile.address : (user.studentProfile ? user.studentProfile.address : ''),
                dob: user.studentProfile ? user.studentProfile.dob : null
            };

            // Explicitly handle date if provided string
            if (req.body.studentProfile.dob) {
                const dobDate = new Date(req.body.studentProfile.dob);
                if (!isNaN(dobDate.getTime())) {
                    user.studentProfile.dob = dobDate;
                }
            } else if (req.body.studentProfile.dob === '') {
                user.studentProfile.dob = null;
            }

            user.markModified('studentProfile');
        } else if (user.role === 'faculty' && req.body.facultyProfile) {
            user.facultyProfile = {
                employeeId: req.body.facultyProfile.employeeId !== undefined ? req.body.facultyProfile.employeeId : (user.facultyProfile ? user.facultyProfile.employeeId : ''),
                department: req.body.facultyProfile.department !== undefined ? req.body.facultyProfile.department : (user.facultyProfile ? user.facultyProfile.department : ''),
                designation: req.body.facultyProfile.designation !== undefined ? req.body.facultyProfile.designation : (user.facultyProfile ? user.facultyProfile.designation : ''),
                phone: req.body.facultyProfile.phone !== undefined ? req.body.facultyProfile.phone : (user.facultyProfile ? user.facultyProfile.phone : ''),
                subjects: req.body.facultyProfile.subjects || (user.facultyProfile ? user.facultyProfile.subjects : []),
                joinDate: user.facultyProfile ? user.facultyProfile.joinDate : null
            };

            if (req.body.facultyProfile.joinDate) {
                const joinDateObj = new Date(req.body.facultyProfile.joinDate);
                if (!isNaN(joinDateObj.getTime())) {
                    user.facultyProfile.joinDate = joinDateObj;
                }
            } else if (req.body.facultyProfile.joinDate === '') {
                user.facultyProfile.joinDate = null;
            }

            user.markModified('facultyProfile');
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        console.log('[PRO-SAVE] Database update successful for:', updatedUser.email);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile,
            studentProfile: updatedUser.studentProfile,
            facultyProfile: updatedUser.facultyProfile,
            attendance: updatedUser.attendance,
            isActive: updatedUser.isActive,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        console.error('[PRO-ERROR] updateUserProfile failure:', error);
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({
            message: error.message || 'Data Synchronization Failed',
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
};

// @desc    Get all users with pagination and search
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { email: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user (admin override or normal) - handled in authController, but admin might want to add users directly.

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            if (req.body.isActive !== undefined) {
                user.isActive = req.body.isActive;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalFaculty = await User.countDocuments({ role: 'faculty' });
        // Need to import Course model
        // const totalCourses = await Course.countDocuments(); 
        // I need to require Course at top, but I can't easily with replace_file_content unless I replace top.
        // I will do a separate replace for imports.

        // For now, I will use mongoose.model('Course') to avoid import issues if not imported.
        const courses = await Course.find({});
        const countCourses = courses.length;
        const totalRevenue = courses.reduce((acc, curr) => acc + (curr.price * (curr.enrolledCount || 0)), 0);

        // Recent Users
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        // User Distribution
        const distribution = [
            { name: 'Students', value: totalStudents },
            { name: 'Faculty', value: totalFaculty },
            { name: 'Admins', value: totalUsers - totalStudents - totalFaculty }
        ];

        // Activity Data (Group by Day of Week for last 7 days - approximated from User creation)
        // This is complex in Mongo without specific analytics collection, so we will do a simple aggregation 
        // of users created in last 7 days.
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activity = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    new: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map activity to graph format (filling missing days with 0 if possible, or sending as is)
        // For 'active' users, we don't track daily active users (DAU) yet, so we will assume 0 or just use 'new'
        const graphData = activity.map(a => ({
            name: new Date(a._id).toLocaleDateString('en-US', { weekday: 'short' }),
            new: a.new,
            active: 0 // Placeholder as we don't track login history daily yet
        }));

        res.json({
            stats: {
                totalUsers,
                totalStudents,
                totalFaculty,
                totalCourses: countCourses,
                totalRevenue
            },
            recentUsers,
            distribution,
            graphData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search for users (limited fields)
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res, next) => {
    try {
        const { search, query, role } = req.query;
        const searchTerm = String(search || query || '').trim();

        // If no search term, return a few recent users (excluding requester)
        if (!searchTerm) {
            const users = await User.find({ _id: { $ne: req.user._id } })
                .select('name email role profile.avatar')
                .limit(5)
                .sort({ createdAt: -1 });
            return res.json(users);
        }

        const filter = {
            _id: { $ne: req.user._id },
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        if (role) filter.role = role;

        const users = await User.find(filter)
            .select('name email role profile.avatar studentProfile.rollNo facultyProfile.employeeId')
            .limit(10);
        res.json(users);
    } catch (error) {
        console.error("Search Users Error:", error);
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile, getUsers, deleteUser, getDashboardStats, updateUser, searchUsers };
