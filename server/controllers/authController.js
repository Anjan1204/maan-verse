const User = require('../models/User');
const AdminRegistrationRequest = require('../models/AdminRegistrationRequest');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user is admin
            if (user.role === 'admin' && !user.isApproved) {
                res.status(403);
                throw new Error('Admin approval pending. Please wait for the main admin to approve your account.');
            }

            // Normal login
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                studentProfile: user.studentProfile,
                facultyProfile: user.facultyProfile,
                adminProfile: user.adminProfile,
                token: generateToken(user._id),
            });
        } else {
            const pendingRequest = await AdminRegistrationRequest.findOne({ email });
            if (pendingRequest) {
                res.status(403);
                throw new Error('Your admin registration is still pending approval. Please wait for the main admin to approve your account.');
            }
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

        const requestExists = await AdminRegistrationRequest.findOne({ email });
        if (requestExists) {
            res.status(400);
            throw new Error('An admin registration request for this email is already pending approval');
        }

        let isMainAdmin = false;
        let requiresApproval = false;

        if (role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount === 0) {
                isMainAdmin = true;
            } else {
                requiresApproval = true;
            }
        }

        if (requiresApproval) {
            const registrationRequest = await AdminRegistrationRequest.create({
                name,
                email,
                password,
                role: 'admin'
            });

            if (registrationRequest) {
                const io = req.app.get('io');
                if (io) {
                    io.emit('admin:approval_request', {
                        _id: registrationRequest._id,
                        name: registrationRequest.name,
                        email: registrationRequest.email
                    });
                }

                return res.status(201).json({
                    message: 'Registration successful! Your account is pending approval by the main admin.',
                    pendingApproval: true
                });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            isMainAdmin,
            isApproved: true // Direct creation means it's approved (or doesn't need it)
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
                profile: user.profile,
                studentProfile: user.studentProfile,
                facultyProfile: user.facultyProfile,
                adminProfile: user.adminProfile,
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
