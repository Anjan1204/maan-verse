const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Important', 'General', 'Exam', 'Event'],
        default: 'General',
    },
    targetAudience: {
        type: String,
        enum: ['All', 'Student', 'Faculty'],
        default: 'All',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
