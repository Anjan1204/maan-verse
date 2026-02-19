const mongoose = require('mongoose');

const payrollSchema = mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String, // e.g. "October 2025"
        required: true,
    },
    baseSalary: {
        type: Number,
        required: true,
    },
    bonuses: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Generated', 'Paid'],
        default: 'Generated',
    },
    paidAt: {
        type: Date,
    }
}, {
    timestamps: true,
});

const Payroll = mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;
