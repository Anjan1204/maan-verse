const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Responded'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
