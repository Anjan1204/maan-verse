const mongoose = require('mongoose');

const forumCommentSchema = mongoose.Schema({
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumThread',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true,
});

const ForumComment = mongoose.model('ForumComment', forumCommentSchema);
module.exports = ForumComment;
