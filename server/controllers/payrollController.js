const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc    Generate payroll for a faculty
// @route   POST /api/payroll
// @access  Private/Admin
const createPayroll = async (req, res) => {
    try {
        const { facultyId, month, baseSalary, bonuses, deductions } = req.body;

        const faculty = await User.findById(facultyId);
        if (!faculty || faculty.role !== 'faculty') {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const netSalary = Number(baseSalary) + Number(bonuses || 0) - Number(deductions || 0);

        const payroll = await Payroll.create({
            faculty: facultyId,
            month,
            baseSalary,
            bonuses,
            deductions,
            netSalary
        });

        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get payroll for a specific faculty
// @route   GET /api/payroll/faculty/:facultyId
// @access  Private (Admin/Faculty)
const getFacultyPayroll = async (req, res) => {
    try {
        // Faculty can only see their own payroll
        if (req.user.role === 'faculty' && req.user._id.toString() !== req.params.facultyId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const payrolls = await Payroll.find({ faculty: req.params.facultyId }).sort({ createdAt: -1 });
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all payrolls
// @route   GET /api/payroll
// @access  Private/Admin
const getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find({}).populate('faculty', 'name email');
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update payroll status
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayrollStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payroll = await Payroll.findById(req.params.id);

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        payroll.status = status || payroll.status;

        if (status === 'Paid' && !payroll.paidAt) {
            payroll.paidAt = Date.now();
        }

        const updatedPayroll = await payroll.save();
        res.json(updatedPayroll);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Bulk generate payroll for all faculty
// @route   POST /api/payroll/bulk
// @access  Private/Admin
const bulkGeneratePayroll = async (req, res) => {
    try {
        const { month, baseSalary, bonuses, deductions } = req.body;

        const faculties = await User.find({ role: 'faculty', isActive: true });

        if (faculties.length === 0) {
            return res.status(404).json({ message: 'No active faculty found' });
        }

        const payrollRecords = faculties.map(faculty => {
            const netSalary = Number(baseSalary) + Number(bonuses || 0) - Number(deductions || 0);
            return {
                faculty: faculty._id,
                month,
                baseSalary,
                bonuses,
                deductions,
                netSalary
            };
        });

        // Prevention: Avoid duplicate payroll for same faculty in same month (Basic check)
        const existing = await Payroll.find({ month, faculty: { $in: faculties.map(f => f._id) } });
        const existingFacultyIds = existing.map(p => p.faculty.toString());

        const finalRecords = payrollRecords.filter(r => !existingFacultyIds.includes(r.faculty.toString()));

        if (finalRecords.length === 0) {
            return res.status(400).json({ message: 'Payroll already generated for all faculty for this month' });
        }

        const result = await Payroll.insertMany(finalRecords);

        res.status(201).json({
            message: `Successfully generated payroll for ${result.length} faculty members`,
            count: result.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createPayroll,
    getFacultyPayroll,
    getAllPayrolls,
    updatePayrollStatus,
    bulkGeneratePayroll
};
