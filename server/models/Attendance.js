const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    day: {
        type: String, // Mon, Tue, etc.
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
    },
    subject: {
        type: String, // Or ref to Course if tied strictly
        required: true,
    }
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
