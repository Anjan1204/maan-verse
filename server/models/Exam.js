const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    title: {
        type: String, // e.g., Mid-Term Exams Dec 2025
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // not making it required yet to avoid breaking existing exams immediately, 
        // but it should be for new flow
    },
    schedule: [{
        subject: String,
        date: Date,
        time: String,
        type: { type: String, enum: ['Internal', 'External'], default: 'External' }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
