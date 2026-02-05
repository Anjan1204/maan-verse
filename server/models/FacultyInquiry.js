const mongoose = require('mongoose');

const facultyInquirySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    query: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Contacted', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

const FacultyInquiry = mongoose.model('FacultyInquiry', facultyInquirySchema);
module.exports = FacultyInquiry;
