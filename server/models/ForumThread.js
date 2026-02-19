const mongoose = require('mongoose');

const forumThreadSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isAnnouncement: {
        type: Boolean,
        default: false,
    },
    tags: [String],
}, {
    timestamps: true,
});

const ForumThread = mongoose.model('ForumThread', forumThreadSchema);
module.exports = ForumThread;
