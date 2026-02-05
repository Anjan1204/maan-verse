const FacultyInquiry = require('../models/FacultyInquiry');
const User = require('../models/User');

// @desc    Create new faculty inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
    try {
        console.log('Received inquiry request:', req.body);
        const { name, email, phone, query } = req.body;

        if (!name || !email || !phone || !query) {
            console.log('Validation failed: missing fields');
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const inquiry = await FacultyInquiry.create({
            name,
            email,
            phone,
            query
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('inquiry:new', inquiry);
        }

        console.log('Inquiry created successfully:', inquiry._id);
        res.status(201).json(inquiry);
    } catch (error) {
        console.error('Inquiry creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
    try {
        const inquiries = await FacultyInquiry.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
    try {
        console.log(`[DEBUG] Updating inquiry ${req.params.id} with status: ${req.body.status}`);
        const inquiry = await FacultyInquiry.findById(req.params.id);

        if (inquiry) {

            // Logic: If status is 'Accepted', create a Faculty User
            if (req.body.status === 'Accepted' && inquiry.status !== 'Accepted') {
                const userExists = await User.findOne({ email: inquiry.email });
                if (userExists) {
                    console.log(`[DEBUG] User already exists for email: ${inquiry.email}`);
                    // Optionally update role if not faculty?
                    // For now, just proceed to mark inquiry accepted
                } else {
                    console.log(`[DEBUG] Creating new Faculty user for: ${inquiry.email}`);
                    // Create new user
                    const newUser = await User.create({
                        name: inquiry.name,
                        email: inquiry.email.toLowerCase(),
                        password: 'welcome123', // Default Password
                        role: 'faculty',
                        facultyProfile: {
                            department: 'General', // Default
                            designation: 'New Faculty',
                            phone: inquiry.phone,
                            joinDate: new Date()
                        }
                    });
                    console.log(`[DEBUG] New user created: ${newUser._id}`);
                }
            }

            inquiry.status = req.body.status || inquiry.status;
            const updatedInquiry = await inquiry.save();
            console.log(`[DEBUG] Update successful:`, updatedInquiry);
            res.json(updatedInquiry);
        } else {
            console.log(`[DEBUG] Inquiry not found`);
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        console.error(`[DEBUG] Update failed:`, error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInquiry,
    getInquiries,
    updateInquiryStatus
};
