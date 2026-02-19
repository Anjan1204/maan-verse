const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    content: {
        type: String, // For text-based submissions
    },
    grade: {
        type: Number,
    },
    feedback: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Graded', 'Late'],
        default: 'Submitted',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
