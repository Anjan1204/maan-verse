const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const crypto = require('crypto');
const loginRequests = require('../utils/loginRequests');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user is admin
            // Check if user is admin
            if (user.role === 'admin') {
                if (!user.isApproved) {
                    res.status(403);
                    throw new Error('Admin approval pending. Please wait for the main admin to approve your account.');
                }
            }

            // Normal login (Student/Faculty or First Admin)
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        let isMainAdmin = false;
        let isApproved = true; // Default true for non-admins

        if (role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount === 0) {
                isMainAdmin = true;
                isApproved = true;
            } else {
                isApproved = false;
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            isMainAdmin,
            isApproved
        });

        if (user) {
            const io = req.app.get('io');
            if (io) {
                io.emit('user:new', {
                    _id: user._id,
                    name: user.name,
                    role: user.role
                });
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { authUser, registerUser };
