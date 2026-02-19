const mongoose = require('mongoose');

const feeSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['Tuition', 'Exam', 'Hostel', 'Library', 'Other'],
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
    },
    paidAt: {
        type: Date,
    }
}, {
    timestamps: true,
});

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
