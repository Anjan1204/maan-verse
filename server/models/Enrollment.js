const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    progress: {
        type: Number,
        default: 0, // Percentage
    },
    completedChapters: [{
        type: String, // Chapter ID or Title
    }],
    isCompleted: {
        type: Boolean,
        default: false,
    },
    coursePoints: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
