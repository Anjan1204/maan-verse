const Fee = require('../models/Fee');
const User = require('../models/User');

// @desc    Create a new fee record
// @route   POST /api/fees
// @access  Private/Admin
const createFee = async (req, res) => {
    try {
        const { studentId, amount, type, semester, dueDate } = req.body;

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        const fee = await Fee.create({
            student: studentId,
            amount,
            type,
            semester,
            dueDate
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get fees for a specific student
// @route   GET /api/fees/student/:studentId
// @access  Private (Admin/Student)
const getStudentFees = async (req, res) => {
    try {
        // Students can only see their own fees
        if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const fees = await Fee.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private/Admin
const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find({}).populate('student', 'name email studentProfile.rollNo');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update fee status
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updateFeeStatus = async (req, res) => {
    try {
        const { status, transactionId } = req.body;
        const fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({ message: 'Fee record not found' });
        }

        fee.status = status || fee.status;
        fee.transactionId = transactionId || fee.transactionId;

        if (status === 'Paid' && !fee.paidAt) {
            fee.paidAt = Date.now();
        }

        const updatedFee = await fee.save();
        res.json(updatedFee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Bulk assign fees to students by branch/semester
// @route   POST /api/fees/bulk
// @access  Private/Admin
const bulkAssignFees = async (req, res) => {
    try {
        const { amount, type, semester, branch, dueDate } = req.body;

        const query = { role: 'student' };
        if (semester) query['studentProfile.semester'] = semester;
        if (branch) query['studentProfile.branch'] = branch;

        const students = await User.find(query);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found matching the criteria' });
        }

        const feeRecords = students.map(student => ({
            student: student._id,
            amount,
            type,
            semester,
            dueDate
        }));

        const result = await Fee.insertMany(feeRecords);

        res.status(201).json({
            message: `Successfully assigned fees to ${result.length} students`,
            count: result.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createFee,
    getStudentFees,
    getAllFees,
    updateFeeStatus,
    bulkAssignFees
};
