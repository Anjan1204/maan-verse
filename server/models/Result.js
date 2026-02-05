const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true, // Link result to a specific course context
    },
    marksObtained: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    grade: {
        type: String, // A, B, C, etc.
    },
    feedback: {
        type: String,
    }
}, {
    timestamps: true,
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
