const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    certificateId: {
        type: String,
        required: true,
        unique: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    downloadUrl: {
        type: String,
    }
}, {
    timestamps: true,
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
