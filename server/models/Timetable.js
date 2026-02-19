const mongoose = require('mongoose');

const timetableSchema = mongoose.Schema({
    branch: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    slots: [{
        time: String,
        subject: String,
        teacher: String,
        room: String,
        meetingLink: String,
        meetingPassword: String,
    }],
    isPublished: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;
